<?php
/* ============================================
   Notices Storage API — Icon Commerce College
   Server-side shared store for the notices shown on the
   public website (Home notice board + /notices) and managed
   from the admin panel. Mirrors leads.php so every browser/
   device sees the same notices (no localStorage copy).

   Notice record shape (design-system §8, prompt 28):
     id              (auto)  uuid, generated server-side if missing
     title           (req)   headline
     body            (opt)   plain text / markdown
     category                Admission | Examination | Event |
                             General | Result | Holiday (defaults General)
     date            (req)   ISO date — display / publish date
     pinned                  bool — floats to the top of the list
     published               bool — false = draft, hidden from public
     attachment_url  (opt)   link to a PDF / image
     + auto: created_at, updated_at (ISO timestamps)
   Like leads.php this endpoint is field-agnostic: it stores
   whatever the client sends, only normalising the structural
   fields above, so adding a field needs no PHP change.

   Endpoints (all on this single file):
     GET  /api/notices.php?action=list
       PUBLIC — no auth. The website reads notices here.
       Returns published notices, sorted pinned-first then
       date desc. If a valid X-Admin-Key is supplied the admin
       panel also receives drafts (published=false).

     POST /api/notices.php?action=create
       Header: X-Admin-Key: <ADMIN_API_KEY>
       Body: { "notice": {...} }

     POST /api/notices.php?action=update
       Header: X-Admin-Key
       Body: { "id": "...", "patch": {...} }
       Merges patch into the notice (last-write-wins).

     POST /api/notices.php?action=delete
       Header: X-Admin-Key
       Body: { "ids": ["..."] }
       Removes notices by id.

   Storage: a JSON file at api/data/notices.json.
   The data/ folder is created on first use and protected
   with a .htaccess "Deny from all".
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
$dataFile = $dataDir . '/notices.json';

if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
    @file_put_contents($dataDir . '/.htaccess', "Require all denied\nDeny from all\n");
    @file_put_contents($dataDir . '/index.html', '');
}

// ----- Allowed notice categories (design-system §8) -----
$ALLOWED_CATEGORIES = ['Admission', 'Examination', 'Event', 'General', 'Result', 'Holiday'];

// ----- Resolve the admin key used to gate create/update/delete -----
//
// Notices reuse the SAME shared secret as leads (REACT_APP_LEADS_ADMIN_KEY),
// which is compiled into the public client bundle — so this value is NOT a real
// secret, it is just the handshake that keeps the admin panel and this API in
// sync. The resolution order below is identical to leads.php so both endpoints
// always agree on the key:
//   1. ADMIN_API_KEY defined in config.php (highest priority — lets an operator
//      override the default with their own secret; .gitignore'd).
//   2. LEADS_ADMIN_KEY / ADMIN_API_KEY environment variable (e.g. Cloudways
//      application settings).
//   3. The committed default below, which MUST match REACT_APP_LEADS_ADMIN_KEY
//      in .env (and the default in leads.php). Change them together to lock the
//      API down to a private key.
$adminKey   = '';
$configFile = __DIR__ . '/config.php';
if (file_exists($configFile)) {
    require_once $configFile;
    if (defined('ADMIN_API_KEY')) {
        $adminKey = ADMIN_API_KEY;
    }
}
if ($adminKey === '') {
    $envKey = getenv('LEADS_ADMIN_KEY');
    if (!$envKey) {
        $envKey = getenv('ADMIN_API_KEY');
    }
    if ($envKey) {
        $adminKey = $envKey;
    }
}
if ($adminKey === '') {
    // Default — keep in sync with REACT_APP_LEADS_ADMIN_KEY in .env and the
    // matching default in leads.php.
    $adminKey = 'skdfjsdfweiormcnzxmzdlkfjds';
}

// ----- Helpers -----
function load_notices($file) {
    if (!file_exists($file)) return [];
    $raw = @file_get_contents($file);
    if ($raw === false || $raw === '') return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function save_notices($file, $notices) {
    $fp = fopen($file, 'c+');
    if (!$fp) return false;
    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        return false;
    }
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($notices, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return true;
}

// RFC 4122 v4 UUID. random_bytes is available on PHP 7+/8+ (Cloudways); the
// uniqid fallback only runs on the rare host without a CSPRNG.
function generate_uuid() {
    try {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    } catch (Exception $e) {
        return uniqid('notice-', true);
    }
}

// Robust boolean coercion: JSON booleans pass straight through, but be lenient
// about the string/int forms a curl client might send ("false", "0", etc.).
function to_bool($v, $default = false) {
    if (is_bool($v)) return $v;
    if (is_int($v) || is_float($v)) return $v != 0;
    if (is_string($v)) {
        $s = strtolower(trim($v));
        if (in_array($s, ['false', '0', 'no', 'off', ''], true)) return false;
        if (in_array($s, ['true', '1', 'yes', 'on'], true)) return true;
    }
    return $default;
}

// Normalise the structural fields of a notice in place, preserving any extra
// fields the client sent (field-agnostic, like leads.php). `$isNew` stamps a
// fresh id/created_at for newly created records.
function normalize_notice($notice, $allowedCategories, $isNew) {
    $now = gmdate('c'); // ISO 8601 (UTC)

    if ($isNew && empty($notice['id'])) {
        $notice['id'] = generate_uuid();
    }

    $cat = isset($notice['category']) ? (string) $notice['category'] : '';
    if (!in_array($cat, $allowedCategories, true)) {
        $notice['category'] = 'General';
    }

    if (isset($notice['title'])) $notice['title'] = trim((string) $notice['title']);
    if (isset($notice['body']))  $notice['body']  = (string) $notice['body'];

    $notice['pinned']    = to_bool($notice['pinned'] ?? false, false);
    $notice['published'] = to_bool($notice['published'] ?? true, true);

    if ($isNew && empty($notice['created_at'])) {
        $notice['created_at'] = $now;
    }
    $notice['updated_at'] = $now;

    return $notice;
}

// Sort: pinned first, then most-recent display date first.
function sort_notices(&$notices) {
    usort($notices, function ($a, $b) {
        $ap = !empty($a['pinned']);
        $bp = !empty($b['pinned']);
        if ($ap !== $bp) return $ap ? -1 : 1;
        $ad = strtotime($a['date'] ?? '') ?: 0;
        $bd = strtotime($b['date'] ?? '') ?: 0;
        if ($ad === $bd) return 0;
        return ($ad < $bd) ? 1 : -1;
    });
}

// Hard gate for writes — exits 401/503 on failure.
function require_admin_auth($expected) {
    if (empty($expected)) {
        http_response_code(503);
        echo json_encode(['error' => 'Admin API key not configured on server']);
        exit;
    }
    if (!has_admin_key($expected)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

// Soft check for reads — true when a valid admin key is present, so the list
// endpoint can include drafts for the admin without rejecting the public.
function has_admin_key($expected) {
    if (empty($expected)) return false;
    $provided = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
    return is_string($provided) && $provided !== '' && hash_equals($expected, $provided);
}

// ----- Parse request -----
$method = $_SERVER['REQUEST_METHOD'];
$raw    = file_get_contents('php://input');
$input  = json_decode($raw, true);
if (!is_array($input)) $input = [];
$action = $_GET['action'] ?? ($input['action'] ?? '');

// ----- Routes -----
if ($method === 'GET' && ($action === '' || $action === 'list')) {
    $notices = load_notices($dataFile);
    // Public callers only see published notices; a valid admin key also reveals
    // drafts so the panel can manage them.
    if (!has_admin_key($adminKey)) {
        $notices = array_values(array_filter($notices, function ($n) {
            return !empty($n['published']);
        }));
    }
    sort_notices($notices);
    echo json_encode(['success' => true, 'notices' => $notices]);
    exit;
}

if ($method === 'POST' && $action === 'create') {
    require_admin_auth($adminKey);
    $notice = $input['notice'] ?? null;
    if (!is_array($notice)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid notice payload']);
        exit;
    }
    $title = isset($notice['title']) ? trim((string) $notice['title']) : '';
    $date  = isset($notice['date']) ? trim((string) $notice['date']) : '';
    if ($title === '' || $date === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields: title, date']);
        exit;
    }
    $notice = normalize_notice($notice, $ALLOWED_CATEGORIES, true);

    $notices = load_notices($dataFile);
    // Idempotent re-submits: if the client supplied an id we already have, treat
    // it as a duplicate instead of appending a second copy.
    foreach ($notices as $existing) {
        if (($existing['id'] ?? null) === $notice['id']) {
            echo json_encode(['success' => true, 'duplicate' => true, 'notice' => $existing]);
            exit;
        }
    }
    $notices[] = $notice;
    if (!save_notices($dataFile, $notices)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save notice']);
        exit;
    }
    echo json_encode(['success' => true, 'notice' => $notice]);
    exit;
}

if ($method === 'POST' && $action === 'update') {
    require_admin_auth($adminKey);
    $id    = $input['id'] ?? '';
    $patch = $input['patch'] ?? null;
    if (!$id || !is_array($patch)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing id or patch']);
        exit;
    }
    $notices = load_notices($dataFile);
    $found   = false;
    $updated = null;
    foreach ($notices as &$notice) {
        if (($notice['id'] ?? null) === $id) {
            foreach ($patch as $k => $v) {
                // id and created_at are immutable.
                if ($k === 'id' || $k === 'created_at') continue;
                $notice[$k] = $v;
            }
            // Re-normalise structural fields (false keeps id/created_at intact
            // and refreshes updated_at).
            $notice  = normalize_notice($notice, $ALLOWED_CATEGORIES, false);
            $updated = $notice;
            $found   = true;
            break;
        }
    }
    unset($notice);
    if (!$found) {
        http_response_code(404);
        echo json_encode(['error' => 'Notice not found']);
        exit;
    }
    if (!save_notices($dataFile, $notices)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save notice']);
        exit;
    }
    echo json_encode(['success' => true, 'notice' => $updated]);
    exit;
}

if ($method === 'POST' && $action === 'delete') {
    require_admin_auth($adminKey);
    $ids = $input['ids'] ?? [];
    if (!is_array($ids) || count($ids) === 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing ids']);
        exit;
    }
    $idSet     = array_flip($ids);
    $notices   = load_notices($dataFile);
    $remaining = [];
    foreach ($notices as $notice) {
        $nid = $notice['id'] ?? '';
        if (!isset($idSet[$nid])) {
            $remaining[] = $notice;
        }
    }
    if (!save_notices($dataFile, $remaining)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save notices']);
        exit;
    }
    echo json_encode([
        'success' => true,
        'removed' => count($notices) - count($remaining),
    ]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Unknown action']);
