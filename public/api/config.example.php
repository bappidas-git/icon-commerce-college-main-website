<?php
/* ============================================
   Icon Commerce College — API configuration

   Copy this file to config.php on the server and set ADMIN_API_KEY.
   config.php is required by leads.php, notices.php and events.php; it is
   the single place to override the admin key on the host.
   ============================================ */

// ============================================
// Lead / Notices / Events API admin key
// --------------------------------------------
// Shared handshake that gates the admin-only endpoints (list / create /
// update / delete) via the X-Admin-Key request header. It MUST match
// REACT_APP_LEADS_ADMIN_KEY in the admin panel build.
//
// This defaults to the SAME committed key that leads.php / notices.php /
// events.php fall back to, so copying this file to config.php verbatim keeps
// the admin panel working out of the box. To lock the API down to a private
// key for production, change this value AND REACT_APP_LEADS_ADMIN_KEY together,
// then rebuild and redeploy.
//
// (Alternatively, some hosts let you set a LEADS_ADMIN_KEY environment variable
// instead of editing this file — the PHP resolves that too.)
// ============================================
define('ADMIN_API_KEY', 'skdfjsdfweiormcnzxmzdlkfjds');
