/* ============================================
   ConfirmDialog — shared admin UI
   ============================================
   Promise-free confirmation modal for destructive or important actions
   (delete lead, publish/unpublish notice, sign out, etc.). Built on MUI
   Dialog, styled to the admin navy+gold palette.
   ============================================ */

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { Icon } from '@iconify/react';

const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger', // 'danger' | 'primary'
  loading = false,
  onConfirm,
  onClose,
}) => {
  const isDanger = tone === 'danger';
  const accent = isDanger ? 'var(--admin-cta, #E0301E)' : 'var(--admin-primary, #1A2A52)';

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: '16px', padding: '4px' } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          fontFamily: "var(--font-heading, 'Poppins', sans-serif)",
          fontWeight: 700,
          color: 'var(--admin-text-primary, #14233D)',
        }}
      >
        <Icon
          icon={isDanger ? 'mdi:alert-circle-outline' : 'mdi:help-circle-outline'}
          width={24}
          height={24}
          color={accent}
        />
        {title}
      </DialogTitle>

      {message && (
        <DialogContent>
          <DialogContentText sx={{ color: 'var(--admin-text-secondary, #5B6678)', fontSize: '0.92rem' }}>
            {message}
          </DialogContentText>
        </DialogContent>
      )}

      <DialogActions sx={{ padding: '12px 24px 20px', gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            color: 'var(--admin-text-secondary, #5B6678)',
            borderRadius: '10px',
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          disableElevation
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            backgroundColor: accent,
            '&:hover': { backgroundColor: isDanger ? 'var(--admin-cta-dark, #B91E10)' : 'var(--admin-primary-dark, #111d3a)' },
          }}
        >
          {loading ? 'Working…' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
