/* ============================================
   Toast — shared admin UI
   ============================================
   Thin wrapper over MUI Snackbar + Alert for transient feedback
   ("Lead deleted", "Notice published", "Copied"). Use the controlled
   <Toast/> directly, or the `useToast()` hook for local state.
   ============================================ */

import React, { useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const Toast = ({
  open,
  message,
  severity = 'success',
  duration = 3000,
  onClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
}) => (
  <Snackbar open={open} autoHideDuration={duration} onClose={onClose} anchorOrigin={anchorOrigin}>
    <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%', borderRadius: '10px' }}>
      {message}
    </Alert>
  </Snackbar>
);

/**
 * Local toast state helper. Returns the props to spread onto <Toast/> plus a
 * `showToast(message, severity)` trigger.
 */
export const useToast = () => {
  const [state, setState] = useState({ open: false, message: '', severity: 'success' });

  const showToast = useCallback((message, severity = 'success') => {
    setState({ open: true, message, severity });
  }, []);

  const closeToast = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  return {
    showToast,
    toastProps: { ...state, onClose: closeToast },
  };
};

export default Toast;
