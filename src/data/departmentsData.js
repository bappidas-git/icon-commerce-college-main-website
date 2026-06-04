/* ============================================
   departmentsData.js — Departments grouped by stream
   Icon Commerce College
   --------------------------------------------
   Pure data module. Three subject lists from design-system §6, enriched
   for the consolidated /departments page (prompt 19): each subject carries
   an icon, a one-line blurb, a short description (shown in the card's
   accordion) and the related UG programme slug(s) it feeds into.

   `related` references coursesData slugs (b-com | bba | bca | b-a). A few
   science-stream subjects have no matching degree at the college and so
   carry an empty `related` — the card simply omits the related-programme
   chip rather than inventing a link.
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

/**
 * Build a Subject record.
 * @param {string}   name        Department name.
 * @param {string}   icon        Iconify (mdi) icon name.
 * @param {string}   blurb       One-line summary (always visible on the card).
 * @param {string}   description Short paragraph revealed in the card accordion.
 * @param {string[]} [related]   Related programme slugs (coursesData).
 * @returns {Subject}
 */
const subj = (name, icon, blurb, description, related = []) => ({
  name,
  slug: slug(name),
  icon,
  blurb,
  description,
  related,
});

/**
 * @typedef {Object} Subject
 * @property {string} name
 * @property {string} slug
 * @property {string} icon
 * @property {string} blurb
 * @property {string} description
 * @property {string[]} related
 *
 * @typedef {Object} Stream
 * @property {'arts'|'commerce'|'science'} key
 * @property {string} label
 * @property {string} icon
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
      icon: 'mdi:palette-outline',
      blurb:
        'Languages, social sciences and humanities that build critical thinking, communication and a strong foundation for teaching and the civil services.',
      image: placeholder('dept-arts'),
      subjects: [
        subj(
          'Assamese',
          'mdi:script-text-outline',
          'The language, literature and culture of Assam.',
          'Study Assamese language, literature and culture — strengthening communication skills and opening pathways into teaching, media and the creative arts.',
          ['b-a']
        ),
        subj(
          'Economics',
          'mdi:chart-line',
          'Micro, macro and the principles of a modern economy.',
          'Understand how economies work — from everyday choices to national policy — with the analytical grounding valued in banking, research and the civil services.',
          ['b-a']
        ),
        subj(
          'Education',
          'mdi:human-male-board',
          'The theory and practice of teaching and learning.',
          'Explore the philosophy, psychology and methods of education — an ideal foundation for a teaching career and a natural stepping stone to B.Ed.',
          ['b-a']
        ),
        subj(
          'English',
          'mdi:book-open-page-variant-outline',
          'Language, literature and communication skills.',
          'Read widely across English literature while sharpening the writing and communication skills prized in teaching, media, content and the corporate world.',
          ['b-a']
        ),
        subj(
          'Philosophy',
          'mdi:thought-bubble-outline',
          'Logic, ethics and the big questions.',
          'Examine logic, ethics and the enduring questions of life — developing the reasoning and clarity of thought that underpin law, the civil services and research.',
          ['b-a']
        ),
        subj(
          'History',
          'mdi:bank-outline',
          'The people, events and ideas that shaped our world.',
          'Trace the movements and turning points that shaped society — cultivating the research, analysis and writing skills suited to teaching, heritage and the civil services.',
          ['b-a']
        ),
        subj(
          'Political Science',
          'mdi:vote-outline',
          'Government, governance and political thought.',
          'Study political systems, governance and international relations — a strong base for the civil services, law, journalism and public policy.',
          ['b-a']
        ),
      ],
    },
    {
      key: 'commerce',
      label: 'Commerce',
      icon: 'mdi:finance',
      blurb:
        'Accountancy, finance and management disciplines that prepare graduates for business, banking and professional accounting careers.',
      image: placeholder('dept-commerce'),
      subjects: [
        subj(
          'Accountancy',
          'mdi:calculator-variant-outline',
          'Recording, reporting and auditing of finances.',
          'Master financial and cost accounting, taxation and auditing — the core of the B.Com degree and the foundation for CA, CS and CMA pathways.',
          ['b-com']
        ),
        subj(
          'Finance',
          'mdi:cash-multiple',
          'Money, markets and financial management.',
          'Learn how individuals, businesses and markets manage money and investment — opening doors in banking, financial services and corporate finance.',
          ['b-com']
        ),
        subj(
          'Management',
          'mdi:account-tie-outline',
          'Planning, organising and leading organisations.',
          'Build the planning, organising and leadership skills behind every successful organisation — central to both the B.Com and BBA programmes.',
          ['bba', 'b-com']
        ),
        subj(
          'Business Administration',
          'mdi:briefcase-outline',
          'Running and growing a modern business.',
          'Develop an all-round understanding of marketing, human resources, operations and entrepreneurship — the heart of the BBA programme.',
          ['bba']
        ),
        subj(
          'Economics',
          'mdi:chart-areaspline',
          'The economics behind business and policy.',
          'Apply economic principles to business and policy decisions — a quantitative, analytical complement to the commerce and management curriculum.',
          ['b-com']
        ),
        subj(
          'English',
          'mdi:forum-outline',
          'Business communication and language skills.',
          'Strengthen the reading, writing and presentation skills that power business communication, interviews and the modern workplace.',
          ['b-com']
        ),
        subj(
          'Environmental Science',
          'mdi:leaf',
          'Sustainability and environmental awareness.',
          'A value-added course building the environmental awareness and sustainability literacy that today’s graduates and employers increasingly expect.',
          ['b-com']
        ),
      ],
    },
    {
      key: 'science',
      label: 'Science',
      icon: 'mdi:flask-outline',
      blurb:
        'Computer application, mathematics and core sciences supporting the BCA program and analytical, technology-driven careers.',
      image: placeholder('dept-science'),
      subjects: [
        subj(
          'Computer Application',
          'mdi:laptop',
          'Programming, software and web technologies.',
          'Learn programming, databases, networking and web technologies in our computer lab — the engine of the BCA degree and a career in IT and software.',
          ['bca']
        ),
        subj(
          'Mathematics & Statistics',
          'mdi:sigma',
          'Logic, data and quantitative reasoning.',
          'Develop the mathematical and statistical reasoning behind computing, analytics and finance — a versatile, in-demand analytical skillset.',
          ['bca']
        ),
        subj(
          'Botany',
          'mdi:sprout-outline',
          'The science of plant life.',
          'Study plant biology, ecology and the life sciences — strengthening the scientific temper and laboratory skills of the science stream.',
          []
        ),
        subj(
          'Chemistry',
          'mdi:test-tube',
          'Matter, reactions and the science of materials.',
          'Explore the composition, properties and reactions of matter through theory and hands-on laboratory practice in the science stream.',
          []
        ),
      ],
    },
  ],
};

export default departmentsData;
