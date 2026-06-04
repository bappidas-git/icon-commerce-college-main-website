/* ============================================
   leadershipData.js — "From the Desk of …"
   Icon Commerce College
   --------------------------------------------
   Pure data module. The 7 desk-holders from design-system §6, in the
   canonical order (President → Advisor → Principal → Rector →
   Director (Academic) → Director → Academic Advisor).

   The `message` fields below are short, dignified *interim* excerpts so the
   Leadership page reads professionally today. Prompt 37 replaces every one of
   them with the verbatim copy transcribed from the official prospectus.
   TODO (prompt 37): swap each `message` for the full prospectus text.
   Photos are labelled placeholders (design-system §7).
   ============================================ */

import { placeholder } from '../utils/assets';

/**
 * @typedef {Object} Leader
 * @property {string} name
 * @property {string} role
 * @property {string} [qualifications]
 * @property {string} image       Placeholder URL
 * @property {string} message     Interim excerpt (TODO: full copy in prompt 37)
 * @property {boolean} [featured]  President / Principal highlighted
 */

/** @type {Leader[]} */
export const leadershipData = [
  {
    name: 'Smt. Dipali Bora',
    role: 'President, Governing Body',
    qualifications: '',
    image: placeholder('president-dipali-bora'),
    featured: true,
    message:
      'It gives me immense pride to welcome you to Icon Commerce College. Since 2004, under the Icon Academy Trust, we have worked to nurture knowledge, character and confidence in every student who joins our family. I invite you to become part of a community where learning and values grow hand in hand.',
  },
  {
    name: 'Sri Debasish Bora',
    role: 'Advisor',
    qualifications: '',
    image: placeholder('advisor-debasish-bora'),
    message:
      'A good college prepares students not only for examinations but for life. At Icon Commerce College we combine academic rigour with discipline, empathy and a clear sense of purpose, so that our graduates step into the world ready to lead and to serve.',
  },
  {
    name: 'Dr. Mandira Saha',
    role: 'Principal',
    qualifications: 'M.Com., M.Phil., Ph.D.',
    image: placeholder('principal-dr-mandira-saha'),
    featured: true,
    message:
      'Our endeavour is to deliver quality, value-based higher education that prepares students for a changing world. Affiliated to Gauhati University under the NEP 2020 framework, we bring together a supportive campus, experienced faculty and modern facilities to help each learner realise their full potential.',
  },
  {
    name: 'Sri Sawpon Dowerah',
    role: 'Rector',
    qualifications: '',
    image: placeholder('rector-sawpon-dowerah'),
    message:
      'Campus life at Icon Commerce College is built on order, care and mutual respect. We are committed to providing a safe, disciplined and encouraging environment in which students can focus wholeheartedly on their studies, their growth and their well-being.',
  },
  {
    name: 'Rajib Kumar Das',
    role: 'Director (Academic)',
    qualifications: '',
    image: placeholder('director-academic-rajib-das'),
    message:
      'Academic excellence is the foundation of everything we do. Through a well-structured, NEP-aligned curriculum, continuous mentoring and regular seminars and workshops, we keep learning at Icon Commerce College relevant, rigorous and rewarding.',
  },
  {
    name: 'Smt. Dipanju Bora',
    role: 'Director',
    qualifications: '',
    image: placeholder('director-dipanju-bora'),
    message:
      'Behind every successful student is an institution that plans, supports and listens. As we continue to grow, our focus remains on strengthening facilities, widening opportunities and keeping the interests of our students at the heart of every decision.',
  },
  {
    name: 'Dr. Nilanjan Bhattacharjee',
    role: 'Academic Advisor',
    qualifications: 'M.Com., M.B.A., Ph.D.',
    image: placeholder('academic-advisor-nilanjan-bhattacharjee'),
    message:
      'Under the NEP 2020 framework we guide students towards a flexible, future-ready and outcome-based education. Our aim is to help every learner build strong fundamentals, explore their interests and graduate as confident, industry-ready professionals.',
  },
];

export default leadershipData;
