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

/**
 * Placeholder for the official Gauhati University FYUGP syllabus link. Each
 * course points here until the client supplies the real per-programme URL —
 * the detail page renders a disabled "syllabus coming soon" state for TODOs
 * rather than a clumsy embedded Drive viewer (prompt 18).
 */
const SYLLABUS_TODO =
  'TODO: Gauhati University FYUGP syllabus PDF URL (client to provide per programme)';

/**
 * Shared NEP-2020 / FYUGP curriculum structure (Gauhati University). This is the
 * generic, framework-level structure common to every programme — the detailed,
 * subject-wise major/minor papers follow the GU syllabus (linked per course).
 * Kept here (not in the page) so it stays a single, swappable source of truth.
 */
export const fyugpCurriculum = {
  summary:
    'Under the NEP-2020 Four-Year Undergraduate Programme (FYUGP) of Gauhati University, the course is credit-based with a multiple-entry / multiple-exit design — roughly 120 credits across 6 semesters for the 3-year Degree, or 160 credits across 8 semesters for the 4-year Honours.',
  // Course categories that make up every FYUGP semester load.
  components: [
    {
      icon: 'mdi:book-open-page-variant-outline',
      title: 'Major (Core) courses',
      text: 'In-depth, discipline-specific papers that form the backbone of the degree.',
    },
    {
      icon: 'mdi:book-plus-outline',
      title: 'Minor courses',
      text: 'A secondary discipline that broadens your academic profile.',
    },
    {
      icon: 'mdi:shape-outline',
      title: 'Multidisciplinary (MDC)',
      text: 'Courses beyond your main stream for a well-rounded foundation.',
    },
    {
      icon: 'mdi:translate',
      title: 'Ability Enhancement (AEC)',
      text: 'Language & communication courses — English and a Modern Indian Language.',
    },
    {
      icon: 'mdi:tools',
      title: 'Skill Enhancement (SEC)',
      text: 'Practical, employability-focused skill modules.',
    },
    {
      icon: 'mdi:leaf',
      title: 'Value-Added (VAC)',
      text: 'Environment, ethics and understanding-India type courses.',
    },
    {
      icon: 'mdi:briefcase-check-outline',
      title: 'Internship / Project',
      text: 'Hands-on internship, field work or a project component.',
    },
    {
      icon: 'mdi:flask-outline',
      title: 'Research (4th year)',
      text: 'A dedicated research component in the Honours-with-Research pathway.',
    },
  ],
  // Multiple-entry / multiple-exit awards (NEP 2020).
  exits: [
    { after: '1 Year (2 sem)', award: 'UG Certificate' },
    { after: '2 Years (4 sem)', award: 'UG Diploma' },
    { after: '3 Years (6 sem)', award: "Bachelor's Degree" },
    { after: '4 Years (8 sem)', award: "Bachelor's (Honours / with Research)" },
  ],
};

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
 * @property {string} eligibilityShort  Compact eligibility for the comparison table
 * @property {string[]} highlights
 * @property {string[]} careers
 * @property {{rows:{particular:string,amount:string}[], total:string,
 *            tuitionMonthly:string, application:string, note:string}} fees
 * @property {string[]} documents
 * @property {string} syllabusUrl    Detailed GU syllabus link (TODO until supplied)
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
    eligibilityShort: 'HS (10+2) — any stream',
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
    syllabusUrl: SYLLABUS_TODO,
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
    eligibilityShort: 'HS (10+2) — any stream',
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
    syllabusUrl: SYLLABUS_TODO,
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
    eligibilityShort: 'HS (10+2) — Maths / CS preferred',
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
    syllabusUrl: SYLLABUS_TODO,
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
    eligibilityShort: 'HS (10+2) — any stream (Hons. ≥ 45%)',
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
    syllabusUrl: SYLLABUS_TODO,
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
