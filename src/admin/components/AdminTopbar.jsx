/* ============================================
   Admin Topbar — section header & account bar
   ============================================
   Sits above the page content alongside the sidebar. Shows the college name,
   the current section title (derived from the route), a "View site" link, the
   logged-in user and logout. On tablet/mobile it exposes the hamburger that
   opens the sidebar drawer.
   ============================================ */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { getActiveSection } from '../navItems';
import styles from './AdminTopbar.module.css';

const AdminTopbar = ({ onMenuClick }) => {
  const { user, logout } = useAdminAuth();
  const { pathname } = useLocation();
  const section = getActiveSection(pathname);
  const username = user?.username || 'Admin';
  const initials = username.charAt(0).toUpperCase();

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.hamburger}
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Icon icon="mdi:menu" width={24} height={24} />
        </button>
        <div className={styles.titleBlock}>
          <span className={styles.eyebrow}>Icon Commerce College</span>
          <h1 className={styles.section}>{section}</h1>
        </div>
      </div>

      <div className={styles.right}>
        <a
          className={styles.viewSite}
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon icon="mdi:open-in-new" width={16} height={16} />
          <span className={styles.viewSiteLabel}>View site</span>
        </a>

        <span className={styles.divider} aria-hidden="true" />

        <div className={styles.user}>
          <span className={styles.avatar} aria-hidden="true">
            {initials}
          </span>
          <span className={styles.username}>{username}</span>
        </div>

        <button type="button" className={styles.logout} onClick={logout}>
          <Icon icon="mdi:logout" width={16} height={16} />
          <span className={styles.logoutLabel}>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;
