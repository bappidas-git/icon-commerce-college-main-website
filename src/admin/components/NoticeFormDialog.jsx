/* ============================================
   NoticeFormDialog — create / edit a notice
   ============================================
   Modal form for the Notices module. Built on MUI Dialog + the shared
   FormField kit and styled to the admin navy+gold palette. Validates the
   required fields, then writes through noticeService (optimistic cache update
   + server mirror + cross-tab notify) and hands the saved record back to the
   page via onSaved so it can refresh the table and toast.
   ============================================ */

import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Switch } from "@mui/material";
import { Icon } from "@iconify/react";
import { FormField } from "./ui";
import { createNotice, updateNotice, NOTICE_CATEGORIES } from "../utils/noticeService";
import styles from "./NoticeFormDialog.module.css";

const todayISO = () => new Date().toISOString().split("T")[0];

const emptyForm = () => ({
  title: "",
  category: "General",
  date: todayISO(),
  body: "",
  attachment_url: "",
  pinned: false,
  published: true,
});

// Map a stored notice onto the form shape (date trimmed to YYYY-MM-DD for the
// native date input).
const toForm = (notice) => ({
  title: notice.title || "",
  category: notice.category || "General",
  date: (notice.date || "").split("T")[0] || todayISO(),
  body: notice.body || "",
  attachment_url: notice.attachment_url || "",
  pinned: Boolean(notice.pinned),
  published: notice.published !== false,
});

// Style the MUI Switch track/thumb to a brand colour when checked.
const switchSx = (color) => ({
  "& .MuiSwitch-switchBase.Mui-checked": { color },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: color },
});

const NoticeFormDialog = ({ open, mode = "create", notice = null, onClose, onSaved }) => {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Reset the form each time the dialog opens (fresh for create, hydrated for
  // edit) so a previous session never bleeds into the next.
  useEffect(() => {
    if (!open) return;
    setForm(isEdit && notice ? toForm(notice) : emptyForm());
    setErrors({});
    setSaving(false);
  }, [open, isEdit, notice]);

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (!form.date) next.date = "Publish date is required.";
    if (form.attachment_url.trim() && !/^https?:\/\/.+/i.test(form.attachment_url.trim())) {
      next.attachment_url = "Enter a full URL starting with http:// or https://";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (saving) return;
    if (!validate()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      category: form.category,
      date: form.date,
      body: form.body.trim(),
      attachment_url: form.attachment_url.trim(),
      pinned: form.pinned,
      published: form.published,
    };
    try {
      const saved = isEdit && notice ? updateNotice(notice.id, payload) : createNotice(payload);
      onSaved?.(saved, mode);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px" } }}
    >
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            fontFamily: "var(--font-heading, 'Poppins', sans-serif)",
            fontWeight: 700,
            color: "var(--admin-text-primary, #14233D)",
          }}
        >
          <Icon
            icon={isEdit ? "mdi:pencil-outline" : "mdi:bullhorn-outline"}
            width={24}
            height={24}
            color="var(--admin-accent, #C8A04D)"
          />
          {isEdit ? "Edit notice" : "Add notice"}
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: "var(--admin-border, #E6E9F0)" }}>
          <div className={styles.form}>
            <FormField label="Title" htmlFor="notice-title" required error={errors.title}>
              <input
                id="notice-title"
                type="text"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="e.g. Admission Notification — 1st Semester UG, 2026-27"
                maxLength={200}
                autoFocus
              />
            </FormField>

            <div className={styles.row}>
              <FormField label="Category" htmlFor="notice-category">
                <select
                  id="notice-category"
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                >
                  {NOTICE_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Date" htmlFor="notice-date" required error={errors.date}>
                <input
                  id="notice-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setField("date", e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Body" htmlFor="notice-body" hint="Optional. Plain text or simple markdown.">
              <textarea
                id="notice-body"
                rows={5}
                value={form.body}
                onChange={(e) => setField("body", e.target.value)}
                placeholder="Notice details shown on the public Notices page…"
              />
            </FormField>

            <FormField
              label="Attachment URL"
              htmlFor="notice-attachment"
              hint="Optional link to a PDF or image."
              error={errors.attachment_url}
            >
              <input
                id="notice-attachment"
                type="url"
                value={form.attachment_url}
                onChange={(e) => setField("attachment_url", e.target.value)}
                placeholder="https://…"
              />
            </FormField>

            <div className={styles.toggles}>
              <label className={styles.toggle}>
                <span className={styles.toggleText}>
                  <span className={styles.toggleLabel}>
                    <Icon icon="mdi:pin-outline" width={16} height={16} />
                    Pin to top
                  </span>
                  <span className={styles.toggleHint}>Pinned notices float above the rest.</span>
                </span>
                <Switch
                  checked={form.pinned}
                  onChange={(e) => setField("pinned", e.target.checked)}
                  inputProps={{ "aria-label": "Pin to top" }}
                  sx={switchSx("var(--admin-accent, #C8A04D)")}
                />
              </label>

              <label className={styles.toggle}>
                <span className={styles.toggleText}>
                  <span className={styles.toggleLabel}>
                    <Icon icon="mdi:earth" width={16} height={16} />
                    Published
                  </span>
                  <span className={styles.toggleHint}>
                    {form.published
                      ? "Visible on the public site."
                      : "Saved as a draft — hidden from the public list."}
                  </span>
                </span>
                <Switch
                  checked={form.published}
                  onChange={(e) => setField("published", e.target.checked)}
                  inputProps={{ "aria-label": "Published" }}
                  sx={switchSx("var(--admin-success, #1E8E5A)")}
                />
              </label>
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ padding: "12px 24px 20px", gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={saving}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "var(--admin-text-secondary, #5B6678)",
              borderRadius: "10px",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={saving}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              background: "var(--admin-gradient, linear-gradient(135deg, #1A2A52 0%, #2C3E6B 100%))",
              "&:hover": {
                background: "var(--admin-gradient, linear-gradient(135deg, #1A2A52 0%, #2C3E6B 100%))",
                filter: "brightness(1.06)",
              },
            }}
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create notice"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NoticeFormDialog;
