<?php
/* ============================================
   Events Storage API — Icon Commerce College
   Server-side shared store for the events/calendar shown on
   the public website (/events) and managed from the admin
   panel. Mirrors notices.php / leads.php so every browser/
   device sees the same events (no localStorage copy).

   Event record shape (design-system §8, prompt 30):
     id              (auto)  uuid, generated server-side if missing
     title           (req)   event name
     description     (opt)   plain text / markdown
     category                Academic | Cultural | Sports | Examination |
                             Holiday | Workshop | General (defaults General)
     start_date      (req)   ISO date — first day of the event
     end_date        (opt)   ISO date — last day (multi-day events)
     start_time      (opt)   HH:mm
     end_time        (opt)   HH:mm
     venue           (opt)   location string
     image_url       (opt)   placeholder name / link
     published               bool — false = draft, hidden from public
     + auto: created_at, updated_at (ISO timestamps)
   Like notices.php this endpoint is field-agnostic: it stores
   whatever the client sends, only normalising the structural
   fields above, so adding a field needs no PHP change.

   Endpoints (all on this single file):
     GET  /api/events.php?action=list
       PUBLIC — no auth. The website calendar reads events here.
       Returns published events, sorted by start_date (soonest
       first). Optional ?from=YYYY-MM-DD&to=YYYY-MM-DD restricts
       the result to events overlapping that date range. If a
       valid X-Admin-Key is supplied the admin panel also
       receives drafts (published=false).

     POST /api/events.php?action=create
       Header: X-Admin-Key: <ADMIN_API_KEY>
       Body: { "event": {...} }

     POST /api/events.php?action=update
       Header: X-Admin-Key
       Body: { "id": "...", "patch": {...} }
       Merges patch into the event (last-write-wins).

     POST /api/events.php?action=delete
       Header: X-Admin-Key
       Body: { "ids": ["..."] }
       Removes events by id.

   Storage: a JSON file at api/data/events.json.
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
$dataFile = $dataDir . '/events.json';

// Ensure the JSON store directory exists AND is writable by the PHP/web-server
// user — the #1 reason a fresh deploy fails to save (the build was uploaded but
// api/data/ was missing or left non-writable, so every write returns a generic
// 500). Create it group-writable, self-heal a too-strict mode, and report the
// exact reason (see ?action=health and the `reason` field on a save failure).
// Self-contained (no shared include) so this single file is all that must ship.
function ensure_data_dir($dir) {
    if (!is_dir($dir)) {
        if (!@mkdir($dir, 0775, true) && !is_dir($dir)) {
            return [false, "Could not create data directory ($dir) — its parent is not writable by the PHP/web-server user. Create api/data/ and chmod it to 0775."];
        }
        @chmod($dir, 0775);
        @file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n");
        @file_put_contents($dir . '/index.html', '');
    }
    if (!is_writable($dir)) {
        @chmod($dir, 0775);
    }
    if (!is_writable($dir)) {
        return [false, "Data directory ($dir) is not writable by the PHP/web-server user. chmod it to 0775 and make sure it is owned by the app user."];
    }
    return [true, ''];
}

list($dataDirOk, $dataDirReason) = ensure_data_dir($dataDir);

// ----- Allowed event categories (design-system §8) -----
$ALLOWED_CATEGORIES = ['Academic', 'Cultural', 'Sports', 'Examination', 'Holiday', 'Workshop', 'General'];

// ----- Resolve the admin key used to gate create/update/delete -----
//
// Events reuse the SAME shared secret as leads/notices (REACT_APP_LEADS_ADMIN_KEY),
// which is compiled into the public client bundle — so this value is NOT a real
// secret, it is just the handshake that keeps the admin panel and this API in
// sync. The resolution order below is identical to leads.php / notices.php so all
// endpoints always agree on the key:
//   1. ADMIN_API_KEY defined in config.php (highest priority — lets an operator
//      override the default with their own secret; .gitignore'd).
//   2. LEADS_ADMIN_KEY / ADMIN_API_KEY environment variable (e.g. Cloudways
//      application settings).
//   3. The committed default below, which MUST match REACT_APP_LEADS_ADMIN_KEY
//      in .env (and the default in leads.php / notices.php). Change them together
//      to lock the API down to a private key.
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
    // Default — keep in sync with REACT_APP_LEADS_ADMIN_KEY in .env and the
    // matching default in leads.php / notices.php.
    $adminKey       = 'skdfjsdfweiormcnzxmzdlkfjds';
    $adminKeySource = 'default';
}

// ----- Helpers -----
function load_events($file) {
    if (!file_exists($file)) return [];
    $raw = @file_get_contents($file);
    if ($raw === false || $raw === '') return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function save_events($file, $events) {
    $fp = fopen($file, 'c+');
    if (!$fp) return false;
    if (!flock($fp, LOCK_EX)) {
        fclose($fp);
        return false;
    }
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($events, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
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
        return uniqid('event-', true);
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

// Normalise the structural fields of an event in place, preserving any extra
// fields the client sent (field-agnostic, like notices.php). `$isNew` stamps a
// fresh id/created_at for newly created records.
function normalize_event($event, $allowedCategories, $isNew) {
    $now = gmdate('c'); // ISO 8601 (UTC)

    if ($isNew && empty($event['id'])) {
        $event['id'] = generate_uuid();
    }

    $cat = isset($event['category']) ? (string) $event['category'] : '';
    if (!in_array($cat, $allowedCategories, true)) {
        $event['category'] = 'General';
    }

    if (isset($event['title']))       $event['title']       = trim((string) $event['title']);
    if (isset($event['description'])) $event['description'] = (string) $event['description'];
    // Optional plain-string fields: trim when present so blanks normalise to ''.
    foreach (['start_date', 'end_date', 'start_time', 'end_time', 'venue', 'image_url'] as $field) {
        if (isset($event[$field])) $event[$field] = trim((string) $event[$field]);
    }

    $event['published'] = to_bool($event['published'] ?? true, true);

    if ($isNew && empty($event['created_at'])) {
        $event['created_at'] = $now;
    }
    $event['updated_at'] = $now;

    return $event;
}

// Sort by start_date ascending (soonest first — natural calendar order, matching
// the public useEvents() hook). Same-day events break the tie on start_time then
// title so the order is deterministic.
function sort_events(&$events) {
    usort($events, function ($a, $b) {
        $ad = strtotime($a['start_date'] ?? '') ?: 0;
        $bd = strtotime($b['start_date'] ?? '') ?: 0;
        if ($ad !== $bd) return ($ad < $bd) ? -1 : 1;
        $at = $a['start_time'] ?? '';
        $bt = $b['start_time'] ?? '';
        if ($at !== $bt) return strcmp($at, $bt);
        return strcmp($a['title'] ?? '', $b['title'] ?? '');
    });
}

// Keep events that overlap the requested [from, to] window. A multi-day event
// runs from start_date to end_date (falling back to start_date when no end_date),
// so it is included when it touches the window at either edge. `from`/`to` are
// optional and independent — passing just one bounds that side only.
function in_date_range($event, $from, $to) {
    $start = strtotime($event['start_date'] ?? '');
    if ($start === false) return false; // undated events never match a range query
    $endRaw = isset($event['end_date']) && $event['end_date'] !== ''
        ? $event['end_date']
        : ($event['start_date'] ?? '');
    $end = strtotime($endRaw);
    if ($end === false) $end = $start;

    if ($from !== '') {
        $fromTs = strtotime($from);
        if ($fromTs !== false && $end < $fromTs) return false;
    }
    if ($to !== '') {
        $toTs = strtotime($to);
        if ($toTs !== false && $start > $toTs) return false;
    }
    return true;
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

// Health / self-diagnostics — PUBLIC, but never leaks the key VALUE. Open
// /api/events.php?action=health after a deploy to confirm the API runs, the
// data dir is writable, AND (via admin_key_accepted) that the X-Admin-Key your
// admin build sends matches the server — the two reasons "Add Event" silently
// fails (500 not-writable vs 401 key-mismatch).
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
        'endpoint'           => 'events.php',
        'php_version'        => PHP_VERSION,
        'data_dir'           => $dataDir,
        'data_dir_exists'    => is_dir($dataDir),
        'data_dir_writable'  => $dataDirOk && is_writable($dataDir),
        'write_probe_ok'     => $probeOk,
        'records'            => count(load_events($dataFile)),
        'admin_key_present'  => $adminKey !== '',
        'admin_key_source'   => $adminKeySource,
        // True only if the caller sent a matching X-Admin-Key — lets the admin
        // confirm REACT_APP_LEADS_ADMIN_KEY in the build matches the server.
        'admin_key_accepted' => has_admin_key($adminKey),
        'reason'             => $dataDirOk ? '' : $dataDirReason,
    ]);
    exit;
}

if ($method === 'GET' && ($action === '' || $action === 'list')) {
    $events = load_events($dataFile);
    // Public callers only see published events; a valid admin key also reveals
    // drafts so the panel can manage them.
    if (!has_admin_key($adminKey)) {
        $events = array_values(array_filter($events, function ($e) {
            return !empty($e['published']);
        }));
    }
    // Optional ?from=&to= date-range filter for the public calendar.
    $from = isset($_GET['from']) ? trim((string) $_GET['from']) : '';
    $to   = isset($_GET['to']) ? trim((string) $_GET['to']) : '';
    if ($from !== '' || $to !== '') {
        $events = array_values(array_filter($events, function ($e) use ($from, $to) {
            return in_date_range($e, $from, $to);
        }));
    }
    sort_events($events);
    echo json_encode(['success' => true, 'events' => $events]);
    exit;
}

if ($method === 'POST' && $action === 'create') {
    require_admin_auth($adminKey);
    if (!$dataDirOk) {
        http_response_code(500);
        echo json_encode(['error' => 'Storage unavailable', 'reason' => $dataDirReason]);
        exit;
    }
    $event = $input['event'] ?? null;
    if (!is_array($event)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid event payload']);
        exit;
    }
    $title      = isset($event['title']) ? trim((string) $event['title']) : '';
    $startDate  = isset($event['start_date']) ? trim((string) $event['start_date']) : '';
    if ($title === '' || $startDate === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields: title, start_date']);
        exit;
    }
    $event = normalize_event($event, $ALLOWED_CATEGORIES, true);

    $events = load_events($dataFile);
    // Idempotent re-submits: if the client supplied an id we already have, treat
    // it as a duplicate instead of appending a second copy.
    foreach ($events as $existing) {
        if (($existing['id'] ?? null) === $event['id']) {
            echo json_encode(['success' => true, 'duplicate' => true, 'event' => $existing]);
            exit;
        }
    }
    $events[] = $event;
    if (!save_events($dataFile, $events)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save event', 'reason' => $dataDirReason ?: 'Could not write to the events store.']);
        exit;
    }
    echo json_encode(['success' => true, 'event' => $event]);
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
    $events  = load_events($dataFile);
    $found   = false;
    $updated = null;
    foreach ($events as &$event) {
        if (($event['id'] ?? null) === $id) {
            foreach ($patch as $k => $v) {
                // id and created_at are immutable.
                if ($k === 'id' || $k === 'created_at') continue;
                $event[$k] = $v;
            }
            // Re-normalise structural fields (false keeps id/created_at intact
            // and refreshes updated_at).
            $event   = normalize_event($event, $ALLOWED_CATEGORIES, false);
            $updated = $event;
            $found   = true;
            break;
        }
    }
    unset($event);
    if (!$found) {
        http_response_code(404);
        echo json_encode(['error' => 'Event not found']);
        exit;
    }
    if (!save_events($dataFile, $events)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save event']);
        exit;
    }
    echo json_encode(['success' => true, 'event' => $updated]);
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
    $events    = load_events($dataFile);
    $remaining = [];
    foreach ($events as $event) {
        $eid = $event['id'] ?? '';
        if (!isset($idSet[$eid])) {
            $remaining[] = $event;
        }
    }
    if (!save_events($dataFile, $remaining)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save events']);
        exit;
    }
    echo json_encode([
        'success' => true,
        'removed' => count($events) - count($remaining),
    ]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Unknown action']);
