/* ============================================
   collegeInfo.js — Single source of truth for college identity & contact
   Icon Commerce College, Guwahati
   --------------------------------------------
   Pure data module (no React imports). Values taken from
   design-system §1 & §6. Unknown values are marked `TODO: …`.
   ============================================ */

/**
 * @typedef {Object} CollegeInfo
 * @property {string} name           Official English name
 * @property {string} assameseName   Assamese lockup name (footer/logo)
 * @property {string} tagline        Primary tagline
 * @property {string} taglineSecondary
 * @property {number} established     Founding year
 * @property {string} trust          Parent trust / body
 * @property {string} affiliation    University affiliation
 * @property {string} affiliationNote NEP/FYUGP note
 * @property {string} samarthCode    Samarth college code
 * @property {string} samarthUrl     Admission portal URL
 * @property {{full:string, parts:Object}} address
 * @property {string[]} phones        Display phone numbers
 * @property {string} email
 * @property {string} mapsQuery       Google Maps search query
 * @property {{facebook:string, youtube:string, instagram:string}} social
 * @property {{days:string, time:string}} hours
 */

/** @type {CollegeInfo} */
export const collegeInfo = {
  name: 'Icon Commerce College',
  assameseName: 'আইকন কমাৰ্চ কলেজ',
  locationLabel: 'Guwahati, Assam',
  tagline: 'Where Knowledge Meets Character',
  taglineSecondary:
    'Empowering Commerce, Arts & Computer Application graduates since 2004.',
  established: 2004,
  trust: 'Icon Academy Trust',
  affiliation: 'Gauhati University',
  affiliationNote: 'NEP 2020 / FYUGP',
  samarthCode: '842',
  samarthUrl: 'https://assamadmission.samarth.ac.in/',

  address: {
    full:
      'Rajgarh Road, Near Byelane No-3, Chandmari, Guwahati, Assam – 781003, India',
    parts: {
      line1: 'Rajgarh Road, Near Byelane No-3',
      area: 'Chandmari',
      city: 'Guwahati',
      state: 'Assam',
      pincode: '781003',
      country: 'India',
    },
  },

  phones: ['+91 93653 75782', '+91 93653 83289'],
  email: 'iconcom.2004@gmail.com',

  mapsQuery: 'Icon Commerce College, Rajgarh Road, Guwahati',

  social: {
    facebook: 'TODO: official Facebook page URL',
    youtube: 'TODO: YouTube channel URL (College Profile — ICON Commerce College)',
    instagram: 'TODO: official Instagram URL',
  },

  hours: {
    days: 'Monday – Saturday',
    time: '9:30 AM – 4:30 PM',
  },
};

/**
 * Build a `tel:` href from a display phone number.
 * @param {string} [phone] defaults to the primary college number
 * @returns {string} e.g. 'tel:+919365375782'
 */
export function phoneHref(phone = collegeInfo.phones[0]) {
  return `tel:${String(phone).replace(/[^\d+]/g, '')}`;
}

/**
 * Build a `wa.me` WhatsApp href from a phone number (+ optional message).
 * @param {string} [phone] defaults to the primary college number
 * @param {string} [message] pre-filled message text
 * @returns {string} e.g. 'https://wa.me/919365375782?text=…'
 */
export function whatsappHref(phone = collegeInfo.phones[0], message = '') {
  const digits = String(phone).replace(/\D/g, '');
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${query}`;
}

/**
 * Build a `mailto:` href for the college email.
 * @param {string} [subject]
 * @returns {string}
 */
export function emailHref(subject = '') {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${collegeInfo.email}${query}`;
}

export default collegeInfo;
