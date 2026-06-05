/* ============================================
   facultyData.js — Teaching staff (seed list)
   Icon Commerce College
   --------------------------------------------
   Pure data module powering the /faculty directory (prompt 20). Seeded with
   the names in design-system §6; the full roster is expanded in prompt 37.

   Accuracy rules (design-system §6, prompt 20 acceptance criteria):
   • Only prospectus-sourced credentials — never fabricate qualifications.
     Where a member's qualifications are not yet transcribed, `qualifications`
     is left empty ('') and the card simply omits the line (a visible "TODO"
     string would otherwise leak into the UI).
   • `featured: true` marks the people the page pulls into the "Leadership &
     Coordinators" highlight strip (Principal, Academic Advisor and the three
     programme coordinators). They also stay in the searchable directory below
     so a search for any of them still resolves.
   • `bio` is optional and intentionally absent for now (prompt 37 supplies the
     copy); the card renders an expand toggle only when a bio is present.
   • All photos are labelled placeholders (design-system §7).
   ============================================ */

import { placeholder } from '../utils/assets';

const FACULTY_IMG = placeholder('faculty-placeholder');

/**
 * @typedef {Object} FacultyMember
 * @property {string} name
 * @property {string} designation
 * @property {string} [qualifications]  Prospectus-sourced only ('' when unknown).
 * @property {string} department        Drives the /faculty department filter.
 * @property {string} image             Placeholder URL.
 * @property {boolean} [featured]       Pulled into the Leadership/Coordinators highlight.
 * @property {string} [bio]             Short bio (TODO: prospectus copy in prompt 37).
 */

/** @type {FacultyMember[]} */
export const facultyData = [
  {
    name: 'Dr. Mandira Saha',
    designation: 'Principal',
    qualifications: 'M.Com., M.Phil., Ph.D.',
    department: 'Commerce',
    image: FACULTY_IMG,
    featured: true,
  },
  {
    name: 'Dr. Nilanjan Bhattacharjee',
    designation: 'Academic Advisor',
    qualifications: 'M.Com., M.B.A., Ph.D.',
    department: 'Commerce',
    image: FACULTY_IMG,
    featured: true,
  },
  {
    name: 'Dr. Rubi Das',
    designation: 'Coordinator — B.Com / BBA',
    qualifications: '', // TODO (prompt 37): qualifications from prospectus.
    department: 'Commerce',
    image: FACULTY_IMG,
    featured: true,
  },
  {
    name: 'Pallabi Dutta',
    designation: 'Coordinator — B.C.A.',
    qualifications: '', // TODO (prompt 37): qualifications from prospectus.
    department: 'Computer Application',
    image: FACULTY_IMG,
    featured: true,
  },
  {
    name: 'Santashri Barman',
    designation: 'Coordinator — B.A.',
    qualifications: '', // TODO (prompt 37): qualifications from prospectus.
    department: 'Arts',
    image: FACULTY_IMG,
    featured: true,
  },
  {
    name: 'Mandira Sharma',
    designation: 'Assistant Professor',
    qualifications: 'M.Sc. (Gold Medalist), M.Phil.',
    department: 'Science',
    image: FACULTY_IMG,
  },
  {
    name: 'Tridib Kr. Handique',
    designation: 'Assistant Professor & Exam In-Charge',
    qualifications: 'M.C.A.',
    department: 'Computer Application',
    image: FACULTY_IMG,
  },
  {
    name: 'Kongkona Bhagawati',
    designation: 'Assistant Professor',
    qualifications: 'M.Com., M.B.A.',
    department: 'Commerce',
    image: FACULTY_IMG,
  },
  // TODO (prompt 37): remaining faculty members expanded from the prospectus.
];

/**
 * Guest Faculty (design-system §6 / prompt 20). Names only are confirmed in the
 * prospectus, so departments and qualifications are intentionally omitted rather
 * than invented; they render in their own section, not the filterable grid.
 * @type {FacultyMember[]}
 */
export const guestFaculty = [
  {
    name: 'Biswajit Bhattacharya',
    designation: 'Guest Faculty',
    qualifications: '', // TODO (prompt 37): department & qualifications from prospectus.
    department: '',
    image: FACULTY_IMG,
  },
  {
    name: 'Dr. Nripendra Nath Medhi',
    designation: 'Guest Faculty',
    qualifications: '', // TODO (prompt 37): department & qualifications from prospectus.
    department: '',
    image: FACULTY_IMG,
  },
];

export default facultyData;
