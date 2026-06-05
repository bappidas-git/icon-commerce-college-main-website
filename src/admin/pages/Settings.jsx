/* ============================================
   Admin Settings — session & configuration
   ============================================
   Shows the current admin session and the configured data endpoints, and
   provides a confirmed sign-out. Built entirely on the shared admin UI kit
   (AdminPageHeader, StatTile, FormField, ConfirmDialog, Toast). Additional
   preferences land alongside the Settings prompt (33).
   ============================================ */

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ADMIN_NAV } from '../navItems';
import { AdminPageHeader, StatTile, FormField, ConfirmDialog, Toast, useToast } from '../components/ui';
import styles from './Settings.module.css';

const ENDPOINTS = [
  { label: 'Leads API', value: process.env.REACT_APP_LEADS_API_URL || '/api/leads.php' },
  { label: 'Notices API', value: process.env.REACT_APP_NOTICES_API_URL || '/api/notices.php' },
  { label: 'Events API', value: process.env.REACT_APP_EVENTS_API_URL || '/api/events.php' },
];

const Settings = () => {
  const { user, logout } = useAdminAuth();
  const { showToast, toastProps } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCopy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast(`${label} endpoint copied`, 'success');
    } catch {
      showToast('Could not copy to clipboard', 'error');
    }
  };

  return (
    <div className={styles.page}>
      <AdminPageHeader
        eyebrow="Account"
        title="Settings"
        icon="mdi:cog-outline"
        subtitle="Your admin session and the configured data endpoints. More preferences arrive as modules are added."
      />

      <div className={styles.stats}>
        <StatTile icon="mdi:account-check-outline" value={user?.username || 'Admin'} label="Signed in as" tone="navy" />
        <StatTile icon="mdi:clock-outline" value="24h" label="Session length" tone="gold" />
        <StatTile icon="mdi:view-grid-outline" value={ADMIN_NAV.length} label="Admin sections" tone="green" />
      </div>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Account</h2>
        <FormField label="Username" htmlFor="settings-username" hint="Configured via REACT_APP_ADMIN_USERNAME.">
          <input id="settings-username" type="text" value={user?.username || 'admin'} readOnly disabled />
        </FormField>
        <button type="button" className={styles.dangerBtn} onClick={() => setConfirmOpen(true)}>
          <Icon icon="mdi:logout" width={18} height={18} />
          Sign out
        </button>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Data endpoints</h2>
        <p className={styles.cardLead}>
          Leads, notices and events sync through these shared server stores (the single source of truth).
        </p>
        <div className={styles.endpoints}>
          {ENDPOINTS.map((ep) => (
            <FormField key={ep.label} label={ep.label}>
              <div className={styles.endpointRow}>
                <input type="text" value={ep.value} readOnly />
                <button
                  type="button"
                  className={styles.copyBtn}
                  onClick={() => handleCopy(ep.label, ep.value)}
                  aria-label={`Copy ${ep.label} endpoint`}
                >
                  <Icon icon="mdi:content-copy" width={16} height={16} />
                </button>
              </div>
            </FormField>
          ))}
        </div>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Sign out?"
        message="You'll need to sign in again to access the admin panel."
        confirmLabel="Sign out"
        tone="danger"
        onConfirm={logout}
        onClose={() => setConfirmOpen(false)}
      />

      <Toast {...toastProps} />
    </div>
  );
};

export default Settings;
