/* ============================================
   leadershipData.js — "From the Desk of …"
   Icon Commerce College
   --------------------------------------------
   Pure data module. The 7 desk-holders from design-system §6.
   Full message copy is finalised in prompt 37; short TODO stubs now.
   ============================================ */

import { placeholder } from '../utils/assets';

/**
 * @typedef {Object} Leader
 * @property {string} name
 * @property {string} role
 * @property {string} [qualifications]
 * @property {string} image       Placeholder URL
 * @property {string} message     Excerpt (TODO stub until prompt 37)
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
      'TODO: President\'s message excerpt from the prospectus (finalised in prompt 37).',
  },
  {
    name: 'Dr. Mandira Saha',
    role: 'Principal',
    qualifications: 'M.Com., M.Phil., Ph.D.',
    image: placeholder('principal-dr-mandira-saha'),
    featured: true,
    message:
      'TODO: Principal\'s message excerpt from the prospectus (finalised in prompt 37).',
  },
  {
    name: 'Sri Debasish Bora',
    role: 'Advisor',
    qualifications: '',
    image: placeholder('advisor-debasish-bora'),
    message:
      'TODO: Advisor\'s message excerpt from the prospectus (finalised in prompt 37).',
  },
  {
    name: 'Sri Sawpon Dowerah',
    role: 'Rector',
    qualifications: '',
    image: placeholder('rector-sawpon-dowerah'),
    message:
      'TODO: Rector\'s message excerpt from the prospectus (finalised in prompt 37).',
  },
  {
    name: 'Rajib Kumar Das',
    role: 'Director (Academic)',
    qualifications: '',
    image: placeholder('director-academic-rajib-das'),
    message:
      'TODO: Director (Academic) message excerpt from the prospectus (finalised in prompt 37).',
  },
  {
    name: 'Smt. Dipanju Bora',
    role: 'Director',
    qualifications: '',
    image: placeholder('director-dipanju-bora'),
    message:
      'TODO: Director\'s message excerpt from the prospectus (finalised in prompt 37).',
  },
  {
    name: 'Dr. Nilanjan Bhattacharjee',
    role: 'Academic Advisor',
    qualifications: 'M.Com., M.B.A., Ph.D.',
    image: placeholder('academic-advisor-nilanjan-bhattacharjee'),
    message:
      'TODO: Academic Advisor\'s message excerpt from the prospectus (finalised in prompt 37).',
  },
];

export default leadershipData;
