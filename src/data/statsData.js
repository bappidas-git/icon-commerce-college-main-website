/* ============================================
   statsData.js — Animated counter stats
   Icon Commerce College
   --------------------------------------------
   Pure data module. Stats from design-system §6. Soft / approximate
   numbers are flagged with `approximate: true` (verify with client).
   ============================================ */

/**
 * @typedef {Object} Stat
 * @property {number} [value]    Numeric value for the count-up counter
 * @property {string} [display]  Non-numeric display label (e.g. university name)
 * @property {string} [prefix]   Text before the value (e.g. 'Since ')
 * @property {string} [suffix]   Text after the value (e.g. '+')
 * @property {string} label      Caption under the counter
 * @property {boolean} [approximate] Soft number to verify with the client
 */

/** @type {Stat[]} */
export const statsData = [
  { value: 2004, prefix: 'Since ', suffix: '', label: 'Years of Excellence' },
  { value: 4, suffix: '', label: 'UG Programs' },
  { value: 18, suffix: '+', label: 'Departments', approximate: true },
  { value: 40, suffix: '+', label: 'Faculty Members', approximate: true },
  { display: 'Gauhati University', label: 'Affiliated To' },
  { display: '1000s', label: 'Alumni Worldwide', approximate: true },
];

export default statsData;
