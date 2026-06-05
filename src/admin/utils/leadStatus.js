/* ============================================
   Lead Status — Single Source of Truth
   ============================================
   Every admin surface (Lead Management table, Lead Detail, Dashboard,
   activity timeline, snackbars, filter chips) must render the SAME set of
   statuses. Keeping the list here — and importing it everywhere — guarantees
   only the present statuses are ever shown and that a label/colour change in
   one place updates the whole admin panel.

   College admission funnel (design-system §8 / prompt 27):

     New · Contacted · Interested · Application Started ·
     Admitted / Seat Booked · Not Interested

   The `value` keys are the canonical workflow keys persisted on each lead and
   sent in sync/export payloads. DO NOT rename them — only the human `label` is
   shown in the UI.

   Earlier builds shipped a generic consultation funnel
   (Hot / Warm / Cold / Seat Booked); `LEGACY_STATUS_MAP` + `normalizeStatus()`
   below fold any lead still carrying those old keys onto the closest college
   stage so stale data never renders as a raw key or collapses to "New".
   ============================================ */

export const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "#2563EB", bg: "#EBF2FF" },
  { value: "contacted", label: "Contacted", color: "#0E7490", bg: "#E0F7FA" },
  { value: "interested", label: "Interested", color: "#A8823A", bg: "#F3E9D2" },
  { value: "application_started", label: "Application Started", color: "#7C3AED", bg: "#F1ECFE" },
  { value: "admitted", label: "Admitted / Seat Booked", color: "#1E8E5A", bg: "#E7F6EF" },
  { value: "not_interested", label: "Not Interested", color: "#64748B", bg: "#F1F5F9" },
];

// Quick lookup maps derived from the canonical list above.
export const STATUS_LABELS = STATUS_OPTIONS.reduce((acc, s) => {
  acc[s.value] = s.label;
  return acc;
}, {});

const STATUS_BY_VALUE = STATUS_OPTIONS.reduce((acc, s) => {
  acc[s.value] = s;
  return acc;
}, {});

// Reverse map (label -> option) so we can also recognise entries that were
// already stored with a label.
const STATUS_BY_LABEL = STATUS_OPTIONS.reduce((acc, s) => {
  acc[s.label] = s;
  return acc;
}, {});

// Legacy workflow keys (pre-college rebuild) mapped to their closest college
// stage. `contacted` is intentionally absent: the key is unchanged — only its
// label moved from "Hot" to "Contacted".
const LEGACY_STATUS_MAP = {
  consultation_booked: "interested",
  procedure_scheduled: "application_started",
  completed: "admitted",
};

/**
 * Resolve any stored status to a CURRENT canonical key. Unknown/empty values
 * fall back to "new"; legacy keys are folded forward via LEGACY_STATUS_MAP so
 * filtering, stats and chips all agree on a single present status.
 */
export const normalizeStatus = (status) => {
  if (!status) return "new";
  if (STATUS_BY_VALUE[status]) return status;
  if (LEGACY_STATUS_MAP[status] && STATUS_BY_VALUE[LEGACY_STATUS_MAP[status]]) {
    return LEGACY_STATUS_MAP[status];
  }
  return status;
};

/**
 * Resolve a status value to its full config (label/color/bg). Normalises first
 * (legacy → current) and falls back to the first option ("New") so the UI never
 * renders an unknown raw key.
 */
export const getStatusConfig = (status) =>
  STATUS_BY_VALUE[normalizeStatus(status)] || STATUS_OPTIONS[0];

/**
 * Resolve a status value to its display label, falling back to the raw value.
 */
export const statusLabel = (value) =>
  STATUS_LABELS[normalizeStatus(value)] || value || "";

/**
 * Build the activity-log text for a status change using display labels, e.g.
 * `Status changed from "New" to "Contacted"`.
 */
export const describeStatusChange = (from, to) =>
  `Status changed from "${statusLabel(from)}" to "${statusLabel(to)}"`;

// Resolve a single quoted token from an activity action to its current option,
// recognising a current key, a current label, or a legacy key.
const resolveStatusToken = (token) => {
  if (STATUS_BY_VALUE[token]) return STATUS_BY_VALUE[token];
  if (STATUS_BY_LABEL[token]) return STATUS_BY_LABEL[token];
  const mapped = LEGACY_STATUS_MAP[token];
  if (mapped && STATUS_BY_VALUE[mapped]) return STATUS_BY_VALUE[mapped];
  return null;
};

/**
 * Normalise any activity-log action text so it always reads with the present
 * labels. Older entries (and sync payloads from older clients) stored raw
 * status keys or stale labels inside the quoted text (e.g. `... to "completed"`);
 * this maps any quoted current key, current label, or legacy key to its current
 * label so the timeline never shows a raw/stale status.
 */
export const formatActivityAction = (action) => {
  if (!action) return "";
  return action.replace(/"([^"]+)"/g, (match, token) => {
    const opt = resolveStatusToken(token);
    return opt ? `"${opt.label}"` : match;
  });
};
