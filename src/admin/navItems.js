/* ============================================
   Admin Navigation — Single Source of Truth
   ============================================
   The sidebar renders these links and the topbar derives the current
   section title from the same list, so navigation and the page heading
   can never drift. The legacy ad-tech admin modules were removed in the
   rebuild — these five are the complete admin surface.
   ============================================ */

export const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: 'mdi:view-dashboard-outline', end: true },
  { label: 'Leads', to: '/admin/leads', icon: 'mdi:account-group-outline' },
  { label: 'Notices', to: '/admin/notices', icon: 'mdi:bullhorn-outline' },
  { label: 'Events', to: '/admin/events', icon: 'mdi:calendar-star-outline' },
  { label: 'Settings', to: '/admin/settings', icon: 'mdi:cog-outline', module: 'settings' },
];

/**
 * Roles barred from the Settings module — both the sidebar item AND the page.
 * The management account (`icc@management`) runs the day-to-day site but cannot
 * reach account/settings; a missing role (legacy super-admin session) keeps
 * full access.
 */
const SETTINGS_DENIED_ROLES = ['manager'];

/** Whether a role may open the Settings module (sidebar item + page). */
export const canAccessSettings = (role) => !SETTINGS_DENIED_ROLES.includes(role);

/** The admin nav filtered to the items a given role is allowed to see. */
export const navForRole = (role) =>
  ADMIN_NAV.filter((item) => item.module !== 'settings' || canAccessSettings(role));

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
