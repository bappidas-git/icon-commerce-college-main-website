/* ============================================
   Admin Notices — create / edit / publish / pin
   ============================================
   Full notices module: a sortable/searchable DataTable backed by the shared
   server store (noticeService), with row actions (edit, toggle publish,
   pin/unpin, delete) and an "Add Notice" form dialog. Mirrors the leads
   sync model — initial server sync + 15s poll + cross-tab notify — so a change
   on one device/tab reflects everywhere. Drafts are visible here for the admin
   but hidden from the public list (enforced server-side).
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
import NoticeFormDialog from "../components/NoticeFormDialog";
import {
  getNotices,
  syncNoticesFromServer,
  onNoticesChanged,
  updateNotice,
  deleteNotice,
  NOTICE_CATEGORIES,
  getCategoryConfig,
} from "../utils/noticeService";
import styles from "./Notices.module.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "15 May 2026" from an ISO date/timestamp (local-midnight, no TZ drift). */
const longDate = (iso) => {
  if (!iso) return "—";
  const [y, m, d] = String(iso).split("T")[0].split("-").map(Number);
  if (!y) return "—";
  const date = new Date(y, (m || 1) - 1, d || 1);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

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

const Notices = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast, toastProps } = useToast();

  // `notices` is the full (unfiltered) cache snapshot; the category filter is
  // applied in `rows` below and text search/sort/pagination are handled by the
  // DataTable, so stats stay computed over every notice.
  const [notices, setNotices] = useState(() => getNotices());
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // Form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editing, setEditing] = useState(null);

  // Delete confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadNotices = useCallback(() => setNotices(getNotices()), []);
  const loadRef = useRef(loadNotices);
  useEffect(() => {
    loadRef.current = loadNotices;
  }, [loadNotices]);

  // ── Initial server sync + cross-tab subscription + 15s poll (mirrors leads) ──
  useEffect(() => {
    const changed = (r) => !r.error && (r.added > 0 || r.updated > 0 || r.removed > 0);
    loadRef.current();

    syncNoticesFromServer().then((r) => {
      if (changed(r)) loadRef.current();
    });

    const unsubscribe = onNoticesChanged(() => loadRef.current());

    const POLL_MS = 15000;
    let intervalId = null;
    const poll = () => {
      if (document.visibilityState !== "visible") return;
      syncNoticesFromServer().then((r) => {
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

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormMode("create");
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((notice) => {
    setEditing(notice);
    setFormMode("edit");
    setFormOpen(true);
  }, []);

  // Open the create dialog when arriving from the Dashboard "Add Notice" quick
  // action, then clear the router state so a refresh/back doesn't reopen it.
  useEffect(() => {
    if (location.state?.openCreate) {
      openCreate();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate, openCreate]);

  const stats = useMemo(
    () => ({
      total: notices.length,
      published: notices.filter((n) => n.published).length,
      drafts: notices.filter((n) => !n.published).length,
      pinned: notices.filter((n) => n.pinned).length,
    }),
    [notices]
  );

  const rows = useMemo(
    () => (categoryFilter === "all" ? notices : notices.filter((n) => n.category === categoryFilter)),
    [notices, categoryFilter]
  );

  const handleSaved = useCallback(
    (_saved, mode) => {
      loadNotices();
      showToast(mode === "edit" ? "Notice updated" : "Notice created");
    },
    [loadNotices, showToast]
  );

  const handleTogglePublish = useCallback(
    (notice) => {
      updateNotice(notice.id, { published: !notice.published });
      loadNotices();
      showToast(notice.published ? "Notice unpublished — saved as draft" : "Notice published");
    },
    [loadNotices, showToast]
  );

  const handleTogglePin = useCallback(
    (notice) => {
      updateNotice(notice.id, { pinned: !notice.pinned });
      loadNotices();
      showToast(notice.pinned ? "Notice unpinned" : "Notice pinned to top");
    },
    [loadNotices, showToast]
  );

  const askDelete = useCallback((notice) => {
    setDeleteTarget(notice);
    setConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTarget) {
      deleteNotice(deleteTarget.id);
      showToast("Notice deleted");
    }
    setConfirmOpen(false);
    setDeleteTarget(null);
    loadNotices();
  }, [deleteTarget, loadNotices, showToast]);

  const handleRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const r = await syncNoticesFromServer();
      loadNotices();
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
  }, [refreshing, loadNotices, showToast]);

  const columns = useMemo(
    () => [
      {
        key: "title",
        header: "Title",
        sortable: true,
        searchValue: (n) => `${n.title} ${n.body}`,
        render: (n) => (
          <div className={styles.titleCell}>
            {n.pinned && <Icon icon="mdi:pin" width={15} height={15} className={styles.pinDot} aria-hidden="true" />}
            <span className={styles.titleText} title={n.title}>
              {n.title || "—"}
            </span>
          </div>
        ),
      },
      {
        key: "category",
        header: "Category",
        sortable: true,
        width: "150px",
        render: (n) => {
          const c = getCategoryConfig(n.category);
          return (
            <Chip
              label={c.label}
              size="small"
              sx={{ bgcolor: c.bg, color: c.color, fontWeight: 600, fontSize: "0.72rem" }}
            />
          );
        },
      },
      {
        key: "date",
        header: "Date",
        sortable: true,
        width: "130px",
        sortValue: (n) => new Date(n.date || 0).getTime(),
        render: (n) => <span className={styles.dateText}>{longDate(n.date)}</span>,
      },
      {
        key: "pinned",
        header: "Pinned",
        sortable: true,
        width: "92px",
        align: "center",
        searchable: false,
        sortValue: (n) => (n.pinned ? 1 : 0),
        render: (n) =>
          n.pinned ? (
            <Icon icon="mdi:pin" width={18} height={18} className={styles.pinDot} aria-label="Pinned" />
          ) : (
            <span className={styles.muted} aria-label="Not pinned">
              —
            </span>
          ),
      },
      {
        key: "published",
        header: "Published",
        sortable: true,
        width: "118px",
        align: "center",
        searchable: false,
        sortValue: (n) => (n.published ? 1 : 0),
        render: (n) => (
          <Chip
            size="small"
            label={n.published ? "Published" : "Draft"}
            sx={{
              bgcolor: n.published ? "#E7F6EF" : "#F1F5F9",
              color: n.published ? "#1E8E5A" : "#5B6678",
              fontWeight: 600,
              fontSize: "0.72rem",
            }}
          />
        ),
      },
      {
        key: "updated_at",
        header: "Updated",
        sortable: true,
        width: "130px",
        searchable: false,
        sortValue: (n) => new Date(n.updated_at || 0).getTime(),
        render: (n) => <span className={styles.dateText}>{longDate(n.updated_at)}</span>,
      },
      {
        key: "actions",
        header: "Actions",
        width: "176px",
        align: "right",
        searchable: false,
        render: (n) => (
          <div className={styles.actions}>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => openEdit(n)} aria-label="Edit notice" sx={actionSx}>
                <Icon icon="mdi:pencil-outline" width={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title={n.published ? "Unpublish" : "Publish"}>
              <IconButton
                size="small"
                onClick={() => handleTogglePublish(n)}
                aria-label={n.published ? "Unpublish notice" : "Publish notice"}
                sx={actionSx}
              >
                <Icon icon={n.published ? "mdi:eye-off-outline" : "mdi:eye-outline"} width={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title={n.pinned ? "Unpin" : "Pin to top"}>
              <IconButton
                size="small"
                onClick={() => handleTogglePin(n)}
                aria-label={n.pinned ? "Unpin notice" : "Pin notice to top"}
                sx={actionSx}
              >
                <Icon icon={n.pinned ? "mdi:pin-off-outline" : "mdi:pin-outline"} width={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => askDelete(n)} aria-label="Delete notice" sx={deleteActionSx}>
                <Icon icon="mdi:delete-outline" width={18} />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    [openEdit, handleTogglePublish, handleTogglePin, askDelete]
  );

  return (
    <div className={styles.page}>
      <AdminPageHeader
        eyebrow="Content"
        title="Notices"
        icon="mdi:bullhorn-outline"
        subtitle="Publish admission notifications and announcements to the public Notices page."
        actions={
          <div className={styles.headerActions}>
            <Tooltip title="Refresh notices">
              <span>
                <IconButton
                  size="small"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  aria-label="Refresh notices"
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
              onClick={openCreate}
              sx={addBtnSx}
            >
              Add Notice
            </Button>
          </div>
        }
      />

      <div className={styles.statsGrid}>
        <StatTile icon="mdi:bullhorn" value={stats.total} label="Total Notices" tone="navy" />
        <StatTile icon="mdi:earth" value={stats.published} label="Published" tone="green" />
        <StatTile icon="mdi:file-document-edit-outline" value={stats.drafts} label="Drafts" tone="gold" />
        <StatTile icon="mdi:pin" value={stats.pinned} label="Pinned" tone="pink" />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(n) => n.id}
        searchPlaceholder="Search notices…"
        emptyIcon="mdi:bullhorn-outline"
        emptyTitle="No notices yet"
        emptyMessage='Click "Add Notice" to publish your first admission notification or announcement.'
        toolbar={
          <label className={styles.filter}>
            <span className={styles.filterLabel}>Category</span>
            <select
              className={styles.filterSelect}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter notices by category"
            >
              <option value="all">All categories</option>
              {NOTICE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        }
      />

      <NoticeFormDialog
        open={formOpen}
        mode={formMode}
        notice={editing}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete notice?"
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

export default Notices;
