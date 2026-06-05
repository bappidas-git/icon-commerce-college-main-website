/* ============================================
   Admin Layout — shell
   ============================================
   Composes the navy sidebar, the section topbar and the routed page content.
   Lazy-loads each page module and warms the shared leads cache on mount so the
   Dashboard/Leads render every submission from any device. The mobile sidebar
   drawer is opened from the topbar and closes on navigation.
   ============================================ */

import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import { syncLeadsFromServer } from '../utils/leadService';
import styles from './AdminLayout.module.css';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const LeadManagement = lazy(() => import('../pages/LeadManagement'));
const LeadDetail = lazy(() => import('../pages/LeadDetail'));
const Notices = lazy(() => import('../pages/Notices'));
const Events = lazy(() => import('../pages/Events'));
const Settings = lazy(() => import('../pages/Settings'));

const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
    <CircularProgress sx={{ color: 'var(--admin-accent)' }} />
  </Box>
);

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Warm the in-memory cache from the shared server store (the single source
    // of truth) as soon as the admin loads, so the leads modules render every
    // submission from any browser/device. Pages refresh via their own polls.
    syncLeadsFromServer().then((result) => {
      if (result.error) {
        console.warn('[Admin] Lead sync skipped:', result.error);
      } else if (result.added > 0) {
        console.log(`[Admin] Synced ${result.added} lead(s) from server`);
      }
    });
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={styles.layout}>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={styles.main}>
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className={styles.content}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="leads" element={<LeadManagement />} />
              <Route path="leads/:leadId" element={<LeadDetail />} />
              <Route path="notices" element={<Notices />} />
              <Route path="events" element={<Events />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
