/* ============================================
   facultyData.js — Teaching staff (full roster)
   Icon Commerce College
   --------------------------------------------
   Pure data module powering the /faculty directory (prompt 20), populated in
   Prompt 37 from the official prospectus and the current college website's
   "Teaching Staff Members" list.

   Accuracy rules (design-system §6, prompt 20/37 acceptance criteria):
   • Names & qualifications are transcribed verbatim from the prospectus /
     current site — never fabricated. Where the source lists no qualifications,
     `qualifications` is left empty ('') and the card omits the line.
   • `featured: true` marks the people the page pulls into the "Leadership &
     Coordinators" highlight strip (Principal, Academic Advisor and the three
     programme coordinators). They also remain in the searchable directory so a
     search for any of them still resolves.
   • `department` drives the directory filter. The source faculty list does not
     state a department per member, so it is an *inferred* grouping based on each
     member's subject/qualification (Commerce · Arts · Science · Computer
     Application) — a navigational aid for the UI, flagged here for the client to
     confirm/refine. It does not assert an official departmental posting.
   • `bio` is optional and intentionally absent (the source carries no per-member
     bios); the card renders an expand toggle only when a bio is present.
   • All photos are labelled placeholders (design-system §7).
   ============================================ */

import { placeholder } from '../utils/assets';

const FACULTY_IMG = placeholder('faculty-placeholder');

/**
 * @typedef {Object} FacultyMember
 * @property {string} name
 * @property {string} designation
 * @property {string} [qualifications]  Source-transcribed only ('' when unknown).
 * @property {string} department        Drives the /faculty department filter (inferred grouping).
 * @property {string} image             Placeholder URL.
 * @property {boolean} [featured]       Pulled into the Leadership/Coordinators highlight.
 * @property {string} [bio]             Short bio (none in the source today).
 */

