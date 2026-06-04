/* ============================================
   seedNotices.js — Fallback notices before admin posts any
   Icon Commerce College
   --------------------------------------------
   Pure data module. Records match the notices.php API shape (prompt 28):
   { id, title, body, category, date, pinned, published, created_at, updated_at }.
   Used by the Notices UI as fallback content until the admin publishes.
   ============================================ */

/**
 * @typedef {Object} Notice
 * @property {string} id
 * @property {string} title
 * @property {string} body          Plain text / markdown
 * @property {('Admission'|'Examination'|'Event'|'General'|'Result'|'Holiday')} category
 * @property {string} date          ISO display / publish date
 * @property {boolean} pinned
 * @property {boolean} published
 * @property {string} created_at    ISO
 * @property {string} updated_at    ISO
 */

/** @type {Notice[]} */
export const seedNotices = [
  {
    id: 'seed-notice-1',
    title: 'Admission Notification — 1st Semester UG Course, 2026-27',
    body:
      'Admissions are now open for the 1st Semester of all UG programs (B.Com, BBA, BCA, B.A.) for the 2026-27 session. Register on the Samarth portal (College Code 842) and select ICON COMMERCE COLLEGE. Limited seats available.',
    category: 'Admission',
    date: '2026-05-15',
    pinned: true,
    published: true,
    created_at: '2026-05-15T04:00:00.000Z',
    updated_at: '2026-05-15T04:00:00.000Z',
  },
  {
    id: 'seed-notice-2',
    title: 'Admission Process Guide for Applicants',
    body:
      'A step-by-step guide to the admission process: (1) Register on the Samarth portal, (2) Select ICON COMMERCE COLLEGE and your stream, (3) Complete document verification and take admission, (4) Receive a confirmation SMS on your registered mobile.',
    category: 'Admission',
    date: '2026-05-10',
    pinned: false,
    published: true,
    created_at: '2026-05-10T04:00:00.000Z',
    updated_at: '2026-05-10T04:00:00.000Z',
  },
];

export default seedNotices;
