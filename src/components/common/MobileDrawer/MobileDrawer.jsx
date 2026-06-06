/* ============================================
   MobileDrawer — Icon Commerce College
   --------------------------------------------
   Slide-in (right) navigation drawer for small screens:
   the full route-based nav tree with collapsible submenus,
   a contact block, the Samarth portal pill and the warm-red
   "Apply Now" CTA. Focus-trapped (MUI modal Drawer), closes
   on route change. Built per prompt 05.
   ============================================ */

import React, { useEffect, useState } from 'react';
import { Drawer, Collapse, IconButton } from '@mui/material';
import { useLocation, NavLink } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@iconify/react';

import Img from '../Img';
import { mainNav } from '../../../data/navigation';
import {
  collegeInfo,
  phoneHref,
  emailHref,
  whatsappHref,
} from '../../../data/collegeInfo';
import { trackPhoneClick, trackCTAClick, trackNavigation } from '../../../utils/gtm';
import styles from './MobileDrawer.module.css';

const LOGO_URL = '/images/placeholders/logo-icon-commerce.svg';

const MobileDrawer = ({ open, onClose, onApply }) => {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  // Which submenu is expanded (single-open accordion).
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Auto-expand the submenu containing the current route when opening.
  useEffect(() => {
    if (!open) return;
    const parent = mainNav.find(
      (item) => item.children?.some((c) => c.path === pathname),
    );
    setOpenSubmenu(parent ? parent.label : null);
  }, [open, pathname]);

  const toggleSubmenu = (label) =>
    setOpenSubmenu((prev) => (prev === label ? null : label));

  const handleApply = () => {
    onClose();
    if (onApply) onApply();
  };

  const itemTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      transitionDuration={reduceMotion ? 0 : 300}
      ModalProps={{ keepMounted: true }}
      PaperProps={{ className: styles.paper }}
      BackdropProps={{ className: styles.backdrop }}
    >
      <div className={styles.drawer} role="dialog" aria-label="Site navigation">
        {/* Header row */}
        <div className={styles.header}>
          <NavLink to="/" className={styles.brand} aria-label="Icon Commerce College — Home">
            <Img
              src={LOGO_URL}
              alt="Icon Commerce College logo"
              className={styles.logo}
              width="360"
              height="96"
              fallback="logo-icon-commerce"
            />
            <span className={styles.brandText}>
              <span className={styles.brandName}>Icon Commerce College</span>
              <span className={styles.brandSub}>{collegeInfo.assameseName}</span>
            </span>
          </NavLink>
          <IconButton onClick={onClose} aria-label="Close menu" className={styles.close}>
            <Icon icon="mdi:close" />
          </IconButton>
        </div>

        {/* Navigation tree */}
        <nav className={styles.nav} aria-label="Mobile primary">
          <ul className={styles.navList}>
            {mainNav.map((item, index) => {
              const hasChildren = Boolean(item.children);
              const expanded = openSubmenu === item.label;

              return (
                <motion.li
                  key={item.label}
                  className={styles.navItem}
                  initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...itemTransition, delay: reduceMotion ? 0 : index * 0.04 }}
                >
                  {hasChildren ? (
                    <>
                      <button
                        type="button"
                        className={styles.navLink}
                        onClick={() => toggleSubmenu(item.label)}
                        aria-expanded={expanded}
                      >
                        {item.label}
                        <Icon
                          icon="mdi:chevron-down"
                          className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                      <Collapse in={expanded} timeout={reduceMotion ? 0 : 250}>
                        <ul className={styles.subList}>
                          {item.children.map((child) => (
                            <li key={child.path}>
                              <NavLink
                                to={child.path}
                                end
                                className={({ isActive }) =>
                                  `${styles.subLink} ${isActive ? styles.active : ''}`
                                }
                                onClick={() =>
                                  trackNavigation('mobile_drawer', 'click', child.label)
                                }
                              >
                                {child.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </Collapse>
                    </>
                  ) : (
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `${styles.navLink} ${isActive ? styles.active : ''}`
                      }
                      onClick={() => trackNavigation('mobile_drawer', 'click', item.label)}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Footer: CTA, Samarth pill, contact block */}
        <div className={styles.footer}>
          <button type="button" className={styles.applyButton} onClick={handleApply}>
            <Icon icon="mdi:school-outline" aria-hidden="true" />
            Apply Now
          </button>

          <a
            href={collegeInfo.samarthUrl}
            className={styles.samarthPill}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackCTAClick('samarth_portal', 'mobile_drawer', 'Samarth Admission Portal')
            }
          >
            Samarth Admission Portal
            <Icon icon="mdi:open-in-new" aria-hidden="true" />
          </a>

          <div className={styles.contact}>
            <a
              href={phoneHref()}
              className={styles.contactRow}
              onClick={() => trackPhoneClick(collegeInfo.phones[0], 'mobile_drawer')}
            >
              <Icon icon="mdi:phone" aria-hidden="true" />
              {collegeInfo.phones[0]}
            </a>
            <a href={emailHref()} className={styles.contactRow}>
              <Icon icon="mdi:email-outline" aria-hidden="true" />
              {collegeInfo.email}
            </a>
            <a
              href={whatsappHref(
                collegeInfo.phones[0],
                "Hello Icon Commerce College, I'd like to know more about admissions.",
              )}
              className={styles.contactRow}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="mdi:whatsapp" aria-hidden="true" />
              WhatsApp us
            </a>
            <span className={styles.contactAddress}>
              <Icon icon="mdi:map-marker" aria-hidden="true" />
              {collegeInfo.address.full}
            </span>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default MobileDrawer;