/** @type {FacultyMember[]} */
export const facultyData = [
  // ---- Leadership & programme coordinators (highlight strip) ----
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
    designation: 'Assistant Professor · Coordinator — B.Com / BBA',
    qualifications: 'M.Com., M.Phil., B.Ed., SLET, Ph.D.',
    department: 'Commerce',
    image: FACULTY_IMG,
    featured: true,
  },
  {
    name: 'Pallabi Dutta',
    designation: 'Assistant Professor · Coordinator — B.C.A.',
    qualifications: 'M.A.',
    department: 'Computer Application',
    image: FACULTY_IMG,
    featured: true,
  },
  {
    name: 'Santashri Barman',
    designation: 'Assistant Professor · Coordinator — B.A.',
    qualifications: 'M.A., SLET',
    department: 'Arts',
    image: FACULTY_IMG,
    featured: true,
  },

  // ---- Teaching staff ----
  {
    name: 'Tridib Kr. Handique',
    designation: 'Assistant Professor · Examination In-Charge',
    qualifications: 'M.C.A.',
    department: 'Computer Application',
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
    name: 'Rikia Chakraborty',
    designation: 'Assistant Professor',
    qualifications: 'M.Com., PGDBM',
    department: 'Commerce',
    image: FACULTY_IMG,
  },
  {
    name: 'Kongkona Bhagawati',
    designation: 'Assistant Professor',
    qualifications: 'M.Com., M.B.A.',
    department: 'Commerce',
    image: FACULTY_IMG,
  },
  {
    name: 'Manas Kumar Chakraborty',
    designation: 'Assistant Professor',
    qualifications: 'M.C.A.',
    department: 'Computer Application',
    image: FACULTY_IMG,
  },
  {
    name: 'Saurav Bhattacharjee',
    designation: 'Assistant Professor',
    qualifications: 'M.Sc. (Environmental Science), Tezpur University',
    department: 'Science',
    image: FACULTY_IMG,
  },
  {
    name: 'Loveleena Bora',
    designation: 'Assistant Professor',
    qualifications: 'M.A., B.Ed., NET',
    department: 'Arts',
    image: FACULTY_IMG,
  },
  {
    name: 'Dr. Antara Gayan',
    designation: 'Assistant Professor',
    qualifications: 'M.A., Ph.D.',
    department: 'Arts',
    image: FACULTY_IMG,
  },
  {
    name: 'Badamon Shisha Shadap',
    designation: 'Assistant Professor',
    qualifications: 'M.A., DCA',
    department: 'Arts',
    image: FACULTY_IMG,
  },
  {
    name: 'Mridusmita Deka',
    designation: 'Assistant Professor',
    qualifications: 'M.Sc. (Economics)',
    department: 'Arts',
    image: FACULTY_IMG,
  },
  {
    name: 'Nivedita Bayan Baishya',
    designation: 'Assistant Professor',
    qualifications: 'M.A., M.Phil., B.Ed.',
    department: 'Arts',
    image: FACULTY_IMG,
  },
  {
    name: 'Sumit Kr. Routh',
    designation: 'Assistant Professor',
    qualifications: 'M.Com., NET',
    department: 'Commerce',
    image: FACULTY_IMG,
  },
  {
    name: 'Dipannita Chakraborty',
    designation: 'Assistant Professor',
    qualifications: 'M.A., B.Ed., LL.B.',
    department: 'Arts',
    image: FACULTY_IMG,
  },
  {
    name: 'Kankana Sharma',
    designation: 'Assistant Professor',
    qualifications: 'M.Com., B.Ed.',
    department: 'Commerce',
    image: FACULTY_IMG,
  },
  {
    name: 'Ruma Das',
    designation: 'Assistant Professor',
    qualifications: 'M.A., B.Ed., NET, DCA',
    department: 'Arts',
    image: FACULTY_IMG,
  },
  {
    name: 'Sagarika Paul',
    designation: 'Assistant Professor',
    qualifications: 'M.B.A., NET',
    department: 'Commerce',
    image: FACULTY_IMG,
  },
  {
    name: 'Urbimala Hazarika',
    designation: 'Assistant Professor',
    qualifications: 'M.Sc. (Computer Science)',
    department: 'Computer Application',
    image: FACULTY_IMG,
  },
  {
    name: 'Manisha Das',
    designation: 'Assistant Professor',
    qualifications: 'M.C.A., D.El.Ed.',
    department: 'Computer Application',
    image: FACULTY_IMG,
  },
  {
    name: 'Spondita Goswami',
    designation: 'Assistant Professor',
    qualifications: 'M.A., PDCA',
    department: 'Arts',
    image: FACULTY_IMG,
  },
  {
    name: 'Namrata Sharma',
    designation: 'Assistant Professor',
    qualifications: 'M.A., SLET',
    department: 'Arts',
    image: FACULTY_IMG,
  },
  {
    name: 'Rimon Borah',
    designation: 'Assistant Professor',
    qualifications: 'M.A., SLET',
    department: 'Arts',
    image: FACULTY_IMG,
  },
  {
    name: 'Sadhna Kashyap',
    designation: 'Assistant Professor',
    qualifications: 'M.A., NET',
    department: 'Arts',
    image: FACULTY_IMG,
  },
  {
    name: 'Chayanika Das',
    designation: 'Assistant Professor',
    qualifications: 'M.A., NET, SLET',
    department: 'Arts',
    image: FACULTY_IMG,
  },
  {
    name: 'Rinkumani Baishya',
    designation: 'Assistant Professor',
    qualifications: 'M.A., M.Phil., SLET',
    department: 'Arts',
    image: FACULTY_IMG,
  },
  {
    // Listed in the printed prospectus faculty roster; not on the latest website
    // staff table. Retained from the prospectus — TODO (client): confirm she is
    // still current teaching staff.
    name: 'Dr. Urmimala Mahanta',
    designation: 'Assistant Professor',
    qualifications: 'M.Com., Ph.D.',
    department: 'Commerce',
    image: FACULTY_IMG,
  },
];

/**
 * Guest Faculty (design-system §6 / prospectus). They render in their own
 * section, not the filterable directory grid.
 * @type {FacultyMember[]}
 */
export const guestFaculty = [
  {
    name: 'Biswajit Bhattacharya',
    designation:
      'Guest Faculty · Retd. Associate Professor & Former H.O.D. (Accountancy), Gauhati Commerce College',
    qualifications: '', // Not stated in the prospectus.
    department: 'Commerce',
    image: FACULTY_IMG,
  },
  {
    name: 'Dr. Nripendra Nath Medhi',
    designation: 'Guest Faculty · Retd. Assistant Professor (Dept. of Finance)',
    qualifications: 'M.Com., LL.B., Ph.D.',
    department: 'Commerce',
    image: FACULTY_IMG,
  },
];

export default facultyData;
