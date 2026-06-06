/* ============================================
   Admin Settings & Help — session, data & docs
   ============================================
   The admin's "control room" (prompt 33): the current session, live connection
   status for the three shared stores (leads / notices / events) with the
   admin-key handshake surfaced, client-side data export, a concise in-app guide
   and a read-only snapshot of the site's branding data. Built entirely on the
   shared admin UI kit (AdminPageHeader, StatTile, FormField, ConfirmDialog,
   Toast) and the existing data services — no new dependencies.
   ============================================ */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminPageHeader, StatTile, FormField, ConfirmDialog, Toast, useToast } from '../components/ui';
import { getLeads, exportLeadsCSV, syncLeadsFromServer } from '../utils/leadService';
import {
  getNotices,
  exportNoticesJSON,
  syncNoticesFromServer,
  getNoticesApiUrl,
} from '../utils/noticeService';
import {
  getEvents,
  exportEventsJSON,
  syncEventsFromServer,
  getEventsApiUrl,
} from '../utils/eventService';
import collegeInfo from '../../data/collegeInfo';
import styles from './Settings.module.css';

// The three shared stores, in the order they appear on the page. The leads URL
// resolves the same way webhookSubmit/leadService do; notices/events expose a
// helper. Computed once at module load (env is fixed for the bundle's lifetime).
const LEADS_API_URL = process.env.REACT_APP_LEADS_API_URL || '/api/leads.php';
const ENDPOINTS = [
  { key: 'leads', label: 'Leads API', url: LEADS_API_URL },
  { key: 'notices', label: 'Notices API', url: getNoticesApiUrl() },
  { key: 'events', label: 'Events API', url: getEventsApiUrl() },
];

// The leads/notices/events admin handshake all use this one shared key.
const ADMIN_KEY_SET = Boolean(process.env.REACT_APP_LEADS_ADMIN_KEY);

// Status → icon for the coloured pills. The CSS owns the colours (pill_<state>).
const STATE_ICON = {
  ok: 'mdi:check-circle',
  warn: 'mdi:alert',
  error: 'mdi:close-circle',
  idle: 'mdi:timer-sand',
};

// Read-only branding snapshot — the canonical college identity from collegeInfo.
const BRAND_FIELDS = [
  ['Name', collegeInfo.name],
  ['Assamese name', collegeInfo.assameseName],
  ['Established', String(collegeInfo.established)],
  ['Affiliation', `${collegeInfo.affiliation} (${collegeInfo.affiliationNote})`],
  ['Samarth code', collegeInfo.samarthCode],
  ['Phone', collegeInfo.phones.join(', ')],
  ['Email', collegeInfo.email],
  ['Address', collegeInfo.address.full],
];

// Turn a service sync result ({ synced, error? }) into a status pill. The
// services already encode the exact failure cases in their `error` strings, so
// we read those rather than re-implementing the fetch/status logic here.
const classifySync = (result) => {
  if (!result) return { state: 'idle', label: 'Checking…', detail: '' };
  if (!result.error) {
    const n = result.synced || 0;
    return { state: 'ok', label: 'Connected', detail: `${n} record${n === 1 ? '' : 's'} in store` };
  }
  const e = String(result.error);
  if (/not configured/i.test(e)) return { state: 'warn', label: 'Not configured', detail: e };
  if (/not set/i.test(e)) return { state: 'warn', label: 'Key not set', detail: e };
  const code = (e.match(/\b(\d{3})\b/) || [])[1];
  if (code === '401') return { state: 'error', label: 'Unauthorized', detail: 'Server rejected the admin key (401).' };
  if (code === '503') return { state: 'error', label: 'No server key', detail: 'Server has no admin key configured (503).' };
  if (code) return { state: 'error', label: `Error ${code}`, detail: e };
  return { state: 'error', label: 'Unreachable', detail: e };
};

// Surface the admin-key handshake, derived from the leads ping (leads strictly
// requires the key, so it's the authoritative signal — notices/events reuse the
// same key but accept anonymous reads).
const deriveHandshake = (leads) => {
  if (!ADMIN_KEY_SET) {
    return {
      state: 'warn',
      label: 'Not set',
      detail:
        'REACT_APP_LEADS_ADMIN_KEY is empty in this build — the panel can read public data but cannot list, update or delete records.',
    };
  }
  if (!leads || leads.state === 'idle') return { state: 'idle', label: 'Checking…', detail: '' };
  if (leads.state === 'ok') {
    return { state: 'ok', label: 'Verified', detail: 'The server accepted the admin key — list, update and delete are authorised.' };
  }
  if (leads.label === 'Unauthorized') {
    return { state: 'error', label: 'Key mismatch', detail: "This build's key doesn't match ADMIN_API_KEY on the server (401)." };
  }
  if (leads.label === 'No server key') {
    return { state: 'error', label: 'Server missing key', detail: 'The server has no admin key configured (503). Set ADMIN_API_KEY in public/api/config.php.' };
  }
  if (leads.state === 'warn') return { state: 'warn', label: leads.label, detail: leads.detail };
  return { state: 'idle', label: 'Unknown', detail: 'Could not reach the leads API to verify the key.' };
};

