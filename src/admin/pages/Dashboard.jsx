/* ============================================
   Admin Dashboard — at-a-glance home
   ============================================
   Composes the shared admin UI kit (AdminPageHeader + StatTile) into an
   overview screen: live lead metrics, a lightweight leads-over-time bar
   chart, recent admission leads (link to detail), quick actions, and mini
   lists of upcoming events + latest notices.

   • Lead metrics come from getLeadStats() against the server-backed cache and
     refresh on the existing 15s poll / onLeadsChanged subscription.
   • Notices/events counts and lists read the useNotices()/useEvents() hooks,
     which serve seed data today and switch to the live PHP/JSON stores in
     prompt 32 WITHOUT changing their return shape — so this dashboard goes
     fully live with no further edits here.
   ============================================ */

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Chip, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  getLeadStats,
  getLeads,
  exportLeadsCSV,
  syncLeadsFromServer,
  onLeadsChanged,
} from '../utils/leadService';
import { getStatusConfig } from '../utils/leadStatus';
import { AdminPageHeader, StatTile } from '../components/ui';
import useNotices from '../../hooks/useNotices';
import useEvents from '../../hooks/useEvents';
import styles from './Dashboard.module.css';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Parse a YYYY-MM-DD(THH:mm...) string to a LOCAL-midnight Date (no TZ drift). */
const parseDate = (iso) => {
  const [y, m, d] = String(iso).split('T')[0].split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

const startOfToday = () => {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
};

/** Human date / range for an event ("16 Feb" or "16–21 Feb"). */
const eventRange = (event) => {
  const s = parseDate(event.start_date);
  const startLabel = `${s.getDate()} ${MONTHS[s.getMonth()]}`;
  if (!event.end_date || event.end_date === event.start_date) return startLabel;
  const e = parseDate(event.end_date);
  return s.getMonth() === e.getMonth()
    ? `${s.getDate()}–${e.getDate()} ${MONTHS[e.getMonth()]}`
    : `${startLabel} – ${e.getDate()} ${MONTHS[e.getMonth()]}`;
};

/** "15 May 2026" text for a notice. */
const longDate = (iso) => {
  const d = parseDate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

/** "Friday, 05 June 2026" header pill. */
const todayLabel = () =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

/** "05 Jun 2026" short date for the leads table. */
const shortDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

const Dashboard = () => {
  useAdminAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(() => getLeadStats());
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { notices } = useNotices();
  const { events } = useEvents();

  // ── Auto-refresh: initial server sync + cross-tab subscription + 15s poll ──
  useEffect(() => {
    const refresh = () => setStats(getLeadStats());
    const changed = (r) => !r.error && (r.added > 0 || r.updated > 0 || r.removed > 0);
    refresh();

    // Pull leads from the shared server store so submissions made on other
    // devices (e.g. an ad visitor's phone) show up here too.
    syncLeadsFromServer().then((r) => {
      if (changed(r)) refresh();
    });

    // Reflect new leads and admin edits from any tab/window of this browser.
    const unsubscribe = onLeadsChanged(refresh);

    // Poll the server every 15s while the tab is visible.
    const POLL_MS = 15000;
    let intervalId = null;
    const poll = () => {
      if (document.visibilityState !== 'visible') return;
      syncLeadsFromServer().then((r) => {
        if (changed(r)) refresh();
      });
    };
    const startPolling = () => {
      if (!intervalId) intervalId = setInterval(poll, POLL_MS);
    };
    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        poll();
        refresh();
        startPolling();
      } else {
        stopPolling();
      }
    };

    if (document.visibilityState === 'visible') startPolling();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopPolling();
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // ── Derived notices/events views (seed today, live after prompt 32) ──
  // useNotices() already returns only published notices, pinned-first.
  const upcomingEvents = useMemo(() => {
    const today = startOfToday();
    return events.filter((e) => parseDate(e.end_date || e.start_date) >= today);
  }, [events]);

  // Never show an empty events preview before dated events exist — fall back to
  // the soonest seed events (mirrors the public Notice board behaviour).
  const eventsPreview = (upcomingEvents.length ? upcomingEvents : events).slice(0, 4);
  const noticesPreview = notices.slice(0, 4);

  const recentLeads = stats?.recentLeads || [];
  const last7Days = stats?.last7Days || [];
  const maxDay = last7Days.reduce((m, d) => Math.max(m, d.count), 0);
  const weekTotal = last7Days.reduce((sum, d) => sum + d.count, 0);

  const statTiles = [
    { icon: 'mdi:account-multiple', value: stats?.totalLeads ?? 0, label: 'Total Leads', tone: 'navy' },
    { icon: 'mdi:account-plus', value: stats?.newLeads24h ?? 0, label: 'New Today', tone: 'green' },
    { icon: 'mdi:calendar-week', value: stats?.weekLeads ?? 0, label: 'This Week', tone: 'blue' },
    { icon: 'mdi:trending-up', value: `${stats?.conversionRate ?? 0}%`, label: 'Conversion', tone: 'gold' },
    { icon: 'mdi:calendar-star', value: upcomingEvents.length, label: 'Upcoming Events', tone: 'teal' },
    { icon: 'mdi:bullhorn', value: notices.length, label: 'Active Notices', tone: 'pink' },
  ];

  const handleExportCSV = () => {
    const leads = getLeads();
    if (!leads.length) {
      setSnackbar({ open: true, message: 'No leads to export yet', severity: 'info' });
      return;
    }
    exportLeadsCSV(leads);
    setSnackbar({
      open: true,
      message: `Exported ${leads.length} lead${leads.length === 1 ? '' : 's'}`,
      severity: 'success',
    });
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const result = await syncLeadsFromServer();
      setStats(getLeadStats());
      if (result.error) {
        setSnackbar({ open: true, message: `Refresh failed: ${result.error}`, severity: 'error' });
      } else if (result.added > 0) {
        setSnackbar({
          open: true,
          message: `Refreshed — ${result.added} new lead${result.added === 1 ? '' : 's'} synced`,
          severity: 'success',
        });
      } else {
        setSnackbar({ open: true, message: 'Refreshed — already up to date', severity: 'success' });
      }
    } finally {
      setRefreshing(false);
    }
  };

  const goToLead = (leadId) => navigate(`/admin/leads/${leadId}`);

  return (
    <div className={styles.dashboard}>
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        icon="mdi:view-dashboard-outline"
        subtitle="Welcome back — here's your admission lead activity at a glance."
        actions={
          <>
            <Tooltip title="Refresh leads">
              <span>
                <IconButton
                  size="small"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  aria-label="Refresh leads"
                  sx={{
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    color: 'var(--admin-text-secondary)',
                    '&:hover': { borderColor: 'var(--admin-accent)', color: 'var(--admin-accent)' },
                  }}
                >
                  <Icon icon="mdi:refresh" width={20} className={refreshing ? styles.spin : undefined} />
                </IconButton>
              </span>
            </Tooltip>
            <span className={styles.datePill}>
              <Icon icon="mdi:calendar-outline" width={16} height={16} />
              {todayLabel()}
            </span>
          </>
        }
      />

      {/* Stat tiles */}
      <div className={styles.statsGrid}>
        {statTiles.map((t) => (
          <StatTile key={t.label} icon={t.icon} value={t.value} label={t.label} tone={t.tone} />
        ))}
      </div>

      {/* Quick actions */}
      <div className={styles.quickActions}>
        <Link to="/admin/notices" className={styles.actionPrimary}>
          <Icon icon="mdi:bullhorn-outline" width={18} height={18} />
          Add Notice
        </Link>
        <Link to="/admin/events" className={styles.actionPrimary}>
          <Icon icon="mdi:calendar-plus" width={18} height={18} />
          Add Event
        </Link>
        <button type="button" className={styles.actionOutlined} onClick={handleExportCSV}>
          <Icon icon="mdi:download-outline" width={18} height={18} />
          Export Leads
        </button>
        <a className={styles.actionOutlined} href="/" target="_blank" rel="noopener noreferrer">
          <Icon icon="mdi:open-in-new" width={18} height={18} />
          View Site
        </a>
      </div>

      {/* Main content grid */}
      <div className={styles.grid}>
        {/* Left column */}
        <div className={styles.colMain}>
          {/* Leads over time */}
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>Leads — last 7 days</h2>
              <span className={styles.cardMeta}>{weekTotal} total</span>
            </div>
            <div
              className={styles.chart}
              role="img"
              aria-label={`Leads received over the last 7 days: ${last7Days
                .map((d) => `${d.label} ${d.count}`)
                .join(', ')}.`}
            >
              {last7Days.map((d) => {
                const pct = maxDay > 0 ? Math.round((d.count / maxDay) * 100) : 0;
                return (
                  <div
                    key={d.key}
                    className={styles.chartCol}
                    title={`${d.label}: ${d.count} lead${d.count === 1 ? '' : 's'}`}
                  >
                    <span className={styles.chartCount}>{d.count}</span>
                    <div className={styles.chartTrack}>
                      <div
                        className={`${styles.chartBar} ${d.count === 0 ? styles.chartBarEmpty : ''}`}
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className={styles.chartDay}>{d.label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent leads */}
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>Recent Admission Leads</h2>
              <Link to="/admin/leads" className={styles.viewAll}>
                View all <Icon icon="mdi:arrow-right" width={16} height={16} />
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <div className={styles.empty}>
                <Icon icon="mdi:inbox-outline" width={44} height={44} />
                <p className={styles.emptyTitle}>No admission leads yet</p>
                <p className={styles.emptyText}>New enquiries from the website forms will appear here.</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Course</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th aria-label="Open lead" />
                      </tr>
                    </thead>
                    <tbody>
                      {recentLeads.map((lead) => {
                        const sc = getStatusConfig(lead.status);
                        return (
                          <tr key={lead.lead_id} onClick={() => goToLead(lead.lead_id)}>
                            <td className={styles.leadName}>{lead.name || '—'}</td>
                            <td className={styles.mono}>{lead.mobile || '—'}</td>
                            <td>{lead.service_interest || '—'}</td>
                            <td>
                              <Chip
                                label={sc.label}
                                size="small"
                                sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 600, fontSize: '0.7rem' }}
                              />
                            </td>
                            <td className={styles.leadDate}>{shortDate(lead.submitted_at)}</td>
                            <td className={styles.rowChevronCell}>
                              <Icon icon="mdi:chevron-right" width={18} height={18} className={styles.rowChevron} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <ul className={styles.leadCards}>
                  {recentLeads.map((lead) => {
                    const sc = getStatusConfig(lead.status);
                    return (
                      <li key={lead.lead_id} className={styles.leadCard} onClick={() => goToLead(lead.lead_id)}>
                        <div className={styles.leadCardTop}>
                          <span className={styles.leadName}>{lead.name || '—'}</span>
                          <Chip
                            label={sc.label}
                            size="small"
                            sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 600, fontSize: '0.65rem', height: 22 }}
                          />
                        </div>
                        <div className={styles.leadCardRow}>
                          <Icon icon="mdi:phone-outline" width={14} height={14} />
                          <span>{lead.mobile || '—'}</span>
                        </div>
                        <div className={styles.leadCardRow}>
                          <Icon icon="mdi:school-outline" width={14} height={14} />
                          <span>{lead.service_interest || '—'}</span>
                          <span className={styles.leadCardDate}>{shortDate(lead.submitted_at)}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </section>
        </div>

        {/* Right column */}
        <div className={styles.colSide}>
          {/* Upcoming events */}
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>Upcoming Events</h2>
              <Link to="/admin/events" className={styles.viewAll}>
                Manage <Icon icon="mdi:arrow-right" width={16} height={16} />
              </Link>
            </div>
            {eventsPreview.length === 0 ? (
              <div className={styles.empty}>
                <Icon icon="mdi:calendar-blank-outline" width={40} height={40} />
                <p className={styles.emptyText}>No events scheduled.</p>
              </div>
            ) : (
              <ul className={styles.miniList}>
                {eventsPreview.map((ev) => {
                  const start = parseDate(ev.start_date);
                  return (
                    <li key={ev.id} className={styles.miniRow}>
                      <span className={styles.dateTile} aria-hidden="true">
                        <strong>{start.getDate()}</strong>
                        {MONTHS[start.getMonth()]}
                      </span>
                      <span className={styles.miniBody}>
                        <span className={styles.miniTitle}>{ev.title}</span>
                        <span className={styles.miniMeta}>
                          {eventRange(ev)}
                          {ev.venue ? ` · ${ev.venue}` : ''}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Latest notices */}
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>Latest Notices</h2>
              <Link to="/admin/notices" className={styles.viewAll}>
                Manage <Icon icon="mdi:arrow-right" width={16} height={16} />
              </Link>
            </div>
            {noticesPreview.length === 0 ? (
              <div className={styles.empty}>
                <Icon icon="mdi:bullhorn-outline" width={40} height={40} />
                <p className={styles.emptyText}>No notices published.</p>
              </div>
            ) : (
              <ul className={styles.miniList}>
                {noticesPreview.map((n) => (
                  <li key={n.id} className={styles.miniRow}>
                    <span
                      className={`${styles.noticeDot} ${n.pinned ? styles.noticeDotPinned : ''}`}
                      aria-hidden="true"
                    >
                      <Icon icon={n.pinned ? 'mdi:pin' : 'mdi:circle-medium'} width={n.pinned ? 15 : 20} height={n.pinned ? 15 : 20} />
                    </span>
                    <span className={styles.miniBody}>
                      <span className={styles.miniTitle}>{n.title}</span>
                      <span className={styles.miniMeta}>
                        {n.category ? `${n.category} · ` : ''}
                        {longDate(n.date)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
