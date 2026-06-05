/* ============================================
   EventFormDialog — create / edit an event
   ============================================
   Modal form for the Events module. Built on MUI Dialog + the shared FormField
   kit and styled to the admin navy+gold palette. Mirrors NoticeFormDialog:
   validates the required fields (+ end ≥ start for dates and same-day times),
   then writes through eventService (optimistic cache update + server mirror +
   cross-tab notify) and hands the saved record back to the page via onSaved so
   it can refresh the list/calendar and toast.

   `prefill` seeds the empty form when creating — the admin calendar passes the
   clicked day as { start_date } so "Add event on this day" opens on that date.
   ============================================ */

import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Switch } from "@mui/material";
import { Icon } from "@iconify/react";
import { FormField } from "./ui";
import { createEvent, updateEvent, EVENT_CATEGORIES } from "../utils/eventService";
import styles from "./EventFormDialog.module.css";

const todayISO = () => new Date().toISOString().split("T")[0];

const emptyForm = (prefill = {}) => ({
  title: "",
  category: "General",
  description: "",
  start_date: prefill.start_date || todayISO(),
  end_date: prefill.end_date || "",
  start_time: prefill.start_time || "",
  end_time: prefill.end_time || "",
  venue: "",
  image_url: "",
  published: true,
});

// Map a stored event onto the form shape (dates trimmed to YYYY-MM-DD for the
// native date inputs; times kept as HH:mm).
const toForm = (event) => ({
  title: event.title || "",
  category: event.category || "General",
  description: event.description || "",
  start_date: (event.start_date || "").split("T")[0] || todayISO(),
  end_date: (event.end_date || "").split("T")[0] || "",
  start_time: event.start_time || "",
  end_time: event.end_time || "",
  venue: event.venue || "",
  image_url: event.image_url || "",
  published: event.published !== false,
});

// Style the MUI Switch track/thumb to a brand colour when checked.
const switchSx = (color) => ({
  "& .MuiSwitch-switchBase.Mui-checked": { color },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: color },
});

const EventFormDialog = ({ open, mode = "create", event = null, prefill = null, onClose, onSaved }) => {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Reset the form each time the dialog opens (fresh for create — seeded with
  // any prefill, hydrated for edit) so a previous session never bleeds into the
  // next.
  useEffect(() => {
    if (!open) return;
    setForm(isEdit && event ? toForm(event) : emptyForm(prefill || {}));
    setErrors({});
    setSaving(false);
  }, [open, isEdit, event, prefill]);

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (!form.start_date) next.start_date = "Start date is required.";
    // End date is optional, but when present it must not precede the start date.
    if (form.end_date && form.start_date && form.end_date < form.start_date) {
      next.end_date = "End date can't be before the start date.";
    }
    // For a single-day event, an end time (if both are set) must not precede the
    // start time. Multi-day events span midnight, so times don't compare.
    const singleDay = !form.end_date || form.end_date === form.start_date;
    if (singleDay && form.start_time && form.end_time && form.end_time < form.start_time) {
      next.end_time = "End time can't be before the start time.";
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
      description: form.description.trim(),
      start_date: form.start_date,
      // Drop an end date that just echoes the start date — it's a single-day event.
      end_date: form.end_date && form.end_date !== form.start_date ? form.end_date : "",
      start_time: form.start_time,
      end_time: form.end_time,
      venue: form.venue.trim(),
      image_url: form.image_url.trim(),
      published: form.published,
    };
    try {
      const saved = isEdit && event ? updateEvent(event.id, payload) : createEvent(payload);
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
            icon={isEdit ? "mdi:pencil-outline" : "mdi:calendar-plus"}
            width={24}
            height={24}
            color="var(--admin-accent, #C8A04D)"
          />
          {isEdit ? "Edit event" : "Add event"}
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: "var(--admin-border, #E6E9F0)" }}>
          <div className={styles.form}>
            <FormField label="Title" htmlFor="event-title" required error={errors.title}>
              <input
                id="event-title"
                type="text"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="e.g. Annual College Week"
                maxLength={200}
                autoFocus
              />
            </FormField>

            <div className={styles.row}>
              <FormField label="Category" htmlFor="event-category">
                <select
                  id="event-category"
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                >
                  {EVENT_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Venue" htmlFor="event-venue" hint="Optional.">
                <input
                  id="event-venue"
                  type="text"
                  value={form.venue}
                  onChange={(e) => setField("venue", e.target.value)}
                  placeholder="e.g. College Playground"
                  maxLength={160}
                />
              </FormField>
            </div>

            <div className={styles.row}>
              <FormField label="Start date" htmlFor="event-start-date" required error={errors.start_date}>
                <input
                  id="event-start-date"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setField("start_date", e.target.value)}
                />
              </FormField>

              <FormField
                label="End date"
                htmlFor="event-end-date"
                hint="Leave blank for a single-day event."
                error={errors.end_date}
              >
                <input
                  id="event-end-date"
                  type="date"
                  value={form.end_date}
                  min={form.start_date || undefined}
                  onChange={(e) => setField("end_date", e.target.value)}
                />
              </FormField>
            </div>

            <div className={styles.row}>
              <FormField label="Start time" htmlFor="event-start-time" hint="Optional.">
                <input
                  id="event-start-time"
                  type="time"
                  value={form.start_time}
                  onChange={(e) => setField("start_time", e.target.value)}
                />
              </FormField>

              <FormField label="End time" htmlFor="event-end-time" hint="Optional." error={errors.end_time}>
                <input
                  id="event-end-time"
                  type="time"
                  value={form.end_time}
                  onChange={(e) => setField("end_time", e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Description" htmlFor="event-description" hint="Optional. Plain text or simple markdown.">
              <textarea
                id="event-description"
                rows={4}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Event details shown on the public Events page…"
              />
            </FormField>

            <FormField
              label="Image"
              htmlFor="event-image"
              hint="Optional placeholder name, e.g. event-college-week."
            >
              <input
                id="event-image"
                type="text"
                value={form.image_url}
                onChange={(e) => setField("image_url", e.target.value)}
                placeholder="event-college-week"
                maxLength={200}
              />
            </FormField>

            <div className={styles.toggles}>
              <label className={styles.toggle}>
                <span className={styles.toggleText}>
                  <span className={styles.toggleLabel}>
                    <Icon icon="mdi:earth" width={16} height={16} />
                    Published
                  </span>
                  <span className={styles.toggleHint}>
                    {form.published
                      ? "Visible on the public site."
                      : "Saved as a draft — hidden from the public list & calendar."}
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
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create event"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventFormDialog;
