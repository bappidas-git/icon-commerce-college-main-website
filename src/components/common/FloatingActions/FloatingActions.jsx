/* ============================================
   FloatingActions
   Icon Commerce College
   --------------------------------------------
   Desktop-only floating WhatsApp + Enquiry stack
   pinned to the bottom-right. On mobile the bottom
   navigation bar already exposes Call / WhatsApp /
   Apply, so this component renders nothing there to
   avoid overlapping it. (BackToTop is rendered
   separately and sits above this stack.)
   ============================================ */

import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useModal } from '../../../context/ModalContext';
import { trackWhatsAppClick } from '../../../utils/gtm';
import { whatsappHref } from '../../../data/collegeInfo';
import styles from './FloatingActions.module.css';

const WHATSAPP_MESSAGE =
  "Hello Icon Commerce College, I'd like to know more about admissions.";

const FloatingActions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { openLeadDrawer, isDrawerOpen } = useModal();

  // The mobile bottom navigation already exposes Call / WhatsApp / Apply.
  if (isMobile) return null;

  return (
    <motion.div
      className={styles.stack}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.a
        href={whatsappHref(undefined, WHATSAPP_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.fab} ${styles.whatsapp}`}
        onClick={() => trackWhatsAppClick('floating_actions')}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Chat with Icon Commerce College on WhatsApp"
      >
        <Icon icon="mdi:whatsapp" className={styles.fabIcon} />
      </motion.a>

      {/* Enquire FAB — hidden while the lead drawer is open */}
      <AnimatePresence>
        {!isDrawerOpen && (
          <motion.button
            type="button"
            className={`${styles.fab} ${styles.enquire}`}
            onClick={() => openLeadDrawer('enquiry')}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            aria-label="Enquire about admission"
          >
            <Icon icon="mdi:message-text-outline" className={styles.fabIcon} />
            <span className={styles.enquireLabel}>Enquire</span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FloatingActions;
