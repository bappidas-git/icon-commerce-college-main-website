/* ============================================
   FloatingActions
   Icon Commerce College
   --------------------------------------------
   Desktop-only floating WhatsApp + Enquiry stack
   pinned to the bottom-right. On mobile the bottom
   navigation bar covers these actions, so this
   component renders nothing there.
   ============================================ */

import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useModal } from '../../../context/ModalContext';
import { trackWhatsAppClick } from '../../../utils/gtm';
import styles from './FloatingActions.module.css';

const WHATSAPP_HREF =
  'https://api.whatsapp.com/send?phone=919365375782&text=Hello%20Icon%20Commerce%20College%2C%20I%27d%20like%20to%20know%20more%20about%20admissions.';

const FloatingActions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { openLeadDrawer } = useModal();

  // The mobile bottom navigation already exposes Call / WhatsApp / Apply.
  if (isMobile) return null;

  return (
    <div className={styles.stack}>
      <motion.a
        href={WHATSAPP_HREF}
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

      <motion.button
        type="button"
        className={`${styles.fab} ${styles.enquire}`}
        onClick={() => openLeadDrawer('default')}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Enquire about admission"
      >
        <Icon icon="mdi:message-text-outline" className={styles.fabIcon} />
        <span className={styles.enquireLabel}>Enquire</span>
      </motion.button>
    </div>
  );
};

export default FloatingActions;
