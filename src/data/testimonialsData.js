/* ============================================
   testimonialsData.js — Alumni testimonials
   Icon Commerce College
   --------------------------------------------
   Pure data module. Strong alumni voices from design-system §6.
   5–6 quotes seeded now; full list finalised in prompt 37. Quote text
   is a TODO stub where the prospectus copy is not yet transcribed.
   ============================================ */

import { placeholder } from '../utils/assets';

const AVATAR = placeholder('testimonial-avatar');

/**
 * @typedef {Object} Testimonial
 * @property {string} name
 * @property {string} role     Role / current affiliation
 * @property {string} quote
 * @property {string} avatar   Placeholder URL
 */

/** @type {Testimonial[]} */
export const testimonialsData = [
  {
    name: 'Raghav Sarma',
    role: 'Advocate, Gauhati High Court',
    quote:
      'Icon Commerce College gave me the discipline and foundation that shaped my career in law. The faculty truly cared about our growth.',
    avatar: AVATAR,
  },
  {
    name: 'Devika Adhyapak',
    role: 'Administrative Assistant, IIT Guwahati',
    quote:
      'The supportive environment and practical learning at Icon prepared me well for a professional career at a premier institute.',
    avatar: AVATAR,
  },
  {
    name: 'Akash Paul',
    role: 'Assistant Professor, Biswanath College',
    quote:
      'My teachers at Icon inspired me to pursue academics. The strong fundamentals I built here still guide my teaching today.',
    avatar: AVATAR,
  },
  {
    name: 'Dishangka Jiten Pathak',
    role: 'Jr. Accounts Asst. Trainee, IOCL',
    quote:
      'The commerce program’s focus on accountancy and finance gave me a real head start in my career with IOCL.',
    avatar: AVATAR,
  },
  {
    name: 'Pritam Saha',
    role: 'Sr. Business Development Manager, SBI General',
    quote:
      'From classroom to corporate, the skills and confidence I gained at Icon have been invaluable in the financial services sector.',
    avatar: AVATAR,
  },
  {
    name: 'Ankita Kumari Agarwal',
    role: 'BBA Alumna',
    quote:
      'TODO: alumni quote excerpt from the prospectus (finalised in prompt 37).',
    avatar: AVATAR,
  },
];

export default testimonialsData;
