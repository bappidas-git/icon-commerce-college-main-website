/* ============================================
   seedEvents.js — Fallback events before admin posts any
   Icon Commerce College
   --------------------------------------------
   Pure data module. Records match the events.php API shape (prompt 30):
   { id, title, description, category, start_date, end_date?, start_time?,
     end_time?, venue?, image_url?, published, created_at, updated_at }.
   Seeded with the four signature events from design-system §6.
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
      'A week-long celebration featuring indoor & outdoor games, quiz, debate, and art & literature competitions — the highlight of the college calendar.',
    category: 'Cultural',
    start_date: '2026-09-21',
    end_date: '2026-09-26',
    venue: 'College Campus',
    image_url: 'event-college-week',
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'seed-event-cooking-competition',
    title: 'Inter-College Cooking Competition',
    description:
      'A lively inter-college culinary contest showcasing the creativity and skills of students from across the region.',
    category: 'Cultural',
    start_date: '2026-11-13',
    venue: 'College Playground',
    image_url: 'event-cooking-competition',
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: 'seed-event-icon-shield',
    title: 'ICON Shield — Cricket Tournament',
    description:
      'The annual ICON Shield cricket tournament, held in loving memory of Rupam Patgiri.',
    category: 'Sports',
    start_date: '2026-08-17',
    end_date: '2026-08-22',
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
      'The annual ICON Trophy cricket tournament, held in loving memory of Jadav Dutta.',
    category: 'Sports',
    start_date: '2027-01-18',
    end_date: '2027-01-23',
    venue: 'College Playground',
    image_url: 'event-icon-trophy',
    published: true,
    created_at: now,
    updated_at: now,
  },
];

export default seedEvents;
