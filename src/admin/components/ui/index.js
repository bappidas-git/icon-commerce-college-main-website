/* ============================================
   Shared Admin UI Kit — barrel export
   ============================================
   Small reusable building blocks shared by the Leads, Notices, Events and
   Settings modules so every admin surface stays consistent. Import from here:
     import { AdminPageHeader, DataTable, StatTile } from '../components/ui';
   ============================================ */

export { default as AdminPageHeader } from './AdminPageHeader';
export { default as StatTile } from './StatTile';
export { default as DataTable } from './DataTable';
export { default as ConfirmDialog } from './ConfirmDialog';
export { default as FormField } from './FormField';
export { default as Toast, useToast } from './Toast';
