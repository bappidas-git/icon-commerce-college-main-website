/* ============================================
   App Component — Icon Commerce College
   Root application: providers, multi-page routing,
   route-level code-splitting and global chrome.

   The public site uses a shared <PublicLayout/>
   (Header + Outlet + Footer + global chrome) with
   lazy-loaded page shells. Page content is filled in
   across the Phase 1–3 prompts.
   ============================================ */

import React, { Suspense, lazy, useEffect, useState, memo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

// App Styles
import './App.css';

// Context Providers
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { ModalProvider } from './context/ModalContext';

// Global, route-independent chrome (eager)
import SEOHead from './components/common/SEO/SEOHead';
import EngagementTracker from './components/common/EngagementTracker/EngagementTracker';
import ScrollToTop from './components/layout/ScrollToTop';
import PageLoader from './components/layout/PageLoader';
import PublicLayout from './components/layout/PublicLayout';
import NotFound from './pages/NotFound/NotFound';
import { initGTM } from './utils/gtm';

// Admin (small, eager auth shell)
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import AdminLogin from './admin/components/AdminLogin';
import ProtectedRoute from './admin/components/ProtectedRoute';

// ===========================================
// Lazy-loaded pages (route-level code-splitting)
// ===========================================
const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const Leadership = lazy(() => import('./pages/Leadership/Leadership'));
const Courses = lazy(() => import('./pages/Courses/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail/CourseDetail'));
const Departments = lazy(() => import('./pages/Departments/Departments'));
const Faculty = lazy(() => import('./pages/Faculty/Faculty'));
const Facilities = lazy(() => import('./pages/Facilities/Facilities'));
const Gallery = lazy(() => import('./pages/Gallery/Gallery'));
const Admissions = lazy(() => import('./pages/Admissions/Admissions'));
const Notices = lazy(() => import('./pages/Notices/Notices'));
const Events = lazy(() => import('./pages/Events/Events'));
const Contact = lazy(() => import('./pages/Contact/Contact'));

const ThankYouPage = lazy(() => import('./pages/ThankYou/ThankYou'));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));

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

  // Hide the initial HTML loader once React has mounted.
  useEffect(() => {
    const initialLoader = document.getElementById('initial-loader');
    if (initialLoader) {
      initialLoader.classList.add('hidden');
      setTimeout(() => {
        initialLoader.style.display = 'none';
      }, 400);
    }
  }, []);

  return (
    <BrowserRouter>
      <CustomThemeProvider>
        <ModalProvider>
          <div className="app" id="app-root">
            {/* SEO Head — manages meta tags and schemas per route */}
            <SEOHead />

            {/* Restore/normalise scroll position on navigation */}
            <ScrollToTop />

            {/* Scroll Progress Indicator */}
            <ScrollProgressIndicator />

            {/* Skip to main content link for accessibility */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>

            {/* Routes */}
            <Routes>
              {/* Public site — shared layout + lazy page shells */}
              <Route element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="leadership" element={<Leadership />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:slug" element={<CourseDetail />} />
                <Route path="departments" element={<Departments />} />
                <Route path="faculty" element={<Faculty />} />
                <Route path="facilities" element={<Facilities />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="admissions" element={<Admissions />} />
                <Route path="notices" element={<Notices />} />
                <Route path="events" element={<Events />} />
                <Route path="contact" element={<Contact />} />
              </Route>

              {/* Post-submit confirmation (noindex, standalone) */}
              <Route
                path="/thank-you"
                element={
                  <Suspense fallback={<PageLoader minHeight="100vh" />}>
                    <ThankYouPage />
                  </Suspense>
                }
              />

              {/* Admin (noindex) */}
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
                      <Suspense fallback={<PageLoader minHeight="100vh" />}>
                        <AdminLayout />
                      </Suspense>
                    </ProtectedRoute>
                  </AdminAuthProvider>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Engagement Tracker — invisible analytics helper (no-op when disabled) */}
            <EngagementTracker />
          </div>
        </ModalProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  );
};

export default App;
