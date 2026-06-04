/* ============================================
   PublicLayout — shared chrome for public routes
   Icon Commerce College
   --------------------------------------------
   Renders the persistent public-site chrome around
   the routed page (<Outlet/>): header, footer, the
   global lead drawer, floating enquiry/WhatsApp
   actions, back-to-top, and the mobile bottom nav.
   Header and Footer are rebuilt in prompts 05/06 —
   the existing components are used as-is for now.
   ============================================ */

import React, { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

import Header from '../common/Header/Header';
import Footer from '../common/Footer/Footer';
import Modal from '../common/Modal/Modal';
import MobileNavigation from '../common/MobileNavigation/MobileNavigation';
import MobileDrawer from '../common/MobileDrawer/MobileDrawer';
import LeadFormDrawer from '../common/LeadFormDrawer/LeadFormDrawer';
import BackToTop from '../common/BackToTop/BackToTop';
import FloatingActions from '../common/FloatingActions/FloatingActions';
import PageLoader from './PageLoader';
import { useModal } from '../../context/ModalContext';

const PublicLayout = () => {
  const theme = useTheme();
  // The desktop nav collapses to the hamburger + bottom nav below `lg`.
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { openLeadDrawer, isDrawerOpen, drawerConfig, closeLeadDrawer } = useModal();

  const handleEnquiryClick = () => openLeadDrawer('apply-now');

  return (
    <>
      <Header
        mobileMenuOpen={isMobileDrawerOpen}
        onMobileMenuToggle={() => setIsMobileDrawerOpen((open) => !open)}
      />

      <main id="main-content" className="main-content">
        {/* Shared Suspense boundary for all lazy public page chunks */}
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />

      {/* Global lead-capture drawer (opened via header CTA, floating actions, etc.).
          `programInterest` lets a CTA (e.g. a program card) preselect the program. */}
      <LeadFormDrawer
        isOpen={isDrawerOpen}
        onClose={closeLeadDrawer}
        title={drawerConfig.title}
        subtitle={drawerConfig.subtitle}
        source={drawerConfig.source}
        programInterest={drawerConfig.programInterest}
      />

      {/* Floating enquiry / WhatsApp (desktop) */}
      <FloatingActions />

      {/* Back to top */}
      <BackToTop />

      {/* Mobile bottom navigation + slide-out menu */}
      {isMobile && (
        <>
          <MobileNavigation
            onMenuClick={() => setIsMobileDrawerOpen((open) => !open)}
            onEnquiryClick={handleEnquiryClick}
            isDrawerOpen={isMobileDrawerOpen}
          />
          <MobileDrawer
            open={isMobileDrawerOpen}
            onClose={() => setIsMobileDrawerOpen(false)}
            onApply={handleEnquiryClick}
          />
        </>
      )}

      {/* Global generic modal portal */}
      <Modal />
    </>
  );
};

export default PublicLayout;
