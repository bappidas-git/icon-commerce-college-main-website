/* ============================================
   ScrollToTop — route-change scroll behaviour
   Icon Commerce College
   --------------------------------------------
   On every navigation:
   - if the URL has a hash, smooth-scroll to that
     anchor with the fixed-header offset;
   - on back/forward (POP) let the browser restore
     the previous scroll position;
   - otherwise jump to the top of the page.
   ============================================ */

import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Height of the fixed header (mirrors --header-height in CSS).
const HEADER_OFFSET = 80;

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Hash links — smooth-scroll to the anchor, accounting for the fixed header.
    if (hash) {
      const id = decodeURIComponent(hash.replace('#', ''));

      const scrollToAnchor = () => {
        const el = document.getElementById(id);
        if (!el) return false;
        const top =
          el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
        return true;
      };

      // The target may belong to a lazily-mounted page, so retry once shortly
      // after navigation if it isn't in the DOM yet.
      if (!scrollToAnchor()) {
        const timer = setTimeout(scrollToAnchor, 120);
        return () => clearTimeout(timer);
      }
      return undefined;
    }

    // Back / forward — defer to the browser's own scroll restoration.
    if (navigationType === 'POP') return undefined;

    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash, navigationType]);

  return null;
};

export default ScrollToTop;
