/* ============================================
   facilitiesData.js — Campus facilities
   Icon Commerce College
   --------------------------------------------
   Pure data module. The 10 facilities from design-system §6.
   `icon` uses Iconify names (rendered via the icon component).
   ============================================ */

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

export default facilitiesData;
