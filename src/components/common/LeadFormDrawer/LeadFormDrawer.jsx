/* ============================================
   LeadFormDrawer Component
   Right-side drawer on desktop, bottom-sheet on mobile.
   Hosts UnifiedLeadForm with a navy + gold header.
   Closes on Esc / overlay click, is focus-trapped and
   scroll-locked (body lock handled by ModalContext).
   ============================================ */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import UnifiedLeadForm from '../UnifiedLeadForm/UnifiedLeadForm';
import styles from './LeadFormDrawer.module.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const LeadFormDrawer = ({
  isOpen,
  onClose,
  title = 'Enquire About Admission',
  subtitle = "Fill the form — we'll assist you with admission",
  source = 'general',
  onSubmitSuccess,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerRef = useRef(null);

  // Handle escape key to close.
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap: keep Tab focus inside the drawer while open and move
  // focus to the first field on open.
  useEffect(() => {
    if (!isOpen) return undefined;
    const node = drawerRef.current;
    if (!node) return undefined;

    const focusFirst = () => {
      const focusables = node.querySelectorAll(FOCUSABLE);
      const target = focusables[1] || focusables[0]; // skip the close button
      if (target) target.focus();
    };
    const raf = requestAnimationFrame(focusFirst);

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      const focusables = Array.from(node.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener('keydown', handleTab);
    return () => {
      cancelAnimationFrame(raf);
      node.removeEventListener('keydown', handleTab);
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  // Slide from the right on desktop, up from the bottom on mobile.
  const hiddenOffset = isMobile ? { y: '100%' } : { x: '100%' };
  const drawerVariants = {
    hidden: { ...hiddenOffset, opacity: 0 },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 30, stiffness: 300 },
    },
    exit: {
      ...hiddenOffset,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeInOut' },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.4 },
    },
  };

  const drawerContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={`${styles.backdrop} ${isMobile ? styles.backdropMobile : ''}`}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={drawerRef}
            className={`${styles.drawer} ${isMobile ? styles.drawerMobile : ''}`}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            {/* Mobile bottom-sheet grab handle */}
            {isMobile && <span className={styles.grabber} aria-hidden="true" />}

            {/* Close Button */}
            <IconButton
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close enquiry form"
            >
              <Icon icon="mdi:close" />
            </IconButton>

            {/* Drawer Content */}
            <div className={styles.drawerContent}>
              {/* Header */}
              <motion.div
                className={styles.header}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                <div className={styles.headerIcon}>
                  <Icon icon="mdi:school-outline" />
                </div>
                <Typography variant="h4" id="drawer-title" className={styles.title}>
                  {title}
                </Typography>
                <Typography className={styles.subtitle} sx={{ color: '#FFFFFFB3 !important' }}>
                  {subtitle}
                </Typography>
              </motion.div>

              {/* Unified Lead Form */}
              <UnifiedLeadForm
                variant="drawer"
                source={source}
                showTitle={false}
                showSubtitle={false}
                showCourseFields={true}
                showTrustBadges={true}
                showConsent={true}
                showPhoneButton={true}
                submitButtonText="Enquire Now"
                onClose={onClose}
                onSubmitSuccess={onSubmitSuccess}
                formId={`drawer-form-${source}`}
              />

              {/* Trust line */}
              <p className={styles.trustLine}>
                <Icon icon="mdi:lock-outline" className={styles.trustLineIcon} />
                We&rsquo;ll never share your details.
              </p>
            </div>

            {/* Decorative Elements */}
            <div className={styles.decorativeCircle1} />
            <div className={styles.decorativeCircle2} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
};

export default LeadFormDrawer;
