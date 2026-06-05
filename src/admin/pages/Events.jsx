/* ============================================
   Admin Events — list + calendar, create / edit / publish
   ============================================
   Full events module. Two views over the SAME shared server store
   (eventService), toggled in the header:
     • List     — a sortable/searchable DataTable (Title · Category · Start ·
                  End · Venue · Published) with row actions (edit, publish,
                  delete) + a category and upcoming/past filter.
     • Calendar — the shared <MonthGrid> (same component the public Events page
                  uses): click a day to see/edit that day's events or add a new
                  one on that date.
   Both share the category filter. An "Add Event" button (and the Dashboard
   quick action / a calendar day) opens the <EventFormDialog>. Mirrors the leads
   / notices sync model — initial server sync + 15s poll + cross-tab notify — so
   a change on one device/tab reflects everywhere. Drafts are visible here for
   the admin but hidden from the public list/calendar (enforced server-side).
   ============================================ */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button, Chip, IconButton, Tooltip } from "@mui/material";
import {
  AdminPageHeader,
  DataTable,
  StatTile,
  ConfirmDialog,
  Toast,
  useToast,
} from "../components/ui";
import EventFormDialog from "../components/EventFormDialog";
import MonthGrid from "../../components/common/MonthGrid/MonthGrid";
import {
  getEvents,
  syncEventsFromServer,
  onEventsChanged,
  updateEvent,
  deleteEvent,
  EVENT_CATEGORIES,
  getCategoryConfig,
} from "../utils/eventService";
import useMediaQuery from "../../hooks/useMediaQuery";
import {
  formatLongDate,
  formatFullDate,
  formatTimeRange,
  isPastEvent,
  parseISODate,
  startOfToday,
} from "../../utils/dateUtils";
import styles from "./Events.module.css";

const VIEWS = [
  { id: "list", label: "List", icon: "mdi:view-list-outline" },
  { id: "calendar", label: "Calendar", icon: "mdi:calendar-month-outline" },
];

// Category + publish-status chips, reused by the table columns, the metadata
// folded into the title cell on small screens, and the calendar day detail.
const categoryChip = (e, compact = false) => {
  const c = getCategoryConfig(e.category);
  return (
    <Chip
      label={c.label}
      size="small"
      icon={<Icon icon={c.icon} width={compact ? 12 : 14} height={compact ? 12 : 14} color={c.color} />}
      sx={{
        bgcolor: c.bg,
        color: c.color,
        fontWeight: 600,
        fontSize: compact ? "0.66rem" : "0.72rem",
        height: compact ? 20 : 24,
        "& .MuiChip-icon": { color: c.color, marginLeft: "4px" },
      }}
    />
  );
};

const statusChip = (e, compact = false) => (
  <Chip
    size="small"
    label={e.published ? "Published" : "Draft"}
    sx={{
      bgcolor: e.published ? "#E7F6EF" : "#F1F5F9",
      color: e.published ? "#1E8E5A" : "#5B6678",
      fontWeight: 600,
      fontSize: compact ? "0.66rem" : "0.72rem",
      height: compact ? 20 : 24,
    }}
  />
);

// Reused sx — defined at module scope so they are stable across renders.
const refreshBtnSx = {
  border: "1px solid var(--admin-border)",
  borderRadius: "8px",
  color: "var(--admin-text-secondary)",
  "&:hover": { borderColor: "var(--admin-accent)", color: "var(--admin-accent)" },
};
const addBtnSx = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: "10px",
  background: "var(--admin-gradient)",
  boxShadow: "none",
  "&:hover": { background: "var(--admin-gradient)", filter: "brightness(1.06)", boxShadow: "var(--shadow-sm)" },
};
const actionSx = { p: 0.5, color: "var(--admin-text-muted)", "&:hover": { color: "var(--admin-accent)" } };
const deleteActionSx = { p: 0.5, color: "var(--admin-text-muted)", "&:hover": { color: "var(--admin-error)" } };

