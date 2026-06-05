/* ============================================
   facilitiesData.js — Campus facilities
   Icon Commerce College
   --------------------------------------------
   Content data for the /facilities page (design-system §6):
     • facilitiesData     — the 10 facilities (icon + title + blurb) for the grid
     • facilitySpotlights — 3 richer two-column rows (Library · Computer Lab ·
                            Sports & College Week) with an image + feature points
     • campusGlimpses     — 3 image tiles (Smart Classrooms · Canteen · Wi-Fi)
   `icon` uses Iconify names; images resolve through utils/assets `placeholder()`
   so the labelled dev placeholders can be swapped for real photos later.
   ============================================ */

import { placeholder } from '../utils/assets';

/**
 * @typedef {Object} Facility
 * @property {string} icon         Iconify icon name
 * @property {string} title
 * @property {string} description
 */

/** @type {Facility[]} */
export const facilitiesData = [
  {
    icon: 'mdi:account-tie-voice',
    title: 'Qualified & Experienced Faculty',
    description:
      'A dedicated team of well-qualified, experienced teachers committed to student success and mentoring.',
  },
  {
    icon: 'mdi:bookshelf',
    title: 'Digital Library',
    description:
      'A well-stocked library with reference books, journals and digital resources for study and research.',
  },
  {
    icon: 'mdi:desktop-classic',
    title: 'Computer Lab',
    description:
      'A modern, internet-enabled computer laboratory supporting BCA practicals and digital skills.',
  },
  {
    icon: 'mdi:monitor-dashboard',
    title: 'Smart Classrooms',
    description:
      'Technology-enabled classrooms for interactive, audio-visual and engaging learning.',
  },
  {
    icon: 'mdi:google-classroom',
    title: 'Online Classes (Google Meet)',
    description:
      'Blended learning support with online classes conducted over Google Meet when needed.',
  },
  {
    icon: 'mdi:silverware-fork-knife',
    title: 'College Canteen',
    description:
      'A hygienic and affordable canteen serving fresh food and refreshments on campus.',
  },
  {
    icon: 'mdi:wifi',
    title: 'Free Wi-Fi / Internet',
    description:
      'Campus-wide Wi-Fi giving students free access to the internet for study and research.',
  },
  {
    icon: 'mdi:soccer',
    title: 'Playground',
    description:
      'An open playground for sports, the annual College Week and signature cricket tournaments.',
  },
  {
    icon: 'mdi:water-check',
    title: 'Purified Drinking Water',
    description:
      'Safe, purified drinking water stations available across the campus.',
  },
  {
    icon: 'mdi:hand-coin',
    title: 'Government Scholarship Assistance',
    description:
      'Guidance and assistance for eligible students to access government scholarships.',
  },
];

/**
 * @typedef {Object} FacilitySpotlight
 * @property {string} key       Stable key / DOM id.
 * @property {string} icon      Iconify icon name (floating badge on the image).
 * @property {string} eyebrow   Gold uppercase label above the heading.
 * @property {string} title     Spotlight heading.
 * @property {string} image     Resolved placeholder image URL.
 * @property {string} alt       Image alt text.
 * @property {string} lead      Lead paragraph.
 * @property {string[]} points  Feature bullet points.
 */

/**
 * Feature spotlights — 2–3 richer two-column blocks (design-system §6). The copy
 * is grounded in the prospectus / design-system facts (no fabrication).
 * @type {FacilitySpotlight[]}
 */
export const facilitySpotlights = [
  {
    key: 'digital-library',
    icon: 'mdi:bookshelf',
    eyebrow: 'Digital Library',
    title: 'A quiet, well-stocked space to read and research',
    image: placeholder('facility-library'),
    alt: 'The digital library at Icon Commerce College',
    lead:
      'Our digital library brings reference books, journals and online resources together in one calm, focused space — so every student has the materials they need to read, study and research.',
    points: [
      'Reference books, textbooks and journals across all four programmes',
      'Digital resources and e-content for study and research',
      'A quiet reading area designed for focused, independent study',
    ],
  },
  {
    key: 'computer-lab',
    icon: 'mdi:desktop-classic',
    eyebrow: 'Computer Lab',
    title: 'A modern, internet-enabled computing laboratory',
    image: placeholder('facility-computer-lab'),
    alt: 'The computer laboratory at Icon Commerce College',
    lead:
      'Our computer laboratory gives students hands-on access to modern, internet-enabled machines — supporting BCA practicals and building the digital skills every graduate needs today.',
    points: [
      'Internet-enabled workstations for practicals and projects',
      'Dedicated support for the BCA programme and lab work',
      'A space to build practical, job-ready digital skills',
    ],
  },
  {
    key: 'sports-college-week',
    icon: 'mdi:trophy-outline',
    eyebrow: 'Sports & College Week',
    title: 'An open ground for sport, culture and college spirit',
    image: placeholder('facility-playground'),
    alt: 'The playground and sports ground at Icon Commerce College',
    lead:
      'Beyond the classroom, our playground hosts the annual College Week and our signature cricket tournaments — bringing students together through games, culture and a healthy spirit of competition.',
    points: [
      'Annual College Week — indoor & outdoor games, quiz, debate, art & literature',
      'ICON Shield — annual cricket tournament in memory of Rupam Patgiri',
      'ICON Trophy — annual cricket tournament in memory of Jadav Dutta',
    ],
  },
];

/**
 * @typedef {Object} CampusGlimpse
 * @property {string} image    Resolved placeholder image URL.
 * @property {string} title    Short caption title.
 * @property {string} caption  One-line caption.
 */

/**
 * Campus glimpses — image tiles for the facilities we don't spotlight, reusing
 * the remaining labelled placeholders. Doubles as a teaser to the photo gallery.
 * @type {CampusGlimpse[]}
 */
export const campusGlimpses = [
  {
    image: placeholder('facility-smart-classroom'),
    title: 'Smart Classrooms',
    caption: 'Technology-enabled rooms for interactive, audio-visual learning.',
  },
  {
    image: placeholder('facility-canteen'),
    title: 'College Canteen',
    caption: 'A hygienic, affordable canteen serving fresh food on campus.',
  },
  {
    image: placeholder('facility-wifi'),
    title: 'Free Wi-Fi',
    caption: 'Campus-wide Wi-Fi for study and research, free for students.',
  },
];

export default facilitiesData;
