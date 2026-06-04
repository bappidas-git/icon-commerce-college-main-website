/* ============================================
   SEOHead Component
   --------------------------------------------
   Manages the document head SEO per route using direct DOM manipulation
   (no react-helmet, consistent with the CRA boilerplate).

   - Injects the site-wide JSON-LD schemas once on mount
     (Organization / CollegeOrUniversity, LocalBusiness, WebSite + SearchAction).
   - On every route change, sets <title>, meta description/keywords, canonical,
     Open Graph + Twitter tags, and the per-route schemas (WebPage,
     BreadcrumbList, FAQPage on Home/Admissions, Course on course detail).
   - Strips all schemas on /admin routes.

   Rendered once, globally, in App.jsx. Pages built in Phase 2 can either
   pass overrides as props here or call the `useSeo` hook directly.
   ============================================ */

import { useEffect } from 'react';
import { injectDefaultSchemas } from '../../../utils/seo';
import useSeo from './useSeo';

const SEOHead = (props = {}) => {
  // Inject the route-independent schemas once.
  useEffect(() => {
    injectDefaultSchemas();
  }, []);

  // Apply route SEO + any overrides passed as props.
  const hasProps = props && Object.keys(props).length > 0;
  useSeo(hasProps ? props : undefined);

  // Renders nothing visible.
  return null;
};

export default SEOHead;
