/* ============================================
   seedEvents.js — Fallback events before admin posts any
   Icon Commerce College
   --------------------------------------------
   Pure data module. Records match the events.php API shape (prompt 30):
   { id, title, description, category, start_date, end_date?, start_time?,
     end_time?, venue?, image_url?, published, created_at, updated_at }.
   Seeded with the four signature events from the prospectus / design-system §6.

   NOTE: the prospectus names these events but does not publish their calendar
   dates, so every `start_date` / `end_date` below is an indicative placeholder
   flagged `TODO (client)`. The client should set the real dates (the admin
   Events module then supersedes this seed entirely).
   ============================================ */

/**
 * @typedef {Object} CollegeEvent
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {('Academic'|'Cultural'|'Sports'|'Examination'|'Holiday'|'Workshop'|'General')} category
 * @property {string} start_date   ISO date
 * @property {string} [end_date]   ISO date (multi-day)
 * @property {string} [start_time] HH:mm
 * @property {string} [end_time]   HH:mm
 * @property {string} [venue]
 * @property {string} [image_url]  Placeholder name (resolved via assets)
 * @property {boolean} published
 * @property {string} created_at   ISO
 * @property {string} updated_at   ISO
 */

const now = '2026-01-01T00:00:00.000Z';

/** @type {CollegeEvent[]} */
export const seedEvents = [
  {
    id: 'seed-event-college-week',
    title: 'Annual College Week',
    description:
      'The college’s flagship week-long celebration — indoor & outdoor games, quiz and debate competitions, and art & literature events that bring out the latent skills and talent of our students.',
    category: 'Cultural',
    start_date: '2026-09-21', // TODO (client): confirm actual dates.
    end_date: '2026-09-26', // TODO (client): confirm actual dates.
    venue: 'College Campus',
    image_url: 'event-college-week',
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'seed-event-cooking-competition',
    title: 'Inter-College Cooking Competition 2026',
    description:
      'A lively inter-college culinary contest showcasing the creativity and skills of students from across the region.',
    category: 'Cultural',
    start_date: '2026-11-13', // TODO (client): confirm actual date.
    venue: 'College Campus',
    image_url: 'event-cooking-competition',
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'seed-event-icon-shield',
    title: 'ICON Shield — Cricket Tournament',
    description:
      'The annual cricket tournament organised by the ICON group in memory of Rupam Patgiri.',
    category: 'Sports',
    start_date: '2026-08-17', // TODO (client): confirm actual dates.
    end_date: '2026-08-22', // TODO (client): confirm actual dates.
    venue: 'College Playground',
    image_url: 'event-icon-shield',
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'seed-event-icon-trophy',
    title: 'ICON Trophy — Cricket Tournament',
    description:
      'The annual cricket tournament organised by the ICON group in memory of Jadav Dutta.',
    category: 'Sports',
    start_date: '2027-01-18', // TODO (client): confirm actual dates.
    end_date: '2027-01-23', // TODO (client): confirm actual dates.
    venue: 'College Playground',
    image_url: 'event-icon-trophy',
    published: true,
    created_at: now,
    updated_at: now,
  },
];

export default seedEvents;
