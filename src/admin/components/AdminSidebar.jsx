/* ============================================
   Admin Sidebar — primary navigation
   ============================================
   Navy sidebar with a gold active indicator. A fixed column on desktop and an
   off-canvas drawer (with overlay) on tablet/mobile, toggled from the topbar.
   ============================================ */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ADMIN_NAV } from '../navItems';
import styles from './AdminSidebar.module.css';

const AdminSidebar = ({ open, onClose }) => (
  <>
    {/* Mobile overlay */}
    <div
      className={`${styles.overlay} ${open ? styles.overlayVisible : ''}`}
      onClick={onClose}
      aria-hidden="true"
    />

    <aside
      className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}
      aria-label="Admin navigation"
    >
      {/* Brand */}
      <div className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true">
          IC
        </span>
        <span className={styles.brandText}>
          <span className={styles.brandName}>Icon Commerce</span>
          <span className={styles.brandSub}>College Admin</span>
        </span>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
          <Icon icon="mdi:close" width={22} height={22} />
        </button>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
          >
            <span className={styles.navIcon} aria-hidden="true">
              <Icon icon={item.icon} width={20} height={20} />
            </span>
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <p className={styles.footerName}>Icon Commerce College</p>
        <p className={styles.footerMeta}>Admin Panel · v1.0</p>
      </div>
    </aside>
  </>
);

export default AdminSidebar;
