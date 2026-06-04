/* ============================================
   App Component — Icon Commerce College
   Root application: providers, routing, lazy
   loading, and global chrome.

   NOTE: This is the Phase-0 foundation state.
   The public home page is intentionally a
   minimal placeholder — the real multi-page
   routing (prompt 04) and page sections
   (Phase 2) are built in later prompts.
   ============================================ */

import React, { Suspense, lazy, useEffect, useState, memo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CircularProgress, useMediaQuery, useTheme, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// App Styles
import './App.css';

// Context Providers
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { ModalProvider, useModal } from './context/ModalContext';

// Components (Eager loaded — global chrome)
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import Modal from './components/common/Modal/Modal';
import MobileNavigation from './components/common/MobileNavigation/MobileNavigation';
import MobileDrawer from './components/common/MobileDrawer/MobileDrawer';
import LeadFormDrawer from './components/common/LeadFormDrawer/LeadFormDrawer';
import EngagementTracker from './components/common/EngagementTracker/EngagementTracker';
import SEOHead from './components/common/SEO/SEOHead';
import useGTMTracking from './hooks/useGTMTracking';
import { initGTM } from './utils/gtm';

// Admin
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import AdminLogin from './admin/components/AdminLogin';
import ProtectedRoute from './admin/components/ProtectedRoute';

// Pages (Lazy loaded)
const ThankYouPage = lazy(() => import('./pages/ThankYou/ThankYou'));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));

// ===========================================
// Section Loader Component
// ===========================================
const SectionLoader = memo(({ height = 300 }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: height,
      width: '100%',
    }}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CircularProgress size={40} thickness={3} sx={{ color: 'var(--color-primary, #1A2A52)' }} />
    </motion.div>
  </Box>
));

SectionLoader.displayName = 'SectionLoader';

// ===========================================
// Scroll Progress Indicator
// ===========================================
const ScrollProgressIndicator = memo(() => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = winHeightPx > 0 ? (scrollPx / winHeightPx) * 100 : 0;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: '3px',
        background: 'linear-gradient(90deg, #1A2A52 0%, #C8A04D 100%)',
        zIndex: 9999,
        transition: 'width 0.1s ease-out',
      }}
    />
  );
});

ScrollProgressIndicator.displayName = 'ScrollProgressIndicator';

// ===========================================
// Back to Top Button
// ===========================================
const BackToTopButton = memo(() => {
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
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#1A2A52',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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

BackToTopButton.displayName = 'BackToTopButton';

// ===========================================
// Lead Form Drawer Wrapper
// ===========================================
const LeadFormDrawerWrapper = () => {
  const { isDrawerOpen, drawerConfig, closeLeadDrawer } = useModal();

  return (
    <LeadFormDrawer
      isOpen={isDrawerOpen}
      onClose={closeLeadDrawer}
      title={drawerConfig.title}
      subtitle={drawerConfig.subtitle}
      source={drawerConfig.source}
    />
  );
};

// ===========================================
// Home Page Content (Phase-0 placeholder)
// ===========================================
const HomePageContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { openLeadDrawer } = useModal();

  // Initialize GTM tracking (no-ops cleanly when analytics is disabled)
  useGTMTracking();

  const handleMenuClick = () => setIsMobileDrawerOpen(true);
  const handleMobileDrawerClose = () => setIsMobileDrawerOpen(false);
  const handleMobileDrawerOpen = () => setIsMobileDrawerOpen(true);
  const handleEnquiryClick = () => openLeadDrawer('default');

  return (
    <>
      <Header forceCloseMenu={isMobileDrawerOpen} />

      <main id="main-content" className="main-content">
        <section
          style={{
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '120px 24px 80px',
            background: 'linear-gradient(135deg, #1A2A52 0%, #111d3a 100%)',
            color: '#FFFFFF',
          }}
        >
          <p
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#C8A04D',
              fontWeight: 600,
              fontSize: '0.8rem',
              marginBottom: '16px',
            }}
          >
            Established 2004 · Guwahati, Assam
          </p>
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 700,
              margin: 0,
              maxWidth: 820,
            }}
          >
            Icon Commerce College
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.78)',
              maxWidth: 620,
              marginTop: '16px',
            }}
          >
            Where Knowledge Meets Character — empowering Commerce, Arts &amp;
            Computer Application graduates. Our new website is being built. In the
            meantime, send us an enquiry and our team will get in touch.
          </p>
          <button
            type="button"
            onClick={handleEnquiryClick}
            style={{
              marginTop: '32px',
              padding: '14px 32px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#E0301E',
              color: '#FFFFFF',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Enquire Now
          </button>
        </section>
      </main>

      <Footer />

      {isMobile && (
        <>
          <MobileNavigation
            onMenuClick={handleMenuClick}
            onEnquiryClick={handleEnquiryClick}
            isDrawerOpen={isMobileDrawerOpen}
          />
          <MobileDrawer
            open={isMobileDrawerOpen}
            onClose={handleMobileDrawerClose}
            onOpen={handleMobileDrawerOpen}
            onBookConsultation={handleEnquiryClick}
          />
        </>
      )}

      <BackToTopButton />
      <Modal />
    </>
  );
};

// ===========================================
// Main App Component
// ===========================================
const App = () => {
  // Initialize GTM only when an id is configured (analytics is opt-in).
  useEffect(() => {
    const gtmId = process.env.REACT_APP_GTM_ID;
    if (gtmId) {
      initGTM(gtmId);
    }
  }, []);

  // Hide initial loader after mount
  useEffect(() => {
    const initialLoader = document.getElementById('initial-loader');
    if (initialLoader) {
      initialLoader.classList.add('hidden');
      setTimeout(() => {
        initialLoader.style.display = 'none';
      }, 400);
    }
  }, []);

  // Smooth scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <BrowserRouter>
      <CustomThemeProvider>
        <ModalProvider>
          <div className="app" id="app-root">
            {/* SEO Head — manages meta tags and schemas per route */}
            <SEOHead />

            {/* Scroll Progress Indicator */}
            <ScrollProgressIndicator />

            {/* Skip to main content link for accessibility */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>

            {/* Routes */}
            <Routes>
              <Route path="/" element={<HomePageContent />} />

              <Route
                path="/thank-you"
                element={
                  <Suspense fallback={<SectionLoader height={400} />}>
                    <ThankYouPage />
                  </Suspense>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/login"
                element={
                  <AdminAuthProvider>
                    <AdminLogin />
                  </AdminAuthProvider>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <AdminAuthProvider>
                    <ProtectedRoute>
                      <Suspense fallback={<SectionLoader height={400} />}>
                        <AdminLayout />
                      </Suspense>
                    </ProtectedRoute>
                  </AdminAuthProvider>
                }
              />
            </Routes>

            {/* Lead Form Drawer — available globally */}
            <LeadFormDrawerWrapper />

            {/* Engagement Tracker — invisible analytics helper (no-op when disabled) */}
            <EngagementTracker />
          </div>
        </ModalProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  );
};

export default App;