const Events = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast, toastProps } = useToast();

  // Drive responsive column sets so the Actions column is always reachable
  // without horizontal scroll (1024px matches the sidebar's drawer breakpoint).
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Stable "today" for upcoming/past partitioning.
  const today = useMemo(() => startOfToday(), []);

  // `events` is the full (unfiltered) cache snapshot; category/timeframe filters
  // are applied in the derived views below and text search/sort/pagination are
  // handled by the DataTable, so stats stay computed over every event.
  const [events, setEvents] = useState(() => getEvents());
  const [view, setView] = useState("calendar");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeframe, setTimeframe] = useState("all"); // all | upcoming | past
  const [refreshing, setRefreshing] = useState(false);

  // Form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editing, setEditing] = useState(null);
  const [prefill, setPrefill] = useState(null);

  // Delete confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadEvents = useCallback(() => setEvents(getEvents()), []);
  const loadRef = useRef(loadEvents);
  useEffect(() => {
    loadRef.current = loadEvents;
  }, [loadEvents]);

  // ── Initial server sync + cross-tab subscription + 15s poll (mirrors leads) ──
  useEffect(() => {
    const changed = (r) => !r.error && (r.added > 0 || r.updated > 0 || r.removed > 0);
    loadRef.current();

    syncEventsFromServer().then((r) => {
      if (changed(r)) loadRef.current();
    });

    const unsubscribe = onEventsChanged(() => loadRef.current());

    const POLL_MS = 15000;
    let intervalId = null;
    const poll = () => {
      if (document.visibilityState !== "visible") return;
      syncEventsFromServer().then((r) => {
        if (changed(r)) loadRef.current();
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
      if (document.visibilityState === "visible") {
        poll();
        startPolling();
      } else {
        stopPolling();
      }
    };

    if (document.visibilityState === "visible") startPolling();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopPolling();
      unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const openCreate = useCallback((seed = null) => {
    setEditing(null);
    setPrefill(seed);
    setFormMode("create");
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((event) => {
    setEditing(event);
    setPrefill(null);
    setFormMode("edit");
    setFormOpen(true);
  }, []);

  // Open the create dialog when arriving from the Dashboard "Add Event" quick
  // action, then clear the router state so a refresh/back doesn't reopen it.
  useEffect(() => {
    if (location.state?.openCreate) {
      openCreate();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate, openCreate]);

  const stats = useMemo(() => {
    const upcoming = events.filter((e) => !isPastEvent(e, today)).length;
    return {
      total: events.length,
      published: events.filter((e) => e.published).length,
      drafts: events.filter((e) => !e.published).length,
      upcoming,
    };
  }, [events, today]);

  // Category filter applies to BOTH views (calendar + list); the list adds the
  // upcoming/past filter on top (and the DataTable adds text search).
  const categoryFiltered = useMemo(
    () => (categoryFilter === "all" ? events : events.filter((e) => e.category === categoryFilter)),
    [events, categoryFilter]
  );

  const listRows = useMemo(() => {
    if (timeframe === "all") return categoryFiltered;
    return categoryFiltered.filter((e) => {
      const past = isPastEvent(e, today);
      return timeframe === "past" ? past : !past;
    });
  }, [categoryFiltered, timeframe, today]);

  const handleSaved = useCallback(
    (_saved, mode) => {
      loadEvents();
      showToast(mode === "edit" ? "Event updated" : "Event created");
    },
    [loadEvents, showToast]
  );

  const handleTogglePublish = useCallback(
    (event) => {
      updateEvent(event.id, { published: !event.published });
      loadEvents();
      showToast(event.published ? "Event unpublished — saved as draft" : "Event published");
    },
    [loadEvents, showToast]
  );

  const askDelete = useCallback((event) => {
    setDeleteTarget(event);
    setConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTarget) {
      deleteEvent(deleteTarget.id);
      showToast("Event deleted");
    }
    setConfirmOpen(false);
    setDeleteTarget(null);
    loadEvents();
  }, [deleteTarget, loadEvents, showToast]);

  const handleRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const r = await syncEventsFromServer();
      loadEvents();
      if (r.error) {
        showToast(`Refresh failed: ${r.error}`, "error");
      } else {
        const parts = [];
        if (r.added > 0) parts.push(`${r.added} new`);
        if (r.updated > 0) parts.push(`${r.updated} updated`);
        if (r.removed > 0) parts.push(`${r.removed} removed`);
        showToast(parts.length ? `Refreshed — ${parts.join(", ")}` : "Refreshed — already up to date");
      }
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, loadEvents, showToast]);

  // Compact action cluster reused by the table rows and the calendar day detail.
  const rowActions = useCallback(
    (e) => (
      <>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => openEdit(e)} aria-label="Edit event" sx={actionSx}>
            <Icon icon="mdi:pencil-outline" width={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title={e.published ? "Unpublish" : "Publish"}>
          <IconButton
            size="small"
            onClick={() => handleTogglePublish(e)}
            aria-label={e.published ? "Unpublish event" : "Publish event"}
            sx={actionSx}
          >
            <Icon icon={e.published ? "mdi:eye-off-outline" : "mdi:eye-outline"} width={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => askDelete(e)} aria-label="Delete event" sx={deleteActionSx}>
            <Icon icon="mdi:delete-outline" width={18} />
          </IconButton>
        </Tooltip>
      </>
    ),
    [openEdit, handleTogglePublish, askDelete]
  );

  const columns = useMemo(() => {
    // Cap the title to the space its column actually gets per tier so it never
    // forces the table wider than the viewport (which would clip Actions).
    const titleMax = isMobile ? 150 : isTablet ? 240 : 300;

    const titleCol = {
      key: "title",
      header: "Title",
      sortable: true,
      searchValue: (e) => `${e.title} ${e.description} ${e.venue}`,
      render: (e) => (
        <div className={styles.titleCell}>
          <span className={styles.titleMain}>
            <span className={styles.titleText} style={{ maxWidth: titleMax }} title={e.title}>
              {e.title || "—"}
            </span>
            {(isMobile || isTablet) && (
              <span className={styles.titleMeta}>
                {isMobile && categoryChip(e, true)}
                <span className={styles.metaDate}>{formatLongDate(e.start_date)}</span>
                {isMobile && statusChip(e, true)}
              </span>
            )}
          </span>
        </div>
      ),
    };

    const categoryCol = {
      key: "category",
      header: "Category",
      sortable: true,
      width: "150px",
      render: (e) => categoryChip(e),
    };

    const startCol = {
      key: "start_date",
      header: "Start",
      sortable: true,
      width: "150px",
      sortValue: (e) => parseISODate(e.start_date).getTime(),
      render: (e) => (
        <span className={styles.dateCell}>
          <span className={styles.dateText}>{formatLongDate(e.start_date)}</span>
          {e.start_time && <span className={styles.timeText}>{formatTimeRange(e.start_time, e.end_time)}</span>}
        </span>
      ),
    };

    const endCol = {
      key: "end_date",
      header: "End",
      sortable: true,
      width: "130px",
      searchable: false,
      sortValue: (e) => parseISODate(e.end_date || e.start_date).getTime(),
      render: (e) =>
        e.end_date && e.end_date !== e.start_date ? (
          <span className={styles.dateText}>{formatLongDate(e.end_date)}</span>
        ) : (
          <span className={styles.muted}>—</span>
        ),
    };

    const venueCol = {
      key: "venue",
      header: "Venue",
      sortable: true,
      width: "170px",
      render: (e) =>
        e.venue ? <span className={styles.venueText} title={e.venue}>{e.venue}</span> : <span className={styles.muted}>—</span>,
    };

    const publishedCol = {
      key: "published",
      header: "Published",
      sortable: true,
      width: "118px",
      align: "center",
      searchable: false,
      sortValue: (e) => (e.published ? 1 : 0),
      render: (e) => statusChip(e),
    };

    const actionsCol = {
      key: "actions",
      header: "Actions",
      width: isMobile ? "132px" : isTablet ? "150px" : "160px",
      align: "right",
      searchable: false,
      render: (e) => <div className={styles.actions}>{rowActions(e)}</div>,
    };

    // Progressive disclosure: keep every column on desktop; on smaller screens
    // drop the lowest-priority ones (their data folds into the title cell) so
    // Actions stays on-screen.
    if (isMobile) return [titleCol, actionsCol];
    if (isTablet) return [titleCol, categoryCol, publishedCol, actionsCol];
    return [titleCol, categoryCol, startCol, endCol, venueCol, publishedCol, actionsCol];
  }, [isMobile, isTablet, rowActions]);

  // The category + timeframe controls, shared as the DataTable toolbar (list)
  // and the calendar's filter bar.
  const categorySelect = (
    <label className={styles.filter}>
      <span className={styles.filterLabel}>Category</span>
      <select
        className={styles.filterSelect}
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        aria-label="Filter events by category"
      >
        <option value="all">All categories</option>
        {EVENT_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </label>
  );

  const timeframeSelect = (
    <label className={styles.filter}>
      <span className={styles.filterLabel}>Show</span>
      <select
        className={styles.filterSelect}
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value)}
        aria-label="Filter events by time"
      >
        <option value="all">All events</option>
        <option value="upcoming">Upcoming</option>
        <option value="past">Past</option>
      </select>
    </label>
  );

  // Calendar day detail (consumer render-prop for the shared MonthGrid).
  const renderCalendarDetail = useCallback(
    ({ selectedKey, dayEvents }) => {
      if (!selectedKey) {
        return (
          <p className={styles.calHint}>
            <Icon icon="mdi:gesture-tap" aria-hidden="true" />
            Pick a day to see its events or add a new one.
          </p>
        );
      }
      return (
        <div className={styles.calDetail}>
          <div className={styles.calDetailHead}>
            <h3 className={styles.calDetailTitle}>
              <Icon icon="mdi:calendar-today" aria-hidden="true" />
              {formatFullDate(selectedKey)}
            </h3>
            <Button
              size="small"
              variant="contained"
              disableElevation
              startIcon={<Icon icon="mdi:plus" />}
              onClick={() => openCreate({ start_date: selectedKey })}
              sx={addBtnSx}
            >
              Add on this day
            </Button>
          </div>

          {dayEvents.length ? (
            <ul className={styles.calList}>
              {dayEvents.map((e) => {
                const timeRange = formatTimeRange(e.start_time, e.end_time);
                return (
                  <li key={e.id} className={styles.calRow}>
                    <span className={styles.calRowMain}>
                      <span className={styles.calRowTop}>
                        {categoryChip(e, true)}
                        {!e.published && statusChip(e, true)}
                      </span>
                      <span className={styles.calRowTitle} title={e.title}>
                        {e.title}
                      </span>
                      <span className={styles.calRowMeta}>
                        <Icon icon="mdi:clock-outline" width={14} height={14} aria-hidden="true" />
                        {timeRange || "All day"}
                        {e.venue ? ` · ${e.venue}` : ""}
                      </span>
                    </span>
                    <span className={styles.calRowActions}>{rowActions(e)}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.calEmpty}>
              No events on this day yet — use “Add on this day” to schedule one.
            </p>
          )}
        </div>
      );
    },
    [openCreate, rowActions]
  );

  return (
    <div className={styles.page}>
      <AdminPageHeader
        eyebrow="Content"
        title="Events"
        icon="mdi:calendar-star-outline"
        subtitle="Schedule college events and surface them on the public Events page and calendar."
        actions={
          <div className={styles.headerActions}>
            <Tooltip title="Refresh events">
              <span>
                <IconButton
                  size="small"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  aria-label="Refresh events"
                  sx={refreshBtnSx}
                >
                  <Icon icon="mdi:refresh" width={20} className={refreshing ? styles.spin : undefined} />
                </IconButton>
              </span>
            </Tooltip>
            <Button
              variant="contained"
              disableElevation
              startIcon={<Icon icon="mdi:plus" />}
              onClick={() => openCreate()}
              sx={addBtnSx}
            >
              Add Event
            </Button>
          </div>
        }
      />

      <div className={styles.statsGrid}>
        <StatTile icon="mdi:calendar-star" value={stats.total} label="Total Events" tone="navy" />
        <StatTile icon="mdi:calendar-clock" value={stats.upcoming} label="Upcoming" tone="teal" />
        <StatTile icon="mdi:earth" value={stats.published} label="Published" tone="green" />
        <StatTile icon="mdi:file-document-edit-outline" value={stats.drafts} label="Drafts" tone="gold" />
      </div>

      {/* View toggle */}
      <div className={styles.viewBar}>
        <div className={styles.viewToggle} role="group" aria-label="Choose how to view events">
          {VIEWS.map((v) => {
            const active = v.id === view;
            return (
              <button
                key={v.id}
                type="button"
                className={`${styles.viewBtn} ${active ? styles.viewBtnActive : ""}`}
                aria-pressed={active}
                onClick={() => setView(v.id)}
              >
                <Icon icon={v.icon} aria-hidden="true" />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {view === "list" ? (
        <DataTable
          columns={columns}
          rows={listRows}
          getRowId={(e) => e.id}
          initialSort={{ key: "start_date", direction: "asc" }}
          searchPlaceholder="Search events…"
          emptyIcon="mdi:calendar-star-outline"
          emptyTitle="No events yet"
          emptyMessage='Click "Add Event" to schedule your first college event.'
          toolbar={
            <div className={styles.toolbar}>
              {categorySelect}
              {timeframeSelect}
            </div>
          }
        />
      ) : (
        <div className={styles.calendarPanel}>
          <div className={styles.calendarControls}>{categorySelect}</div>
          <MonthGrid events={categoryFiltered} renderDetail={renderCalendarDetail} />
        </div>
      )}

      <EventFormDialog
        open={formOpen}
        mode={formMode}
        event={editing}
        prefill={prefill}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete event?"
        message={
          deleteTarget
            ? `“${deleteTarget.title}” will be permanently removed. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        tone="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setConfirmOpen(false)}
      />

      <Toast {...toastProps} />
    </div>
  );
};

export default Events;
