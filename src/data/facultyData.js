/* ============================================
   facultyData.js — Teaching staff (seed list)
   Icon Commerce College
   --------------------------------------------
   Pure data module. Seeded with the names in design-system §6; the
   full list is expanded in prompt 37. All photos are placeholders.
   ============================================ */

import { placeholder } from '../utils/assets';

const FACULTY_IMG = placeholder('faculty-placeholder');

/**
 * @typedef {Object} FacultyMember
 * @property {string} name
 * @property {string} designation
 * @property {string} [qualifications]
 * @property {string} department
 * @property {string} image       Placeholder URL
 */

/** @type {FacultyMember[]} */
export const facultyData = [
  {
    name: 'Dr. Mandira Saha',
    designation: 'Principal',
    qualifications: 'M.Com., M.Phil., Ph.D.',
    department: 'Commerce',
    image: FACULTY_IMG,
  },
  {
    name: 'Dr. Nilanjan Bhattacharjee',
    designation: 'Academic Advisor',
    qualifications: 'M.Com., M.B.A., Ph.D.',
    department: 'Commerce',
    image: FACULTY_IMG,
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
    name: 'Dr. Rubi Das',
    designation: 'Coordinator — B.Com / BBA',
    qualifications: 'TODO: qualifications (prospectus)',
    department: 'Commerce',
    image: FACULTY_IMG,
  },
  {
    name: 'Pallabi Dutta',
    designation: 'Coordinator — B.C.A.',
    qualifications: 'TODO: qualifications (prospectus)',
    department: 'Computer Application',
    image: FACULTY_IMG,
  },
  {
    name: 'Santashri Barman',
    designation: 'Coordinator — B.A.',
    qualifications: 'TODO: qualifications (prospectus)',
    department: 'Arts',
    image: FACULTY_IMG,
  },
  {
    name: 'Kongkona Bhagawati',
    designation: 'Assistant Professor',
    qualifications: 'M.Com, M.B.A.',
    department: 'Commerce',
    image: FACULTY_IMG,
  },
  // TODO: remaining faculty members expanded in prompt 37 (from prospectus).
];

export default facultyData;
