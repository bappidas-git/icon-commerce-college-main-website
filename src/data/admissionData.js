/* ============================================
   admissionData.js — Admission process, eligibility, prospectus
   Icon Commerce College
   --------------------------------------------
   Pure data module. Steps, notes, documents, scholarships and the
   admission FAQ come from design-system §6. Per-program eligibility and
   fee figures live in `coursesData` (single source of truth) and are read
   straight from there by the Admissions page.
   ============================================ */

import { placeholder } from '../utils/assets';
import { collegeInfo } from './collegeInfo';

/**
 * @typedef {Object} AdmissionStep
 * @property {number} number
 * @property {string} title
 * @property {string} description
 * @property {string} icon       Iconify icon name
 */

/** @type {AdmissionStep[]} */
export const admissionSteps = [
  {
    number: 1,
    title: 'Register on the Samarth Portal',
    description: `Create an account on the Samarth admission portal (${collegeInfo.samarthUrl}) using College Code ${collegeInfo.samarthCode}.`,
    icon: 'mdi:account-plus',
  },
  {
    number: 2,
    title: 'Select College & Stream',
    description:
      'Choose ICON COMMERCE COLLEGE as your preferred college and select your stream — B.Com / BA / BBA / BCA.',
    icon: 'mdi:school',
  },
  {
    number: 3,
    title: 'Document Verification & Admission',
    description:
      'After document verification, complete your admission at the college or online.',
    icon: 'mdi:file-check',
  },
  {
    number: 4,
    title: 'Confirmation SMS',
    description:
      'Approved candidates receive a confirmation SMS on their registered mobile number.',
    icon: 'mdi:message-check',
  },
];

/**
 * Documents carried for verification at the time of admission (design-system
 * §6). Bring the originals along with a set of self-attested photocopies.
 * @type {string[]}
 */
export const documentsRequired = [
  'HS (10+2) marksheet & pass certificate',
  'Registration / Migration Certificate',
  'Gap Certificate (affidavit), if applicable',
  'Recent passport-size photographs',
];

/**
 * Admission FAQ (rendered in an Accordion + emitted as FAQPage JSON-LD).
 * Answers are grounded in design-system §6; exact dates and hostel details
 * are client TODOs, so those answers stay honest and point to the office /
 * Notices instead of inventing specifics.
 * @type {{question: string, answer: string}[]}
 */
export const admissionFaqs = [
  {
    question: 'Who is eligible to apply for admission?',
    answer:
      'All four UG programmes are open to candidates who have passed HS (10+2) under AHSEC or an equivalent board. B.Com, BBA and B.A. accept any stream; BCA prefers Mathematics or Computer Science (CSE / IT Diploma holders are also eligible). B.A. Honours requires a minimum of 45% marks.',
  },
  {
    question: 'How do I apply for admission?',
    answer:
      'Register on the Samarth portal (assamadmission.samarth.ac.in) using College Code 842, select ICON COMMERCE COLLEGE and your preferred stream, and submit the form. After document verification you can complete admission at the college or online, and approved candidates receive a confirmation SMS.',
  },
  {
    question: 'What are the fees for the programmes?',
    answer:
      'First-semester total fees are ₹10,900 for B.Com and B.A. and ₹11,000 for BCA and BBA, with monthly tuition of ₹1,800–₹2,000 and a one-time ₹300 application fee. Gauhati University registration, enrolment and examination fees are charged extra and are subject to change. All fees are non-refundable.',
  },
  {
    // TODO (client): confirm the exact 2026-27 admission opening / closing dates.
    question: 'When does admission for the 2026–27 session open?',
    answer:
      'Admission for the 2026–27 session follows the Gauhati University / Samarth admission schedule. Exact opening and closing dates are published on our Notices page and the Samarth portal — please check there or contact the admission office for the current dates.',
  },
  {
    // TODO (client): confirm hostel / accommodation availability.
    question: 'Does the college provide hostel accommodation?',
    answer:
      'For accommodation guidance, please contact the admission office — our team can help outstation students with nearby hostel and PG options in the Chandmari area.',
  },
  {
    question: 'Who do I contact for admission help?',
    answer: `Call our admission team on ${collegeInfo.phones[0]} or ${collegeInfo.phones[1]}, email ${collegeInfo.email}, or visit us at ${collegeInfo.address.full}. You can also use the “Apply / Enquire” button on this page and we’ll call you back.`,
  },
];

/**
 * @typedef {Object} AdmissionData
 * @property {AdmissionStep[]} steps
 * @property {string[]} documents
 * @property {string} eligibilityNote
 * @property {string} feesNote
 * @property {string} scholarshipNote
 * @property {{question:string, answer:string}[]} faqs
 * @property {{title:string, description:string, cover:string, file:string}} prospectus
 * @property {string} samarthCode
 * @property {string} samarthUrl
 */

/** @type {AdmissionData} */
export const admissionData = {
  steps: admissionSteps,
  documents: documentsRequired,
  faqs: admissionFaqs,
  samarthCode: collegeInfo.samarthCode,
  samarthUrl: collegeInfo.samarthUrl,
  eligibilityNote:
    'Open to candidates who have passed HS (10+2) from AHSEC or an equivalent board. Stream eligibility varies by program — B.A. Honours requires a minimum of 45% marks; BCA prefers Mathematics / Computer Science.',
  feesNote:
    'First-semester fees range from ₹10,900 (B.Com / B.A.) to ₹11,000 (BCA / BBA), plus a ₹300 application fee. GU registration / enrolment / examination fees are extra and subject to change. All fees are non-refundable.',
  scholarshipNote:
    'Students may be eligible for various Government-approved scholarship schemes, which the college helps facilitate. For details and assistance with applications, please contact the college’s Scholarship Nodal Officer through the admission office.',
  prospectus: {
    title: 'College Prospectus 2026-27',
    description:
      'Download the official prospectus for complete details on programs, fees, faculty and campus life.',
    cover: placeholder('prospectus-cover'),
    // Lead-gated download target (prompt 23). A placeholder PDF ships at this
    // path — TODO (client): replace public/prospectus/icon-commerce-college-prospectus.pdf
    // with the official prospectus.
    file: '/prospectus/icon-commerce-college-prospectus.pdf',
  },
};

export default admissionData;
