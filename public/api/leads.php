<?php
/* ============================================
   Lead Storage API — Icon Commerce College
   Server-side shared storage for admission-enquiry
   leads so the admin panel can see leads submitted
   from any browser/device (localStorage is per-device).

   Lead record shape (college fields, design-system §8):
     name             (req)  Applicant full name
     mobile           (req)  Indian 10-digit mobile (no +91)
     email            (opt)  Email address
     program_interest        B.Com / BBA / BCA / B.A. / Undecided
     service_interest        Mirror of program_interest — canonical key
                             read by the admin panel (kept for compat)
     state                   Home state (Assam + NE India + Other)
     message          (opt)  Free-text question
     + auto: lead_id, source, status, submitted_at, updated_at,
             page_url, user_agent, utm_* params, gclid, notes[], activity[]
   This endpoint is field-agnostic: it stores whatever the
   client sends, so adding/renaming fields needs no PHP change.

   Endpoints (all on this single file):
     POST /api/leads.php?action=create
       Body: { "lead": {...} }
       Public — no auth. Called by webhookSubmit.js.

     GET  /api/leads.php?action=list
       Header: X-Admin-Key: <ADMIN_API_KEY>
       Returns all stored leads. Used by the admin
       panel to populate/refresh its LMS.

     POST /api/leads.php?action=update
       Header: X-Admin-Key
       Body: { "lead_id": "...", "patch": {...} }
       Merges patch into the lead. Used for status /
       note / activity updates from the admin panel.

     POST /api/leads.php?action=delete
       Header: X-Admin-Key
       Body: { "lead_ids": ["..."] }
       Removes leads by id.

   Storage: a JSON file at api/data/leads.json.
   The data/ folder is created on first use and
   protected with a .htaccess "Deny from all".
   ============================================ */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ----- Storage paths -----
$dataDir  = __DIR__ . '/data';
$dataFile = $dataDir . '/leads.json';

// Ensure the JSON store directory exists AND is writable by the PHP/web-server
// user. This is the #1 reason a fresh deploy "submits" but never saves: the
// build was uploaded but api/data/ was missing or left non-writable, so every
// write (leads, notices, events) fails with a generic 500. We now create it
// with group-writable perms, self-heal a too-strict mode, and report the exact
// reason so the failure is diagnosable (see the ?action=health endpoint and the
// `reason` field returned on a save failure).
//
// Returns [bool $ok, string $reason]. Kept self-contained (no shared include)
// so this single endpoint file is the only thing that must reach the server.
function ensure_data_dir($dir) {
    if (!is_dir($dir)) {
        if (!@mkdir($dir, 0775, true) && !is_dir($dir)) {
            return [false, "Could not create data directory ($dir) — its parent is not writable by the PHP/web-server user. Create api/data/ and chmod it to 0775."];
        }
        @chmod($dir, 0775);
        // Block direct HTTP access to the JSON store (Apache 2.4 + legacy 2.2).
        @file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n");
        @file_put_contents($dir . '/index.html', '');
    }
    if (!is_writable($dir)) {
        @chmod($dir, 0775); // self-heal a restrictive umask if we own the dir
    }
    if (!is_writable($dir)) {
        return [false, "Data directory ($dir) is not writable by the PHP/web-server user. chmod it to 0775 and make sure it is owned by the app user."];
    }
    return [true, ''];
}

list($dataDirOk, $dataDirReason) = ensure_data_dir($dataDir);

