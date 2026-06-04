/* ============================================
   navigation.js — Header menu tree + footer link groups
   Icon Commerce College
   --------------------------------------------
   Pure data module. Matches the site map in design-system §5.
   ============================================ */

/**
 * @typedef {Object} NavItem
 * @property {string} label
 * @property {string} path
 * @property {NavItem[]} [children] dropdown items (Courses / About)
 */

/**
 * Primary header navigation tree.
 * `About` and `Courses` expose dropdown children.
 * @type {NavItem[]}
 */
export const mainNav = [
  { label: 'Home', path: '/' },
  {
    label: 'About',
    path: '/about',
    children: [
      { label: 'About College', path: '/about' },
      { label: 'Leadership', path: '/leadership' },
      { label: 'Faculty', path: '/faculty' },
      { label: 'Facilities', path: '/facilities' },
    ],
  },
  {
    label: 'Courses',
    path: '/courses',
    children: [
      { label: 'All Programs', path: '/courses' },
      { label: 'B.Com.', path: '/courses/b-com' },
      { label: 'BBA', path: '/courses/bba' },
      { label: 'BCA', path: '/courses/bca' },
      { label: 'B.A.', path: '/courses/b-a' },
    ],
  },
  { label: 'Departments', path: '/departments' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Notices', path: '/notices' },
  { label: 'Events', path: '/events' },
  { label: 'Contact', path: '/contact' },
];

/**
 * Primary call-to-action shown in the header (Warm-Red CTA, §2).
 * @type {NavItem}
 */
export const navCta = { label: 'Apply Now', path: '/admissions' };

/**
 * @typedef {Object} FooterGroup
 * @property {string} title
 * @property {{label:string, path:string}[]} links
 */

/**
 * Footer link groups.
 * @type {FooterGroup[]}
 */
export const footerNav = [
  {
    title: 'Explore',
    links: [
      { label: 'About', path: '/about' },
      { label: 'Leadership', path: '/leadership' },
      { label: 'Faculty', path: '/faculty' },
      { label: 'Facilities', path: '/facilities' },
      { label: 'Gallery', path: '/gallery' },
    ],
  },
  {
    title: 'Programs',
    links: [
      { label: 'B.Com.', path: '/courses/b-com' },
      { label: 'BBA', path: '/courses/bba' },
      { label: 'BCA', path: '/courses/bca' },
      { label: 'B.A.', path: '/courses/b-a' },
      { label: 'Departments', path: '/departments' },
    ],
  },
  {
    title: 'Admissions',
    links: [
      { label: 'Admission Process', path: '/admissions' },
      { label: 'Notices', path: '/notices' },
      { label: 'Events', path: '/events' },
      { label: 'Contact', path: '/contact' },
    ],
  },
];

export default mainNav;
