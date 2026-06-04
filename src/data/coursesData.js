/* ============================================
   coursesData.js — The 4 undergraduate programs
   Icon Commerce College
   --------------------------------------------
   Pure data module. Fees, eligibility and breakdowns are the exact
   figures from design-system §6. Images reference §7 placeholder names.
   ============================================ */

import { placeholder } from '../utils/assets';

const LEVEL = 'Undergraduate (FYUGP, NEP 2020)';
const DURATION = '3/4 Years (6/8 Semesters)';
const AFFILIATION = 'Gauhati University';

/** Common document-verification list (design-system §6). */
const COMMON_DOCUMENTS = [
  'HS (10+2) marksheet & pass certificate',
  'Registration / Migration Certificate',
  'Gap Certificate (affidavit) if applicable',
  'Recent passport-size photographs',
];

/** Fee breakdown for B.Com / B.A. (total ₹10,900). */
const FEES_BCOM_BA = {
  rows: [
    { particular: 'Admission Fee', amount: '₹5,500' },
    { particular: 'Library Fee', amount: '₹800' },
    { particular: 'ID-Card / Entry Fee', amount: '₹100' },
    { particular: 'Miscellaneous', amount: '₹4,500' },
  ],
  total: '₹10,900',
  tuitionMonthly: '₹1,800',
  application: '₹300',
  note:
    'GU registration / enrolment / examination fees are extra and subject to change. All fees are non-refundable.',
};

/** Fee breakdown for BCA / BBA (total ₹11,000). */
const FEES_BCA_BBA = {
  rows: [
    { particular: 'Admission Fee', amount: '₹5,500' },
    { particular: 'Library Fee', amount: '₹900' },
    { particular: 'ID-Card / Entry Fee', amount: '₹100' },
    { particular: 'Miscellaneous', amount: '₹4,500' },
  ],
  total: '₹11,000',
  tuitionMonthly: '₹2,000',
  application: '₹300',
  note:
    'GU registration / enrolment / examination fees are extra and subject to change. All fees are non-refundable.',
};

/**
 * @typedef {Object} Course
 * @property {string} slug          URL slug: b-com | bba | bca | b-a
 * @property {string} name          Full program name
 * @property {string} shortName     Compact label (B.Com., BBA, …)
 * @property {string} level
 * @property {string} duration
 * @property {string} affiliation
 * @property {string} image         Placeholder URL
 * @property {string} summary
 * @property {string} eligibility
 * @property {string[]} highlights
 * @property {string[]} careers
 * @property {{rows:{particular:string,amount:string}[], total:string,
 *            tuitionMonthly:string, application:string, note:string}} fees
 * @property {string[]} documents
 * @property {string} [badge]
 */

/** @type {Course[]} */
export const coursesData = [
  {
    slug: 'b-com',
    name: 'Bachelor of Commerce (B.Com.)',
    shortName: 'B.Com.',
    level: LEVEL,
    duration: DURATION,
    affiliation: AFFILIATION,
    image: placeholder('course-bcom'),
    badge: 'Most Popular',
    summary:
      'A career-focused commerce degree covering accountancy, finance, taxation and business management — the flagship program at Icon Commerce College.',
    eligibility:
      'Passed HS (10+2) in any stream (Commerce / Science / Arts) under AHSEC or an equivalent board.',
    highlights: [
      'Accountancy, Finance & Taxation focus',
      'Practical, industry-aligned curriculum',
      'Foundation for CA / CS / CMA pathways',
      'Tally & computerised accounting exposure',
    ],
    careers: [
      'Accountant / Auditor',
      'Banking & Financial Services',
      'Tax Consultant',
      'CA / CS / CMA aspirant',
      'Government & Public Sector',
    ],
    fees: FEES_BCOM_BA,
    documents: COMMON_DOCUMENTS,
  },
  {
    slug: 'bba',
    name: 'Bachelor of Business Administration (BBA)',
    shortName: 'BBA',
    level: LEVEL,
    duration: DURATION,
    affiliation: AFFILIATION,
    image: placeholder('course-bba'),
    summary:
      'A management degree building leadership, marketing and entrepreneurial skills for the modern business world.',
    eligibility: 'Passed HS (10+2) in any stream under AHSEC or an equivalent board.',
    highlights: [
      'Management, Marketing & HR fundamentals',
      'Entrepreneurship & leadership training',
      'Case-study and project-based learning',
      'Pathway to MBA',
    ],
    careers: [
      'Business / Operations Manager',
      'Marketing & Sales Executive',
      'Human Resource Associate',
      'Entrepreneur / Startup Founder',
      'MBA aspirant',
    ],
    fees: FEES_BCA_BBA,
    documents: COMMON_DOCUMENTS,
  },
  {
    slug: 'bca',
    name: 'Bachelor of Computer Applications (BCA)',
    shortName: 'BCA',
    level: LEVEL,
    duration: DURATION,
    affiliation: AFFILIATION,
    image: placeholder('course-bca'),
    summary:
      'A computer-application degree covering programming, databases and web technologies for a career in IT and software.',
    eligibility:
      'Passed HS (10+2); Mathematics / Computer Science preferred. CSE / IT Diploma holders are also eligible.',
    highlights: [
      'Programming & Software Development',
      'Databases, Networking & Web technologies',
      'Hands-on computer-lab practicals',
      'Pathway to MCA / IT careers',
    ],
    careers: [
      'Software Developer',
      'Web / App Developer',
      'System / Database Administrator',
      'IT Support Specialist',
      'MCA aspirant',
    ],
    fees: FEES_BCA_BBA,
    documents: COMMON_DOCUMENTS,
  },
  {
    slug: 'b-a',
    name: 'Bachelor of Arts (B.A.)',
    shortName: 'B.A.',
    level: LEVEL,
    duration: DURATION,
    affiliation: AFFILIATION,
    image: placeholder('course-ba'),
    summary:
      'A flexible humanities degree across languages, social sciences and education — strong grounding for teaching, civil services and research.',
    eligibility:
      'Passed HS (10+2) in any stream. Honours requires a minimum of 45% marks.',
    highlights: [
      'Wide choice of Arts subjects',
      'Honours specialisation available',
      'Foundation for B.Ed / Civil Services',
      'Language & social-science depth',
    ],
    careers: [
      'Teacher / Educator',
      'Civil Services aspirant',
      'Content & Media professional',
      'Social / NGO sector',
      'Postgraduate & research studies',
    ],
    fees: FEES_BCOM_BA,
    documents: COMMON_DOCUMENTS,
  },
];

/**
 * Look up a single course by slug.
 * @param {string} slug
 * @returns {Course|undefined}
 */
export function getCourseBySlug(slug) {
  return coursesData.find((c) => c.slug === slug);
}

export default coursesData;
