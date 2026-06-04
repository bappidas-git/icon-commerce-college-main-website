/* ============================================
   galleryData.js — Photo + video gallery
   Icon Commerce College
   --------------------------------------------
   Pure data module. 12 placeholder photos + seed videos. YouTube IDs
   are TODO until the client supplies the channel links (§6/§7).
   ============================================ */

import { placeholder } from '../utils/assets';

/** Gallery photo categories for filtering. */
export const galleryCategories = [
  'Campus',
  'Events',
  'Classrooms',
  'Sports',
  'Cultural',
];

/**
 * @typedef {Object} GalleryPhoto
 * @property {string} src       Placeholder URL
 * @property {string} caption
 * @property {string} category
 *
 * @typedef {Object} GalleryVideo
 * @property {string} title
 * @property {string} youtubeId TODO until client provides
 * @property {string} thumb     Placeholder URL
 */

const photoSeed = [
  { caption: 'College Campus', category: 'Campus' },
  { caption: 'Annual College Week', category: 'Events' },
  { caption: 'Smart Classroom Session', category: 'Classrooms' },
  { caption: 'Computer Laboratory', category: 'Campus' },
  { caption: 'ICON Shield Cricket Tournament', category: 'Sports' },
  { caption: 'Cultural Programme', category: 'Cultural' },
  { caption: 'Digital Library', category: 'Campus' },
  { caption: 'Inter-College Cooking Competition', category: 'Events' },
  { caption: 'Students on Campus', category: 'Campus' },
  { caption: 'Debate & Quiz Competition', category: 'Events' },
  { caption: 'Playground & Sports Day', category: 'Sports' },
  { caption: 'Annual Cultural Night', category: 'Cultural' },
];

/** @type {GalleryPhoto[]} */
export const galleryPhotos = photoSeed.map((p, i) => ({
  src: placeholder(`gallery-${i + 1}`),
  caption: p.caption,
  category: p.category,
}));

/** @type {GalleryVideo[]} */
export const galleryVideos = [
  {
    title: 'College Profile — ICON Commerce College',
    youtubeId: 'TODO: YouTube video ID',
    thumb: placeholder('gallery-1'),
  },
  {
    title: 'Campus Tour & Facilities',
    youtubeId: 'TODO: YouTube video ID',
    thumb: placeholder('gallery-4'),
  },
  {
    title: 'Annual College Week Highlights',
    youtubeId: 'TODO: YouTube video ID',
    thumb: placeholder('gallery-2'),
  },
];

/**
 * @typedef {Object} GalleryData
 * @property {GalleryPhoto[]} photos
 * @property {GalleryVideo[]} videos
 * @property {string[]} categories
 */

/** @type {GalleryData} */
export const galleryData = {
  photos: galleryPhotos,
  videos: galleryVideos,
  categories: galleryCategories,
};

export default galleryData;
