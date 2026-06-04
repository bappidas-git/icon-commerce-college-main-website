/* ============================================
   Lead Detail Page
   Dedicated full-page lead detail view
   ============================================ */

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { Icon } from "@iconify/react";
import {
  getLeadById,
  updateLeadStatus,
  addLeadNote,
  deleteLead,
  syncLeadsFromServer,
  onLeadsChanged,
} from "../utils/leadService";
import {
  STATUS_OPTIONS,
  getStatusConfig,
  formatActivityAction,
} from "../utils/leadStatus";
import styles from "./LeadDetail.module.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "\u2014";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ============================================
   Notes Section — Isolated component
   Manages its own noteText state to prevent
   full-page re-renders on each keystroke
   ============================================ */
const NotesSection = ({ leadId, notes, onNoteAdded }) => {
  const [noteText, setNoteText] = useState("");

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const updated = addLeadNote(leadId, noteText.trim());
    setNoteText("");
    if (onNoteAdded) onNoteAdded(updated);
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>
        <Icon icon="mdi:note-text-outline" width={16} />
        Notes
      </h3>
      <textarea
        className={styles.noteTextarea}
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Add notes..."
        rows={3}
      />
      <button
        className={styles.addNoteBtn}
        onClick={handleAddNote}
        disabled={!noteText.trim()}
      >
        <Icon icon="mdi:plus" width={16} />
        Add Note
      </button>
      <div className={styles.notesList}>
        {(!notes || notes.length === 0) ? (
          <p className={styles.emptyNotes}>No notes yet.</p>
        ) : (
          [...notes].reverse().map((note) => (
            <div key={note.id} className={styles.noteItem}>
              <p className={styles.noteText}>{note.text}</p>
              <span className={styles.noteTime}>{formatDate(note.timestamp)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ============================================
   Lead Detail Page
   ============================================ */
const LeadDetail = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const loadLead = useCallback(() => {
    const data = getLeadById(leadId);
    if (!data) {
      setNotFound(true);
    } else {
      setLead(data);
      setNotFound(false);
    }
  }, [leadId]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  // Keep this lead in sync with the shared server store so status/note changes
  // made on another browser or device show up here without a manual reload.
  // We sync on mount, poll while the tab is visible, re-sync when the tab
  // regains focus, and react to cross-tab localStorage writes. The merge in
  // syncLeadsFromServer is last-write-wins, so an open detail view converges
  // to whatever the most recent edit was, wherever it was made.
  useEffect(() => {
    let cancelled = false;
    const POLL_MS = 15000;
    let intervalId = null;

    const syncAndReload = () => {
      if (document.visibilityState !== "visible") return;
      syncLeadsFromServer().then((result) => {
        if (cancelled || result.error) return;
        if (result.added > 0 || result.updated > 0 || result.removed > 0)
          loadLead();
      });
    };

    const start = () => {
      if (intervalId) return;
      intervalId = setInterval(syncAndReload, POLL_MS);
    };
    const stop = () => {
      if (!intervalId) return;
      clearInterval(intervalId);
      intervalId = null;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncAndReload();
        start();
      } else {
        stop();
      }
    };

    // Reload instantly when this lead is mutated in another tab/window of the
    // same browser (BroadcastChannel / storage / same-tab event).
    const unsubscribe = onLeadsChanged(() => loadLead());

    // Initial sync on mount (independent of visibility-change events).
    syncLeadsFromServer().then((result) => {
      if (cancelled || result.error) return;
      if (result.added > 0 || result.updated > 0 || result.removed > 0)
        loadLead();
    });

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unsubscribe();
    };
  }, [loadLead]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleStatusChange = (newStatus) => {
    updateLeadStatus(leadId, newStatus);
    loadLead();
    showSnackbar(`Status updated to "${getStatusConfig(newStatus).label}"`);
  };

  const handleNoteAdded = (updatedLead) => {
    setLead(updatedLead);
    showSnackbar("Note added");
  };

  const handleDelete = () => {
    deleteLead(leadId);
    showSnackbar("Lead deleted");
    navigate("/admin/lms");
  };

  // Not found state
  if (notFound) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>
          <Icon icon="mdi:account-search-outline" width={64} />
        </div>
        <h2 className={styles.notFoundTitle}>Lead not found</h2>
        <p className={styles.notFoundText}>
          The admission lead you're looking for doesn't exist or has been deleted.
        </p>
        <button className={styles.backBtn} onClick={() => navigate("/admin/lms")}>
          <Icon icon="mdi:arrow-left" width={16} />
          Back to Leads
        </button>
      </div>
    );
  }

  // Loading state
  if (!lead) return null;

  const sc = getStatusConfig(lead.status);

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate("/admin/lms")}>
            <Icon icon="mdi:arrow-left" width={16} />
            Back to Leads
          </button>
          <div className={styles.headerInfo}>
            <h1 className={styles.leadName}>{lead.name || "Unknown Lead"}</h1>
            <p className={styles.leadId}>ID: {lead.lead_id}</p>
          </div>
        </div>
        <Select
          value={lead.status || "new"}
          size="small"
          onChange={(e) => handleStatusChange(e.target.value)}
          sx={{
            fontWeight: 600,
            bgcolor: sc.bg,
            color: sc.color,
            minWidth: 140,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: sc.color + "44" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: sc.color + "88" },
          }}
        >
          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              <Chip label={s.label} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600 }} />
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* Two-Column Layout */}
      <div className={styles.columns}>
        {/* Left Column — Lead Information */}
        <div className={styles.leftColumn}>
          {/* Contact Details */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Icon icon="mdi:account-circle-outline" width={16} />
              Applicant Details
            </h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoField}>
                <span className={styles.infoLabel}>Full Name</span>
                <span className={lead.name ? styles.infoValue : styles.infoDash}>
                  {lead.name || "\u2014"}
                </span>
              </div>
              <div className={styles.infoField}>
                <span className={styles.infoLabel}>Mobile</span>
                {lead.mobile ? (
                  <a href={`tel:${lead.mobile}`} className={styles.infoLink}>
                    {lead.mobile}
                  </a>
                ) : (
                  <span className={styles.infoDash}>{"\u2014"}</span>
                )}
              </div>
              <div className={styles.infoFieldFull}>
                <span className={styles.infoLabel}>Email</span>
                {lead.email ? (
                  <a href={`mailto:${lead.email}`} className={styles.infoLink}>
                    {lead.email}
                  </a>
                ) : (
                  <span className={styles.infoDash}>{"\u2014"}</span>
                )}
              </div>
            </div>
          </div>

          {/* Admission Interest */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Icon icon="mdi:school-outline" width={16} />
              Admission Interest
            </h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoField}>
                <span className={styles.infoLabel}>Course Interested</span>
                <span className={lead.service_interest ? styles.infoValue : styles.infoDash}>
                  {lead.service_interest || "\u2014"}
                </span>
              </div>
              <div className={styles.infoField}>
                <span className={styles.infoLabel}>State</span>
                <span className={lead.state ? styles.infoValue : styles.infoDash}>
                  {lead.state || "\u2014"}
                </span>
              </div>
            </div>
          </div>

          {/* Source & UTM Data */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Icon icon="mdi:web" width={16} />
              Source & UTM Data
            </h3>
            <div style={{ marginBottom: 10 }}>
              <span className={styles.infoLabel}>Source</span>
              <div style={{ marginTop: 4 }}>
                {lead.source ? (
                  <span className={styles.sourceChip}>{lead.source}</span>
                ) : (
                  <span className={styles.infoDash}>{"\u2014"}</span>
                )}
              </div>
            </div>
            <div className={styles.utmGrid}>
              {[
                { label: "UTM Source", value: lead.utm_source },
                { label: "UTM Medium", value: lead.utm_medium },
                { label: "UTM Campaign", value: lead.utm_campaign },
                { label: "UTM Term", value: lead.utm_term },
                { label: "UTM Content", value: lead.utm_content },
              ].map((item) => (
                <div key={item.label} className={styles.utmItem}>
                  <span className={styles.infoLabel}>{item.label}</span>
                  <span className={item.value ? styles.infoValue : styles.infoDash}>
                    {item.value || "\u2014"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Details */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Icon icon="mdi:information-outline" width={16} />
              Submission Details
            </h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoField}>
                <span className={styles.infoLabel}>Submitted At</span>
                <span className={styles.infoValue}>{formatDate(lead.submitted_at)}</span>
              </div>
              <div className={styles.infoFieldFull}>
                <span className={styles.infoLabel}>Page URL</span>
                <span
                  className={lead.page_url ? styles.infoValue : styles.infoDash}
                  title={lead.page_url}
                >
                  {lead.page_url
                    ? lead.page_url.length > 60
                      ? lead.page_url.slice(0, 60) + "..."
                      : lead.page_url
                    : "\u2014"}
                </span>
              </div>
              <div className={styles.infoFieldFull}>
                <span className={styles.infoLabel}>User Agent</span>
                <span
                  className={lead.user_agent ? styles.infoValue : styles.infoDash}
                  title={lead.user_agent}
                  style={{ fontSize: "0.8rem" }}
                >
                  {lead.user_agent
                    ? lead.user_agent.length > 80
                      ? lead.user_agent.slice(0, 80) + "..."
                      : lead.user_agent
                    : "\u2014"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Actions & Activity */}
        <div className={styles.rightColumn}>
          {/* Notes Section (isolated component) */}
          <NotesSection
            leadId={lead.lead_id}
            notes={lead.notes}
            onNoteAdded={handleNoteAdded}
          />

          {/* Activity Timeline */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Icon icon="mdi:timeline-clock-outline" width={16} />
              Activity Timeline
            </h3>
            {(!lead.activity || lead.activity.length === 0) ? (
              <p className={styles.emptyTimeline}>No activity recorded.</p>
            ) : (
              <div className={styles.timeline}>
                {[...(lead.activity || [])].reverse().map((act, i) => {
                  const actSc = getStatusConfig(act.status);
                  return (
                    <div key={i} className={styles.timelineItem}>
                      <div
                        className={styles.timelineDot}
                        style={{ backgroundColor: actSc.color }}
                      />
                      <div className={styles.timelineContent}>
                        <p className={styles.timelineAction}>{formatActivityAction(act.action)}</p>
                        <p className={styles.timelineTime}>{formatDate(act.timestamp)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons (desktop) */}
          <div className={`${styles.card} ${styles.desktopActions}`}>
            <div className={styles.actionButtons}>
              <button
                className={styles.deleteBtn}
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Icon icon="mdi:delete-outline" width={18} />
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className={styles.mobileFooter}>
        <button
          className={styles.deleteBtn}
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Icon icon="mdi:delete-outline" width={18} />
          Delete
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this lead? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LeadDetail;
