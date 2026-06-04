/* ============================================
   useDocumentTitle — Icon Commerce College
   --------------------------------------------
   Small hook that sets `document.title` for a page
   shell. The full per-route SEO system (meta tags,
   schemas, canonical) lands in prompt 10; until then
   each shell uses this so the browser tab reflects
   the current route.
   ============================================ */

import { useEffect } from 'react';

const SITE_NAME = 'Icon Commerce College';

/**
 * @param {string} title Page title (without the site suffix). When falsy the
 *   document title is left untouched.
 */
export default function useDocumentTitle(title) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${SITE_NAME}`;
    }
  }, [title]);
}
