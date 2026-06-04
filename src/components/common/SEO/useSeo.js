/* ============================================
   useSeo — Per-page SEO hook
   --------------------------------------------
   Applies the resolved SEO for the current route (title, meta, canonical,
   OG/Twitter and per-route JSON-LD) and lets a page contribute overrides
   that are merged over the route defaults.

   Usage (Phase 2 pages):
     useSeo();                          // route defaults only
     useSeo({ title, description, image, schema, faqs });

   The global <SEOHead /> in App.jsx calls this with no overrides so every
   route is covered even before a page opts in. When a page DOES pass
   overrides, its effect runs after the global one (it renders deeper in the
   tree), so the page's values win.
   ============================================ */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applySeo, setSeoOverride, clearSeoOverride } from '../../../utils/seo';

/**
 * @param {Object} [overrides] - { title, description, image, robots, type,
 *                                 keywords, schema, faqs }
 */
export default function useSeo(overrides) {
  const { pathname } = useLocation();
  const hasOverrides = overrides && Object.keys(overrides).length > 0;
  // Serialise so the effect re-runs when override values change.
  const overrideKey = hasOverrides ? JSON.stringify(overrides) : '';

  useEffect(() => {
    if (hasOverrides) {
      setSeoOverride(pathname, overrides);
    }
    applySeo(pathname);

    return () => {
      if (hasOverrides) {
        clearSeoOverride(pathname);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, overrideKey]);
}
