/* ============================================
   galleryData.js — Photo + video gallery
   Icon Commerce College
   --------------------------------------------
   Pure data module. 12 placeholder photos + seed videos. YouTube IDs
   are TODO until the client supplies the channel links (§6/§7).
   ============================================ */

import { placeholder } from "../utils/assets";

/** Gallery photo categories for filtering. */
export const galleryCategories = [
  "Campus",
  "Events",
  "Classrooms",
  "Sports",
  "Cultural",
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
  {
    caption: "College Campus",
    category: "Campus",
    photo:
      "https://res.cloudinary.com/drx1zsmeq/image/upload/v1780294890/ICC_Campus_eqclda.png",
  },
  {
    caption: "Annual College Week",
    category: "Events",
    photo:
      "https://res.cloudinary.com/drx1zsmeq/image/upload/v1782283796/G1_wiiars.png",
  },
  {
    caption: "Smart Classroom Session",
    category: "Classrooms",
    photo:
      "https://res.cloudinary.com/drx1zsmeq/image/upload/v1780294891/Samrt_classroom_t8lows.png",
  },
  {
    caption: "Computer Laboratory",
    category: "Campus",
    photo:
      "https://res.cloudinary.com/drx1zsmeq/image/upload/v1782281788/Comp-lab_n0hr25.png",
  },
  {
    caption: "ICON Cricket pitch",
    category: "Sports",
    photo:
      "https://res.cloudinary.com/drx1zsmeq/image/upload/v1782283802/G15_dvyegw.png",
  },
  {
    caption: "Cultural Programme",
    category: "Cultural",
    photo:
      "https://res.cloudinary.com/drx1zsmeq/image/upload/v1782283798/G8_szsjxu.png",
  },
  {
    caption: "Library",
    category: "Campus",
    photo:
      "https://res.cloudinary.com/drx1zsmeq/image/upload/v1782281793/Library_hnc3ni.png",
  },
  {
    caption: "Cultural Programme",
    category: "Cultural",
    photo:
      "https://res.cloudinary.com/drx1zsmeq/image/upload/v1782283798/G9_sm2hf5.png",
  },
  {
    caption: "Students on Sports Day",
    category: "Sports",
    photo:
      "https://res.cloudinary.com/drx1zsmeq/image/upload/v1782283795/G3_rllxur.png",
  },
  {
    caption: "Inauguration",
    category: "Events",
    photo:
      "https://res.cloudinary.com/drx1zsmeq/image/upload/v1782283794/G2_ikjo4b.png",
  },
  {
    caption: "Playground & Sports Day",
    category: "Sports",
    photo:
      "https://res.cloudinary.com/drx1zsmeq/image/upload/v1782283795/G4_nzdncq.png",
  },
  {
    caption: "cultural festivel ",
    category: "Cultural",
    photo:
      "https://res.cloudinary.com/drx1zsmeq/image/upload/v1782283802/G14_j5zllz.png",
  },
];

/** @type {GalleryPhoto[]} */
export const galleryPhotos = photoSeed.map((p, i) => ({
  //src: placeholder(`gallery-${i + 1}`),
  src: p.photo,
  caption: p.caption,
  category: p.category,
}));

/** @type {GalleryVideo[]} */
export const galleryVideos = [
  {
    title: "College Profile — ICON Commerce College",
    youtubeId: "TODO: YouTube video ID",
    thumb: placeholder("gallery-1"),
  },
  {
    title: "Campus Tour & Facilities",
    youtubeId: "TODO: YouTube video ID",
    thumb: placeholder("gallery-4"),
  },
  {
    title: "Annual College Week Highlights",
    youtubeId: "TODO: YouTube video ID",
    thumb: placeholder("gallery-2"),
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
