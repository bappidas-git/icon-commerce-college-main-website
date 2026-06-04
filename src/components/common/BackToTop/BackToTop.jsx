/* ============================================
   BackToTop Button
   Icon Commerce College
   --------------------------------------------
   Floating button that appears after the user
   scrolls down and smooth-scrolls back to the top.
   (Extracted from the Phase-0 App.jsx so it can be
   reused by the shared public layout.)
   ============================================ */

import React, { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BackToTop = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.pageYOffset > 500);
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '170px',
            right: '20px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary, #1A2A52)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 8px 32px rgba(20, 35, 61, 0.2)',
            zIndex: 1000,
          }}
          aria-label="Back to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
});

BackToTop.displayName = 'BackToTop';

export default BackToTop;