// ----- Resolve the admin key used to gate list/update/delete -----
//
// The admin panel reads the shared lead store using REACT_APP_LEADS_ADMIN_KEY,
// which is compiled into the public client bundle — so this value is NOT a
// real secret, it is just the handshake that keeps the admin panel and this
// API in sync. Previously the key lived ONLY in config.php, which is
// .gitignore'd and therefore never reaches the server on a fresh deploy. When
// it was missing, list/update/delete returned 503 and the admin panel could
// never load leads submitted from other devices. We now resolve the key from
// several sources, falling back to a committed default that matches the value
// in .env so cross-device sync works out of the box without a manual
// server-side config step.
//
// Resolution order (first non-empty wins):
//   1. ADMIN_API_KEY defined in config.php (highest priority — lets an
//      operator override the default with their own secret).
//   2. LEADS_ADMIN_KEY / ADMIN_API_KEY environment variable (e.g. set in the
//      Cloudways application settings).
//   3. The committed default below, which MUST match REACT_APP_LEADS_ADMIN_KEY
//      in .env. Change BOTH together to lock the API down to a private key.
$adminKey       = '';
$adminKeySource = 'none';
$configFile = __DIR__ . '/config.php';
if (file_exists($configFile)) {
    require_once $configFile;
    if (defined('ADMIN_API_KEY')) {
        $adminKey       = ADMIN_API_KEY;
        $adminKeySource = 'config.php';
    }
}
if ($adminKey === '') {
    $envKey = getenv('LEADS_ADMIN_KEY');
    if (!$envKey) {
        $envKey = getenv('ADMIN_API_KEY');
    }
    if ($envKey) {
        $adminKey       = $envKey;
        $adminKeySource = 'env';
    }
}
if ($adminKey === '') {
    // Default — keep in sync with REACT_APP_LEADS_ADMIN_KEY in .env.
    $adminKey       = 'skdfjsdfweiormcnzxmzdlkfjds';
    $adminKeySource = 'default';
}

