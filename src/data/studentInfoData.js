/* ============================================
   studentInfoData.js — General instructions & information for students
   Icon Commerce College
   --------------------------------------------
   Pure data module. The college's general instructions for students,
   transcribed and lightly condensed from the prospectus ("General Instructions
   & Information for Students"). Rendered as an accordion on the Admissions page.
   Source-only — no fabricated rules, contacts or figures.
   ============================================ */

/**
 * @typedef {Object} StudentInfoNote
 * @property {string} label   Short label (e.g. "Uniform vendor").
 * @property {string} text    The note body (kept verbatim where it carries contact info).
 *
 * @typedef {Object} StudentInfoGroup
 * @property {string} title
 * @property {string} icon            Iconify icon name.
 * @property {string[]} points        Instruction bullet points.
 * @property {StudentInfoNote} [note] Optional highlighted note (e.g. uniform vendor).
 */

/** @type {StudentInfoGroup[]} */
export const studentInfo = [
  {
    title: 'Class Timings & Attendance',
    icon: 'mdi:clock-outline',
    points: [
      'Classes begin at 10:00 AM as per the class routine; late arrival for classes is not allowed.',
      'Regular attendance is compulsory — wilful absence from class is treated as a serious breach of college discipline.',
      'Holidays follow the Gauhati University holiday list; State Government holiday notifications are also observed on special occasions.',
    ],
  },
  {
    title: 'College Uniform',
    icon: 'mdi:tshirt-crew-outline',
    points: [
      'B.Com & B.A. (Boys): plain white shirt with the college crest on the pocket and light-brown formal trousers.',
      'B.Com & B.A. (Girls): light-brown salwar & dupatta with a white kameez bearing the college crest.',
      'BCA & BBA (Boys): cream shirt with the college crest on the pocket and light-brown formal trousers.',
      'BCA & BBA (Girls): light-brown salwar & dupatta with a cream kameez bearing the college crest.',
      'Winter: light-brown blazer / sweater for all students; other colours are not permitted.',
      'Footwear: black formal shoes for boys and simple, plain sandals for girls.',
      'Only Icon Commerce College exercise copies (available at the college library) may be used.',
    ],
    note: {
      label: 'Uniform vendor',
      text: 'Suman Dresses, Opposite Harisabha, Panbazar, Guwahati – 781001. Phone: 0361-2630292 / 98641 24419 / 98640 59229.',
    },
  },
  {
    title: 'Discipline & Conduct',
    icon: 'mdi:gavel',
    points: [
      'Students must abide by all college rules; violations are punishable and, in extreme cases, may lead to expulsion. Disciplinary decisions of the College Management Committee are final and binding.',
      'Maintain discipline and decorum on the premises; do not loiter in the corridors and verandahs while classes are in progress.',
      'Improper use of mobile phones within the college premises will be dealt with severely.',
      'Consumption of alcohol, smoking, and chewing of tobacco, betel nut or pan masala on the premises is strictly prohibited.',
      'Keep the campus clean — do not spit on, or write / stick anything on, the walls, desks and benches.',
      'Take care of college property; anyone causing damage will be penalised, which may include expulsion.',
    ],
  },
  {
    title: 'Anti-Ragging',
    icon: 'mdi:shield-alert-outline',
    points: [
      'Ragging in any form is strictly prohibited and is a punishable offence — it may lead to expulsion from the college and strict legal action.',
      'Any anti-social or anti-national activity, or any activity detrimental to the interests of the college, will lead to expulsion.',
    ],
  },
  {
    title: 'Parents & Guardians',
    icon: 'mdi:account-child-outline',
    points: [
      'Parents / guardians are requested to meet the college authorities periodically to discuss their ward’s progress.',
      'Periodic feedback from parents / guardians helps the college initiate timely action on academic and disciplinary matters.',
    ],
  },
  {
    title: 'Scholarships',
    icon: 'mdi:hand-coin-outline',
    points: [
      'Students can avail various Government-approved scholarship schemes through the college.',
      'For details, contact the Institute Nodal Officer for Scholarships through the admission office.',
    ],
  },
];

export default studentInfo;
