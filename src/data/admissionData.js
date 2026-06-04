/* ============================================
   admissionData.js — Admission process, eligibility, prospectus
   Icon Commerce College
   --------------------------------------------
   Pure data module. Steps & notes from design-system §6.
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
 * @typedef {Object} AdmissionData
 * @property {AdmissionStep[]} steps
 * @property {string} eligibilityNote
 * @property {string} feesNote
 * @property {{title:string, description:string, cover:string, file:string}} prospectus
 * @property {string} samarthCode
 * @property {string} samarthUrl
 */

/** @type {AdmissionData} */
export const admissionData = {
  steps: admissionSteps,
  samarthCode: collegeInfo.samarthCode,
  samarthUrl: collegeInfo.samarthUrl,
  eligibilityNote:
    'Open to candidates who have passed HS (10+2) from AHSEC or an equivalent board. Stream eligibility varies by program — B.A. Honours requires a minimum of 45% marks; BCA prefers Mathematics / Computer Science.',
  feesNote:
    'First-semester fees range from ₹10,900 (B.Com / B.A.) to ₹11,000 (BCA / BBA), plus a ₹300 application fee. GU registration / enrolment / examination fees are extra and subject to change. All fees are non-refundable.',
  prospectus: {
    title: 'College Prospectus 2026-27',
    description:
      'Download the official prospectus for complete details on programs, fees, faculty and campus life.',
    cover: placeholder('prospectus-cover'),
    file: 'TODO: prospectus PDF URL (client to provide)',
  },
};

export default admissionData;