// ----- Helpers -----
function load_leads($file) {
    if (!file_exists($file)) return [];
    $raw = @file_get_contents($file);
    if ($raw === false || $raw === '') return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function save_leads($file, $leads) {
    $fp = fopen($file, 'c+');
    if (!$fp) return false;
    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        return false;
    }
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($leads, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return true;
}

// Union-merge two append-only arrays (notes or activity) coming from different
// devices, de-duping by a stable key and sorting chronologically. This is what
// keeps notes and the activity timeline in sync: each admin device mirrors its
// own (possibly stale) full array, so a plain overwrite would let one device
// drop entries another device added. Merging instead accumulates every entry.
function merge_lead_array($existing, $incoming, $type) {
    $existing = is_array($existing) ? $existing : [];
    $incoming = is_array($incoming) ? $incoming : [];
    $byKey = [];
    foreach (array_merge($existing, $incoming) as $item) {
        if (!is_array($item)) continue;
        if ($type === 'notes') {
            $key = (isset($item['id']) && $item['id'] !== '')
                ? 'id:' . $item['id']
                : 't:' . ($item['timestamp'] ?? '') . '|' . ($item['text'] ?? '');
        } else {
            $key = ($item['timestamp'] ?? '') . '|' . ($item['action'] ?? '');
        }
        if (!isset($byKey[$key])) {
            $byKey[$key] = $item;
        }
    }
    $result = array_values($byKey);
    // ISO 8601 timestamps sort correctly as plain strings.
    usort($result, function ($a, $b) {
        return strcmp($a['timestamp'] ?? '', $b['timestamp'] ?? '');
    });
    return $result;
}

function require_admin_auth($expected) {
    if (empty($expected)) {
        http_response_code(503);
        echo json_encode(['error' => 'Admin API key not configured on server']);
        exit;
    }
    $provided = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
    if (!is_string($provided) || !hash_equals($expected, $provided)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

// ----- Parse request -----
$method = $_SERVER['REQUEST_METHOD'];
$raw    = file_get_contents('php://input');
$input  = json_decode($raw, true);
if (!is_array($input)) $input = [];
$action = $_GET['action'] ?? ($input['action'] ?? '');

// ----- Routes -----

// Health / self-diagnostics — PUBLIC, but never leaks the key VALUE (only where
// it was resolved from). Open /api/leads.php?action=health in a browser after a
// deploy to confirm the API is running and the data dir is writable. This turns
// an invisible "we couldn't submit your enquiry" 500 into a one-click diagnosis.
if ($action === 'health') {
    $probeOk = false;
    if ($dataDirOk) {
        $probe   = $dataDir . '/.write-probe';
        $probeOk = @file_put_contents($probe, '1') !== false;
        if ($probeOk) {
            @unlink($probe);
        }
    }
    echo json_encode([
        'ok'                 => $dataDirOk && $probeOk,
        'endpoint'           => 'leads.php',
        'php_version'        => PHP_VERSION,
        'data_dir'           => $dataDir,
        'data_dir_exists'    => is_dir($dataDir),
        'data_dir_writable'  => $dataDirOk && is_writable($dataDir),
        'write_probe_ok'     => $probeOk,
        'records'            => count(load_leads($dataFile)),
        'admin_key_present'  => $adminKey !== '',
        'admin_key_source'   => $adminKeySource,
        'reason'             => $dataDirOk ? '' : $dataDirReason,
    ]);
    exit;
}

if ($method === 'GET' && ($action === '' || $action === 'list')) {
    require_admin_auth($adminKey);
    echo json_encode(['success' => true, 'leads' => load_leads($dataFile)]);
    exit;
}

if ($method === 'POST' && $action === 'create') {
    $lead = $input['lead'] ?? null;
    if (!is_array($lead) || empty($lead['lead_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid lead payload']);
        exit;
    }
    if (!$dataDirOk) {
        http_response_code(500);
        echo json_encode(['error' => 'Storage unavailable', 'reason' => $dataDirReason]);
        exit;
    }
    $leads = load_leads($dataFile);
    // Dedup by lead_id (idempotent re-submits) and by mobile number
    // (cross-device duplicate prevention — the same applicant submitting
    // again from any browser/device is treated as a duplicate).
    $incomingMobile = isset($lead['mobile']) ? trim((string) $lead['mobile']) : '';
    foreach ($leads as $existing) {
        if (($existing['lead_id'] ?? null) === $lead['lead_id']) {
            echo json_encode(['success' => true, 'duplicate' => true]);
            exit;
        }
        if ($incomingMobile !== '' && trim((string) ($existing['mobile'] ?? '')) === $incomingMobile) {
            echo json_encode(['success' => true, 'duplicate' => true]);
            exit;
        }
    }
    $leads[] = $lead;
    if (!save_leads($dataFile, $leads)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save lead', 'reason' => $dataDirReason ?: 'Could not write to the leads store.']);
        exit;
    }
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'POST' && $action === 'update') {
    require_admin_auth($adminKey);
    $id    = $input['lead_id'] ?? '';
    $patch = $input['patch'] ?? null;
    if (!$id || !is_array($patch)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing lead_id or patch']);
        exit;
    }
    $leads = load_leads($dataFile);
    $found = false;
    foreach ($leads as &$lead) {
        if (($lead['lead_id'] ?? null) === $id) {
            foreach ($patch as $k => $v) {
                if (($k === 'notes' || $k === 'activity') && is_array($v)) {
                    // Append-only arrays: union with what we already have so a
                    // stale array from one device can't erase another device's
                    // entries.
                    $lead[$k] = merge_lead_array($lead[$k] ?? [], $v, $k);
                } else {
                    // Scalar fields (status, conversion tracking, updated_at):
                    // last-write-wins straight replace.
                    $lead[$k] = $v;
                }
            }
            $found = true;
            break;
        }
    }
    unset($lead);
    if (!$found) {
        http_response_code(404);
        echo json_encode(['error' => 'Lead not found']);
        exit;
    }
    save_leads($dataFile, $leads);
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'POST' && $action === 'delete') {
    require_admin_auth($adminKey);
    $ids = $input['lead_ids'] ?? [];
    if (!is_array($ids) || count($ids) === 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing lead_ids']);
        exit;
    }
    $idSet = array_flip($ids);
    $leads = load_leads($dataFile);
    $remaining = [];
    foreach ($leads as $lead) {
        $lid = $lead['lead_id'] ?? '';
        if (!isset($idSet[$lid])) {
            $remaining[] = $lead;
        }
    }
    save_leads($dataFile, $remaining);
    echo json_encode([
        'success' => true,
        'removed' => count($leads) - count($remaining),
    ]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Unknown action']);
