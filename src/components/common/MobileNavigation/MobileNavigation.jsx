/* ============================================
   MobileNavigation — Icon Commerce College
   --------------------------------------------
   Sticky bottom navigation bar for small screens:
   Home · Courses · Apply (centre warm-red CTA) · Notices · Menu.
   Route links use NavLink with a gold active state; "Apply" opens
   the lead drawer and "Menu" toggles the MobileDrawer. Built per
   prompt 05.
   ============================================ */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { trackCTAClick, trackNavigation } from '../../../utils/gtm';
import styles from './MobileNavigation.module.css';

const links = [
  { id: 'home', label: 'Home', icon: 'mdi:home-outline', path: '/', end: true },
  { id: 'courses', label: 'Courses', icon: 'mdi:book-open-variant', path: '/courses', end: false },
  { id: 'notices', label: 'Notices', icon: 'mdi:bullhorn-outline', path: '/notices', end: false },
];

const MobileNavigation = ({ onEnquiryClick, onMenuClick, isDrawerOpen = false }) => {
  const linkClass = ({ isActive }) =>
    `${styles.navItem} ${isActive ? styles.active : ''}`;

  const handleApply = () => {
    trackCTAClick('mobile_bottom_apply', 'mobile_nav', 'Apply');
    if (onEnquiryClick) onEnquiryClick();
  };

  return (
    <nav className={styles.bottomNav} aria-label="Mobile bottom navigation">
      <NavLink
        to={links[0].path}
        end={links[0].end}
        className={linkClass}
        onClick={() => trackNavigation('mobile_bottom_nav', 'click', links[0].label)}
      >
        <Icon icon={links[0].icon} className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>{links[0].label}</span>
      </NavLink>

      <NavLink
        to={links[1].path}
        end={links[1].end}
        className={linkClass}
        onClick={() => trackNavigation('mobile_bottom_nav', 'click', links[1].label)}
      >
        <Icon icon={links[1].icon} className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>{links[1].label}</span>
      </NavLink>

      {/* Centre CTA — Apply */}
      <button type="button" className={styles.applyItem} onClick={handleApply} aria-label="Apply for admission">
        <span className={styles.applyCircle}>
          <Icon icon="mdi:school" aria-hidden="true" />
        </span>
        <span className={styles.applyLabel}>Apply</span>
      </button>

      <NavLink
        to={links[2].path}
        end={links[2].end}
        className={linkClass}
        onClick={() => trackNavigation('mobile_bottom_nav', 'click', links[2].label)}
      >
        <Icon icon={links[2].icon} className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>{links[2].label}</span>
      </NavLink>

      <button
        type="button"
        className={`${styles.navItem} ${isDrawerOpen ? styles.active : ''}`}
        onClick={onMenuClick}
        aria-label="Open menu"
        aria-expanded={isDrawerOpen}
      >
        <Icon
          icon={isDrawerOpen ? 'mdi:close' : 'mdi:menu'}
          className={styles.icon}
          aria-hidden="true"
        />
        <span className={styles.label}>Menu</span>
      </button>
    </nav>
  );
};

export default MobileNavigation;
