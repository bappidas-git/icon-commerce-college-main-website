#!/usr/bin/env node
/**
 * gen-placeholders.mjs — Icon Commerce College
 * ------------------------------------------------------------------
 * Generates labelled SVG placeholder images for every asset listed
 * in prompts/00-DESIGN-SYSTEM.md §7. Each placeholder is a navy card
 * with a gold border and centered white filename + dimensions, so the
 * client can later swap them for real photography.
 *
 * No external dependencies — pure Node ESM + fs.
 *
 * Names in §7 use `.jpg`/`.png` extensions; we render an SVG saved as
 * `<base>.svg` and resolve logical names → paths via src/utils/assets.js.
 *
 * Usage:  node scripts/gen-placeholders.mjs   (or: npm run gen:placeholders)
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'images', 'placeholders');

/* Brand tokens (mirror of design-system §2) */
const NAVY = '#1A2A52';
const NAVY_DARK = '#111d3a';
const GOLD = '#C8A04D';
const WHITE = '#FFFFFF';

/**
 * The §7 asset manifest: original filename (as referenced in the doc)
 * mapped to sensible intrinsic dimensions for each use-case.
 */
const ASSETS = [
  // Brand
  ['logo-icon-commerce.png', 360, 96],
  ['favicon.png', 256, 256],

  // Hero
  ['hero-campus.jpg', 1600, 900],
  ['hero-students.jpg', 1600, 900],
  ['hero-library.jpg', 1600, 900],

  // About
  ['about-college-building.jpg', 1200, 800],
  ['about-campus-aerial.jpg', 1200, 800],
  ['vision-mission.jpg', 1200, 800],

  // Leadership portraits (4:5)
  ['principal-dr-mandira-saha.jpg', 600, 750],
  ['president-dipali-bora.jpg', 600, 750],
  ['advisor-debasish-bora.jpg', 600, 750],
  ['rector-sawpon-dowerah.jpg', 600, 750],
  ['director-academic-rajib-das.jpg', 600, 750],
  ['director-dipanju-bora.jpg', 600, 750],
  ['academic-advisor-nilanjan-bhattacharjee.jpg', 600, 750],

  // Courses
  ['course-bcom.jpg', 800, 600],
  ['course-bba.jpg', 800, 600],
  ['course-bca.jpg', 800, 600],
  ['course-ba.jpg', 800, 600],

  // Departments
  ['dept-arts.jpg', 800, 600],
  ['dept-commerce.jpg', 800, 600],
  ['dept-science.jpg', 800, 600],

  // Facilities
  ['facility-library.jpg', 800, 600],
  ['facility-computer-lab.jpg', 800, 600],
  ['facility-canteen.jpg', 800, 600],
  ['facility-playground.jpg', 800, 600],
  ['facility-smart-classroom.jpg', 800, 600],
  ['facility-wifi.jpg', 800, 600],

  // Faculty
  ['faculty-placeholder.jpg', 600, 750],

  // Gallery (1–12)
  ...Array.from({ length: 12 }, (_, i) => [`gallery-${i + 1}.jpg`, 800, 600]),

  // Events
  ['event-college-week.jpg', 1200, 800],
  ['event-cooking-competition.jpg', 1200, 800],
  ['event-icon-shield.jpg', 1200, 800],
  ['event-icon-trophy.jpg', 1200, 800],

  // Misc
  ['testimonial-avatar.jpg', 400, 400],
  ['prospectus-cover.jpg', 800, 1100],
  ['map-location.jpg', 1200, 600],
  ['og-default.jpg', 1200, 630],
];

/** XML-escape a string for safe embedding in SVG text. */
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Curated, richer SVG for specific names (e.g. the logo lockup) so the
 * regenerated placeholder still reads as a brand mark rather than a card.
 */
const CURATED = {
  'logo-icon-commerce': (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Icon Commerce College logo placeholder">
  <rect width="${w}" height="${h}" rx="12" fill="${NAVY}"/>
  <circle cx="48" cy="48" r="26" fill="none" stroke="${GOLD}" stroke-width="3"/>
  <text x="48" y="56" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="24" font-weight="700" fill="${GOLD}">IC</text>
  <text x="88" y="42" font-family="Poppins, Arial, sans-serif" font-size="22" font-weight="700" fill="${WHITE}">ICON COMMERCE</text>
  <text x="88" y="66" font-family="Poppins, Arial, sans-serif" font-size="16" font-weight="600" letter-spacing="3" fill="${GOLD}">COLLEGE · 2004</text>
</svg>
`,
};

/** Build the generic labelled placeholder card. */
function genericCard(name, w, h) {
  const isPortraitIsh = h >= w;
  const minSide = Math.min(w, h);
  // Scale type to the artwork so labels stay legible at any size.
  const nameSize = Math.max(13, Math.round(minSide * (isPortraitIsh ? 0.05 : 0.045)));
  const dimSize = Math.round(nameSize * 0.72);
  const markR = Math.round(minSide * 0.11);
  const markY = h * 0.34;
  const stroke = Math.max(2, Math.round(minSide * 0.006));
  const inset = Math.max(6, Math.round(minSide * 0.025));
  const id = `g-${name.replace(/[^a-z0-9]/gi, '-')}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(name)} placeholder image (${w}×${h})">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${NAVY}"/>
      <stop offset="1" stop-color="${NAVY_DARK}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${id})"/>
  <rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${h - inset * 2}" fill="none" stroke="${GOLD}" stroke-width="${stroke}" rx="${Math.round(minSide * 0.03)}"/>
  <circle cx="${w / 2}" cy="${markY}" r="${markR}" fill="none" stroke="${GOLD}" stroke-width="${stroke}"/>
  <text x="${w / 2}" y="${markY + markR * 0.38}" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-weight="700" font-size="${Math.round(markR * 0.95)}" fill="${GOLD}">IC</text>
  <text x="${w / 2}" y="${h * 0.62}" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-weight="600" font-size="${nameSize}" fill="${WHITE}">${esc(name)}</text>
  <text x="${w / 2}" y="${h * 0.62 + nameSize * 1.6}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="400" font-size="${dimSize}" letter-spacing="1" fill="${GOLD}">${w} × ${h}</text>
</svg>
`;
}

function run() {
  mkdirSync(OUT_DIR, { recursive: true });
  let count = 0;
  for (const [orig, w, h] of ASSETS) {
    const base = basename(orig).replace(/\.(png|jpe?g|webp|svg)$/i, '');
    const svg = CURATED[base] ? CURATED[base](w, h) : genericCard(orig, w, h);
    writeFileSync(join(OUT_DIR, `${base}.svg`), svg, 'utf8');
    count += 1;
  }
  console.log(`✓ Generated ${count} placeholder SVGs in public/images/placeholders/`);
}

run();
