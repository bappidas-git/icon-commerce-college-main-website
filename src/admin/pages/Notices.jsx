/* ============================================
   Admin Notices — module scaffold
   ============================================
   Shell page wired into the admin shell + shared UI kit. The full publishing
   workflow (create/edit/pin, PHP/JSON store) is built in prompt 29; until then
   this renders the shared header and an empty DataTable preview of the list.
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';
import { AdminPageHeader, DataTable } from '../components/ui';
import styles from './ModuleScaffold.module.css';

const columns = [
  { key: 'title', header: 'Title', sortable: true },
  { key: 'category', header: 'Category', sortable: true, width: '160px' },
  { key: 'date', header: 'Published', sortable: true, width: '150px' },
  { key: 'status', header: 'Status', width: '120px' },
];

const Notices = () => (
  <div className={styles.page}>
    <AdminPageHeader
      eyebrow="Content"
      title="Notices"
      icon="mdi:bullhorn-outline"
      subtitle="Publish admission notifications and announcements to the public Notices page."
      actions={
        <span className={styles.comingSoon}>
          <Icon icon="mdi:progress-wrench" width={16} height={16} />
          Publishing coming soon
        </span>
      }
    />

    <DataTable
      columns={columns}
      rows={[]}
      searchPlaceholder="Search notices…"
      emptyIcon="mdi:bullhorn-outline"
      emptyTitle="No notices yet"
      emptyMessage="Published notices will appear here once the Notices module is connected to its store."
    />
  </div>
);

export default Notices;
