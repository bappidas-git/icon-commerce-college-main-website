/* ============================================
   departmentsData.js — Departments grouped by stream
   Icon Commerce College
   --------------------------------------------
   Pure data module. Three subject lists from design-system §6.
   ============================================ */

import { placeholder } from '../utils/assets';

/**
 * Slugify a subject name for routing / anchors.
 * @param {string} name
 * @returns {string}
 */
const slug = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const subj = (name, blurb) => ({ name, slug: slug(name), blurb });

/**
 * @typedef {Object} Subject
 * @property {string} name
 * @property {string} slug
 * @property {string} [blurb]
 *
 * @typedef {Object} Stream
 * @property {'arts'|'commerce'|'science'} key
 * @property {string} label
 * @property {string} blurb
 * @property {string} image
 * @property {Subject[]} subjects
 */

/** @type {{streams: Stream[]}} */
export const departmentsData = {
  streams: [
    {
      key: 'arts',
      label: 'Arts',
      blurb:
        'Languages, social sciences and humanities that build critical thinking, communication and a strong foundation for teaching and the civil services.',
      image: placeholder('dept-arts'),
      subjects: [
        subj('Assamese'),
        subj('Economics'),
        subj('Education'),
        subj('English'),
        subj('Philosophy'),
        subj('History'),
        subj('Political Science'),
      ],
    },
    {
      key: 'commerce',
      label: 'Commerce',
      blurb:
        'Accountancy, finance and management disciplines that prepare graduates for business, banking and professional accounting careers.',
      image: placeholder('dept-commerce'),
      subjects: [
        subj('Accountancy'),
        subj('Finance'),
        subj('Management'),
        subj('Business Administration'),
        subj('Economics'),
        subj('English'),
        subj('Environmental Science'),
      ],
    },
    {
      key: 'science',
      label: 'Science',
      blurb:
        'Computer application, mathematics and core sciences supporting the BCA program and analytical, technology-driven careers.',
      image: placeholder('dept-science'),
      subjects: [
        subj('Computer Application'),
        subj('Mathematics & Statistics'),
        subj('Botany'),
        subj('Chemistry'),
      ],
    },
  ],
};

export default departmentsData;
