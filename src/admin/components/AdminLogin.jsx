/* ============================================
   Admin Login Page
   ============================================
   Navy+gold branded sign-in. Validates against the env credentials
   (REACT_APP_ADMIN_USERNAME / REACT_APP_ADMIN_PASSWORD) and keeps a 24h
   localStorage session with optional remember-me, via AdminAuthContext.
   ============================================ */

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { TextField, Checkbox, CircularProgress } from '@mui/material';
import { Icon } from '@iconify/react';
import { useAdminAuth } from '../context/AdminAuthContext';
import styles from './AdminLogin.module.css';

const focusSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '&.Mui-focused fieldset': { borderColor: 'var(--admin-accent)' },
  },
};

const AdminLogin = () => {
  const { login, isAuthenticated } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 300));

    const result = login(username, password, rememberMe);
    if (!result.success) {
      setError(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            <img src="/images/placeholders/logo-icon-commerce.svg" alt="Icon Commerce College" />
          </div>
          <span className={styles.accentRule} aria-hidden="true" />
          <h1 className={styles.loginTitle}>Admin Panel</h1>
          <p className={styles.loginSubtitle}>Sign in to manage leads, notices &amp; events</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="username">
              Username
            </label>
            <TextField
              id="username"
              size="small"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              autoFocus
              sx={focusSx}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="password">
              Password
            </label>
            <TextField
              id="password"
              type="password"
              size="small"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              sx={focusSx}
            />
          </div>

          <div className={styles.rememberRow}>
            <Checkbox
              id="remember"
              size="small"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              sx={{ padding: 0, color: 'var(--admin-accent)', '&.Mui-checked': { color: 'var(--admin-accent)' } }}
            />
            <label htmlFor="remember" className={styles.rememberLabel}>
              Keep me signed in for 24 hours
            </label>
          </div>

          {error && (
            <div className={styles.errorMessage} role="alert">
              <Icon icon="mdi:alert-circle-outline" width={18} height={18} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !username || !password}
          >
            {isSubmitting ? (
              <CircularProgress size={22} sx={{ color: '#fff' }} />
            ) : (
              <>
                <Icon icon="mdi:lock-outline" width={18} height={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className={styles.loginFooter}>Authorised personnel only · Icon Commerce College, Guwahati</p>
      </div>
    </div>
  );
};

export default AdminLogin;
