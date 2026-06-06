/* ============================================
   Header — Icon Commerce College
   --------------------------------------------
   Professional, sticky, responsive multi-page header:
   - Slim navy utility bar (address / phone · email / social /
     Samarth portal pill) — desktop only.
   - Main bar: logo + wordmark, route-based desktop nav with
     accessible animated dropdowns ("shuttle" underline), and a
     warm-red "Apply Now" CTA that opens the lead drawer.
   - Transparent over the Home hero at the top, solidifies to white
     with a shadow on scroll; always solid on inner routes.
   - Below the `lg` breakpoint the nav collapses to a hamburger that
     toggles the shared MobileDrawer (owned by PublicLayout).
   Built per prompt 05 + design-system §1/§2/§5.
   ============================================ */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Container } from '@mui/material';
import { Icon } from '@iconify/react';

import Img from '../Img';
import { mainNav } from '../../../data/navigation';
import {
  collegeInfo,
  phoneHref,
  emailHref,
} from '../../../data/collegeInfo';
import { useModal } from '../../../context/ModalContext';
import {
  trackPhoneClick,
  trackCTAClick,
  trackNavigation,
} from '../../../utils/gtm';
import styles from './Header.module.css';

const LOGO_URL = '/images/placeholders/logo-icon-commerce.svg';
const SCROLL_THRESHOLD = 24;

/** Returns true for absolute http(s) URLs (placeholder TODOs resolve to false). */
const isHttpUrl = (value) => /^https?:\/\//i.test(String(value || ''));

/* ------------------------------------------------------------------
   Desktop dropdown (About ▾ / Courses ▾) — hover + keyboard accessible.
   ------------------------------------------------------------------ */