// Locale date-time for session timestamps. Returns an em-dash for bad input.
const fmtDateTime = (d) =>
  d instanceof Date && !Number.isNaN(d.getTime())
    ? d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    : '—';

const Settings = () => {
  const { user, logout } = useAdminAuth();
  const { showToast, toastProps } = useToast();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const [conn, setConn] = useState({ leads: null, notices: null, events: null });
  const [counts, setCounts] = useState({ leads: 0, notices: 0, events: 0 });

  // Ping all three stores via their own sync (which also warms the caches the
  // exports read), then classify each result and record live counts.
  const runChecks = useCallback(async () => {
    setChecking(true);
    const [leadsR, noticesR, eventsR] = await Promise.all([
      syncLeadsFromServer(),
      syncNoticesFromServer(),
      syncEventsFromServer(),
    ]);
    setConn({
      leads: classifySync(leadsR),
      notices: classifySync(noticesR),
      events: classifySync(eventsR),
    });
    setCounts({
      leads: getLeads().length,
      notices: getNotices().length,
      events: getEvents().length,
    });
    setChecking(false);
  }, []);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  const handshake = useMemo(() => deriveHandshake(conn.leads), [conn.leads]);

  // Session window from the stored auth (the context `user` IS that record).
  const session = useMemo(() => {
    const expiresAt = user?.expiresAt;
    if (!expiresAt) return null;
    const msLeft = expiresAt - Date.now();
    const hours = Math.max(0, Math.floor(msLeft / 3_600_000));
    const mins = Math.max(0, Math.floor((msLeft % 3_600_000) / 60_000));
    return {
      loginAt: user?.loginTime ? new Date(user.loginTime) : null,
      expiresAtDate: new Date(expiresAt),
      remaining: `${hours}h ${mins}m`,
      expired: msLeft <= 0,
    };
  }, [user]);

  const onlineCount = ENDPOINTS.filter((e) => conn[e.key]?.state === 'ok').length;
  const storesTone = checking
    ? 'navy'
    : onlineCount === ENDPOINTS.length
    ? 'green'
    : onlineCount === 0
    ? 'red'
    : 'gold';

  const handleCopy = useCallback(
    async (label, value) => {
      try {
        await navigator.clipboard.writeText(value);
        showToast(`${label} endpoint copied`);
      } catch {
        showToast('Could not copy to clipboard', 'error');
      }
    },
    [showToast]
  );

  const handleExportLeads = useCallback(() => {
    const rows = getLeads();
    if (!rows.length) return showToast('No leads to export yet', 'info');
    exportLeadsCSV(rows);
    showToast(`Exported ${rows.length} lead${rows.length === 1 ? '' : 's'} (CSV)`);
  }, [showToast]);

  const handleExportNotices = useCallback(() => {
    const rows = getNotices();
    if (!rows.length) return showToast('No notices to export yet', 'info');
    exportNoticesJSON(rows);
    showToast(`Exported ${rows.length} notice${rows.length === 1 ? '' : 's'} (JSON)`);
  }, [showToast]);

  const handleExportEvents = useCallback(() => {
    const rows = getEvents();
    if (!rows.length) return showToast('No events to export yet', 'info');
    exportEventsJSON(rows);
    showToast(`Exported ${rows.length} event${rows.length === 1 ? '' : 's'} (JSON)`);
  }, [showToast]);

  const EXPORTS = [
    { key: 'leads', label: 'Leads (CSV)', icon: 'mdi:file-delimited-outline', onClick: handleExportLeads },
    { key: 'notices', label: 'Notices (JSON)', icon: 'mdi:code-json', onClick: handleExportNotices },
    { key: 'events', label: 'Events (JSON)', icon: 'mdi:code-json', onClick: handleExportEvents },
  ];

  return (
    <div className={styles.page}>
      <AdminPageHeader
        eyebrow="Account"
        title="Settings & Help"
        icon="mdi:cog-outline"
        subtitle="Your session, the live status of the shared data stores, data exports and a quick guide to running the site."
      />

      <div className={styles.stats}>
        <StatTile icon="mdi:account-check-outline" value={user?.username || 'Admin'} label="Signed in as" tone="navy" />
        <StatTile
          icon="mdi:clock-outline"
          value={session ? (session.expired ? 'Expired' : session.remaining) : '—'}
          label="Session remaining"
          tone="gold"
          hint={session ? `Until ${fmtDateTime(session.expiresAtDate)}` : undefined}
        />
        <StatTile
          icon="mdi:server-network-outline"
          value={`${onlineCount}/${ENDPOINTS.length}`}
          label="Stores online"
          tone={storesTone}
          hint={checking ? 'Checking…' : undefined}
        />
      </div>

      {/* ── Account ── */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Account</h2>
        <FormField label="Username" htmlFor="settings-username" hint="Configured via REACT_APP_ADMIN_USERNAME.">
          <input id="settings-username" type="text" value={user?.username || 'admin'} readOnly disabled />
        </FormField>

        <div className={styles.note}>
          <Icon icon="mdi:shield-key-outline" className={styles.noteIcon} width={18} height={18} aria-hidden="true" />
          <span>
            <strong>Change password:</strong> the admin password is set by the <code>REACT_APP_ADMIN_PASSWORD</code>{' '}
            environment variable in <code>.env</code> (or your host's settings). Update it and rebuild / redeploy —
            there is no in-app password store.
          </span>
        </div>

        {session && (
          <div className={`${styles.kv} ${styles.kvTop}`}>
            <div className={styles.kvRow}>
              <span className={styles.kvLabel}>Signed in</span>
              <span className={styles.kvValue}>{fmtDateTime(session.loginAt)}</span>
            </div>
            <div className={styles.kvRow}>
              <span className={styles.kvLabel}>Session expires</span>
              <span className={styles.kvValue}>{fmtDateTime(session.expiresAtDate)}</span>
            </div>
            <div className={styles.kvRow}>
              <span className={styles.kvLabel}>Time remaining</span>
              <span className={styles.kvValue}>{session.expired ? 'Expired' : session.remaining}</span>
            </div>
          </div>
        )}

        <button type="button" className={styles.dangerBtn} onClick={() => setConfirmOpen(true)}>
          <Icon icon="mdi:logout" width={18} height={18} />
          Sign out
        </button>
      </section>

      {/* ── Connection status ── */}
      <section className={styles.card}>
        <div className={styles.cardHead}>
          <div>
            <h2 className={styles.cardTitle}>Connection status</h2>
            <p className={styles.cardLead}>
              Live status of the shared stores (the single source of truth). Each is pinged with{' '}
              <code>?action=list</code>.
            </p>
          </div>
          <button
            type="button"
            className={styles.recheckBtn}
            onClick={runChecks}
            disabled={checking}
            aria-label="Re-check connection status"
          >
            <Icon icon="mdi:refresh" width={16} height={16} className={checking ? styles.spin : undefined} />
            {checking ? 'Checking…' : 'Re-check'}
          </button>
        </div>

        <div className={styles.statusList}>
          {ENDPOINTS.map((ep) => {
            const s = conn[ep.key] || { state: 'idle', label: 'Checking…', detail: '' };
            const spinning = s.state === 'idle' && checking;
            return (
              <div key={ep.key} className={styles.statusRow}>
                <div className={styles.statusMain}>
                  <span className={styles.statusLabel}>{ep.label}</span>
                  <span className={styles.statusUrl} title={ep.url}>
                    {ep.url}
                  </span>
                  {s.detail && <span className={styles.statusDetail}>{s.detail}</span>}
                </div>
                <div className={styles.statusRight}>
                  <span className={`${styles.pill} ${styles[`pill_${s.state}`]}`}>
                    <Icon
                      icon={STATE_ICON[s.state]}
                      width={14}
                      height={14}
                      className={spinning ? styles.spin : undefined}
                      aria-hidden="true"
                    />
                    {s.label}
                  </span>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => handleCopy(ep.label, ep.url)}
                    aria-label={`Copy ${ep.label} endpoint URL`}
                  >
                    <Icon icon="mdi:content-copy" width={15} height={15} />
                  </button>
                </div>
              </div>
            );
          })}

          <div className={`${styles.statusRow} ${styles.handshakeRow}`}>
            <div className={styles.statusMain}>
              <span className={styles.statusLabel}>Admin-key handshake</span>
              {handshake.detail && <span className={styles.statusDetail}>{handshake.detail}</span>}
            </div>
            <span className={`${styles.pill} ${styles[`pill_${handshake.state}`]}`}>
              <Icon icon={STATE_ICON[handshake.state]} width={14} height={14} aria-hidden="true" />
              {handshake.label}
            </span>
          </div>
        </div>
      </section>

      {/* ── Data export ── */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Data export</h2>
        <p className={styles.cardLead}>
          Download a snapshot from each store. Files are generated in your browser — nothing is uploaded anywhere.
        </p>
        <div className={styles.exportGrid}>
          {EXPORTS.map((ex) => (
            <button
              key={ex.key}
              type="button"
              className={styles.exportBtn}
              onClick={ex.onClick}
              disabled={checking || counts[ex.key] === 0}
            >
              <span className={styles.exportTop}>
                <Icon icon={ex.icon} width={20} height={20} aria-hidden="true" />
                {ex.label}
              </span>
              <span className={styles.exportSub}>
                {checking ? 'Checking…' : `${counts[ex.key]} record${counts[ex.key] === 1 ? '' : 's'}`}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Help & guide ── */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Help &amp; guide</h2>
        <p className={styles.cardLead}>
          A quick reference for running the site. Full documentation lives in <code>/docs</code>.
        </p>

        <details className={styles.help} open>
          <summary className={styles.helpSummary}>
            <Icon icon="mdi:account-arrow-right-outline" width={18} height={18} aria-hidden="true" />
            How leads are captured &amp; stored
            <Icon icon="mdi:chevron-down" className={styles.chevron} width={20} height={20} aria-hidden="true" />
          </summary>
          <div className={styles.helpBody}>
            <p>
              Public enquiry forms post to <code>/api/leads.php?action=create</code>. Each lead is saved server-side in{' '}
              <code>api/data/leads.json</code> — the <strong>single source of truth</strong>.
            </p>
            <p>
              The <strong>Leads</strong> page reads and writes that store (auto-refreshing every 15s), so every browser
              and device sees the same leads. There is no localStorage copy.
            </p>
          </div>
        </details>

        <details className={styles.help}>
          <summary className={styles.helpSummary}>
            <Icon icon="mdi:bullhorn-outline" width={18} height={18} aria-hidden="true" />
            Posting a notice or event
            <Icon icon="mdi:chevron-down" className={styles.chevron} width={20} height={20} aria-hidden="true" />
          </summary>
          <div className={styles.helpBody}>
            <p>
              <strong>Notices →</strong> open <em>Notices</em>, click <em>Add Notice</em>, fill in the title, body,
              category and date (optionally pin it), then publish.
            </p>
            <p>
              <strong>Events →</strong> open <em>Events</em>, click <em>Add Event</em> (list or calendar view), set the
              dates, time, venue and category, then publish.
            </p>
            <p>
              Published items appear on the public <code>/notices</code> and <code>/events</code> pages, and the latest
              surface on the Home page. Drafts stay hidden until you publish them.
            </p>
          </div>
        </details>

        <details className={styles.help}>
          <summary className={styles.helpSummary}>
            <Icon icon="mdi:image-outline" width={18} height={18} aria-hidden="true" />
            Swapping placeholder images
            <Icon icon="mdi:chevron-down" className={styles.chevron} width={20} height={20} aria-hidden="true" />
          </summary>
          <div className={styles.helpBody}>
            <p>
              All imagery uses labelled placeholders under <code>/public/images/placeholders/</code>. To go live,
              replace a file with a real photo using the <strong>same filename</strong> — no code change is needed.
            </p>
          </div>
        </details>

        <details className={styles.help}>
          <summary className={styles.helpSummary}>
            <Icon icon="mdi:server-network-outline" width={18} height={18} aria-hidden="true" />
            Deployment basics
            <Icon icon="mdi:chevron-down" className={styles.chevron} width={20} height={20} aria-hidden="true" />
          </summary>
          <div className={styles.helpBody}>
            <p>
              Host the production build on a PHP-capable server. Make sure <code>public/api/data/</code> is writable —
              the JSON stores are created there on first use.
            </p>
            <p>
              Set the environment variables before building: the <code>REACT_APP_*_API_URL</code> endpoints,{' '}
              <code>REACT_APP_LEADS_ADMIN_KEY</code> (must match <code>ADMIN_API_KEY</code> in{' '}
              <code>public/api/config.php</code>), and the admin login vars. Full docs live in <code>/docs</code>.
            </p>
          </div>
        </details>
      </section>

      {/* ── Branding & content (read-only) ── */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Branding &amp; content</h2>
        <p className={styles.cardLead}>
          Read-only snapshot of <code>collegeInfo</code>. Site content lives in <code>src/data/*</code> — there is no
          database.
        </p>
        <div className={styles.kv}>
          {BRAND_FIELDS.map(([label, value]) => (
            <div key={label} className={styles.kvRow}>
              <span className={styles.kvLabel}>{label}</span>
              <span className={styles.kvValue}>{value}</span>
            </div>
          ))}
        </div>
        <div className={styles.note}>
          <Icon icon="mdi:information-outline" className={styles.noteIcon} width={18} height={18} aria-hidden="true" />
          <span>
            To edit any of the above, update the matching file in <code>src/data/*</code> and rebuild — content is
            version-controlled, not stored in a database.
          </span>
        </div>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Sign out?"
        message="You'll need to sign in again to access the admin panel."
        confirmLabel="Sign out"
        tone="danger"
        onConfirm={logout}
        onClose={() => setConfirmOpen(false)}
      />

      <Toast {...toastProps} />
    </div>
  );
};

export default Settings;
