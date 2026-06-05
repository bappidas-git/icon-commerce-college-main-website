/* ============================================
   Admin Navigation — Single Source of Truth
   ============================================
   The sidebar renders these links and the topbar derives the current
   section title from the same list, so navigation and the page heading
   can never drift. The legacy CIT ad-tech admin modules were removed in
   the rebuild — these five are the complete admin surface.
   ============================================ */

export const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: 'mdi:view-dashboard-outline', end: true },
  { label: 'Leads', to: '/admin/leads', icon: 'mdi:account-group-outline' },
  { label: 'Notices', to: '/admin/notices', icon: 'mdi:bullhorn-outline' },
  { label: 'Events', to: '/admin/events', icon: 'mdi:calendar-star-outline' },
  { label: 'Settings', to: '/admin/settings', icon: 'mdi:cog-outline' },
];

/**
 * Resolve the active section's label from a pathname. Uses a longest-prefix
 * match so nested routes (e.g. `/admin/leads/:leadId`) still resolve to their
 * parent section ("Leads"). Falls back to "Admin".
 */
export const getActiveSection = (pathname = '') => {
  const match = [...ADMIN_NAV]
    .sort((a, b) => b.to.length - a.to.length)
    .find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`));
  return match ? match.label : 'Admin';
};
