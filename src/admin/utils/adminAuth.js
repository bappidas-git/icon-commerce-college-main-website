/* ============================================
   Admin Auth Helper Functions
   ============================================ */

const AUTH_STORAGE_KEY = 'admin_auth';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get stored auth data from localStorage
 */
export const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);
    const now = Date.now();

    // Check session expiry
    if (data.expiresAt && now > data.expiresAt) {
      clearStoredAuth();
      return null;
    }

    return data;
  } catch {
    clearStoredAuth();
    return null;
  }
};

/**
 * Store auth data in localStorage
 */
export const setStoredAuth = (username, role, rememberMe = false) => {
  const data = {
    username,
    role,
    token: generateToken(),
    loginTime: Date.now(),
    expiresAt: Date.now() + SESSION_TIMEOUT,
    rememberMe,
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  return data;
};

/**
 * Clear auth data from localStorage
 */
export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

/**
 * Admin accounts. The default super-admin (env-configurable) has the full
 * admin surface; the management account can run the day-to-day site but is
 * barred from the Settings module — both the sidebar item and the page are
 * gated by role (see navItems.js / AdminLayout / AdminSidebar).
 */
const ADMIN_USERS = [
  {
    username: process.env.REACT_APP_ADMIN_USERNAME || 'admin',
    password: process.env.REACT_APP_ADMIN_PASSWORD || 'icc@2026',
    role: 'superadmin',
  },
  {
    username: 'icc@management',
    password: 'iCC@mgmt2026',
    role: 'manager',
  },
];

/**
 * Validate credentials against the configured admin accounts.
 * @returns {{username: string, role: string}|null} the matched account (without
 *   its password) on success, or null when the credentials don't match.
 */
export const validateCredentials = (username, password) => {
  const match = ADMIN_USERS.find(
    (user) => user.username === username && user.password === password,
  );
  return match ? { username: match.username, role: match.role } : null;
};

/**
 * Generate a simple session token
 */
const generateToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
};