const NavDropdown = ({ item, reduceMotion }) => {
  const [open, setOpen] = useState(false);
  const liRef = useRef(null);
  const closeTimer = useRef(null);

  const openMenu = useCallback(() => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);

  // Small delay on mouse-leave so a diagonal cursor path doesn't snap shut.
  const scheduleClose = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && open) {
      setOpen(false);
    }
  };

  // Close when focus leaves the whole item (keyboard tab-out).
  const handleBlur = (event) => {
    if (!liRef.current?.contains(event.relatedTarget)) {
      setOpen(false);
    }
  };

  const menuVariants = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 8 },
      };

  return (
    <li
      ref={liRef}
      className={styles.navItem}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <NavLink
        to={item.path}
        end={item.path === '/'}
        className={({ isActive }) =>
          `${styles.navLink} ${styles.hasChildren} ${isActive ? styles.active : ''}`
        }
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => {
          trackNavigation('desktop_nav', 'click', item.label);
          setOpen(false);
        }}
      >
        {item.label}
        <Icon
          icon="mdi:chevron-down"
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          aria-hidden="true"
        />
      </NavLink>

      <AnimatePresence>
        {open && (
          <motion.ul
            className={styles.dropdown}
            role="menu"
            aria-label={item.label}
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {item.children.map((child) => (
              <li key={child.path} role="none">
                <NavLink
                  to={child.path}
                  end
                  role="menuitem"
                  className={({ isActive }) =>
                    `${styles.dropdownLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={() => {
                    trackNavigation('desktop_nav_dropdown', 'click', child.label);
                    setOpen(false);
                  }}
                >
                  {child.label}
                </NavLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

const Header = ({ mobileMenuOpen = false, onMobileMenuToggle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { openLeadDrawer } = useModal();
  const reduceMotion = useReducedMotion();
  const { pathname } = useLocation();

  const isHome = pathname === '/';
  // Transparent only at the top of the Home hero; solid everywhere else.
  const solid = !isHome || isScrolled;

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    handleScroll(); // sync on mount / route change
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleApplyClick = () => {
    trackCTAClick('header_apply_now', 'header', 'Apply Now');
    openLeadDrawer('apply-now');
  };

  const { facebook, youtube, instagram } = collegeInfo.social;
  const socialLinks = [
    { id: 'facebook', icon: 'mdi:facebook', label: 'Facebook', url: facebook },
    { id: 'youtube', icon: 'mdi:youtube', label: 'YouTube', url: youtube },
    { id: 'instagram', icon: 'mdi:instagram', label: 'Instagram', url: instagram },
  ];

  return (
    <motion.header
      className={`${styles.header} ${solid ? styles.solid : styles.transparent} ${
        isScrolled ? styles.scrolled : ''
      }`}
      initial={reduceMotion ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Utility bar (desktop, slim, navy) ───────────────────── */}
      <div className={styles.utilityBar} aria-hidden={isScrolled}>
        <Container maxWidth="xl" className={styles.utilityInner}>
          <div className={styles.utilityLeft}>
            <span className={styles.utilityItem}>
              <Icon icon="mdi:map-marker" aria-hidden="true" />
              {collegeInfo.address.parts.line1}, {collegeInfo.address.parts.area},{' '}
              {collegeInfo.address.parts.city}
            </span>
            <a
              href={phoneHref()}
              className={styles.utilityItem}
              onClick={() => trackPhoneClick(collegeInfo.phones[0], 'header_utility')}
            >
              <Icon icon="mdi:phone" aria-hidden="true" />
              {collegeInfo.phones[0]}
            </a>
          </div>

          <div className={styles.utilityRight}>
            <a href={emailHref()} className={styles.utilityItem}>
              <Icon icon="mdi:email-outline" aria-hidden="true" />
              {collegeInfo.email}
            </a>

            <span className={styles.utilitySocials}>
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={isHttpUrl(social.url) ? social.url : '#'}
                  className={styles.socialIcon}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Icon Commerce College on ${social.label}`}
                >
                  <Icon icon={social.icon} aria-hidden="true" />
                </a>
              ))}
            </span>

            <a
              href={collegeInfo.samarthUrl}
              className={styles.samarthPill}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick('samarth_portal', 'header_utility', 'Samarth Admission Portal')}
            >
              Samarth Admission Portal
              <Icon icon="mdi:open-in-new" aria-hidden="true" />
            </a>
          </div>
        </Container>
      </div>

      {/* ── Main bar ────────────────────────────────────────────── */}
      <div className={styles.mainBar}>
        <Container maxWidth="xl" className={styles.mainInner}>
          {/* Logo + wordmark */}
          <NavLink to="/" className={styles.brand} aria-label="Icon Commerce College — Home">
            <Img
              src={LOGO_URL}
              alt="Icon Commerce College logo"
              className={styles.logo}
              width="360"
              height="96"
              priority
              fallback="logo-icon-commerce"
            />
            <span className={styles.wordmark}>
              <span className={styles.wordmarkName}>Icon Commerce College</span>
              <span className={styles.wordmarkSub}>{collegeInfo.assameseName}</span>
            </span>
          </NavLink>

          {/* Desktop navigation */}
          <nav className={styles.desktopNav} aria-label="Primary">
            <ul className={styles.navList}>
              {mainNav.map((item) =>
                item.children ? (
                  <NavDropdown key={item.label} item={item} reduceMotion={reduceMotion} />
                ) : (
                  <li key={item.label} className={styles.navItem}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `${styles.navLink} ${isActive ? styles.active : ''}`
                      }
                      onClick={() => trackNavigation('desktop_nav', 'click', item.label)}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </nav>

          {/* Right cluster: Apply Now + mobile hamburger */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.applyButton}
              onClick={handleApplyClick}
            >
              <Icon icon="mdi:school-outline" aria-hidden="true" />
              Apply Now
            </button>

            <button
              type="button"
              className={styles.menuToggle}
              onClick={onMobileMenuToggle}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <Icon icon={mobileMenuOpen ? 'mdi:close' : 'mdi:menu'} />
            </button>
          </div>
        </Container>
      </div>
    </motion.header>
  );
};

export default Header;
