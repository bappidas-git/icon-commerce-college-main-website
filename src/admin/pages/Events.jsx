/* ============================================
   Admin Events — module scaffold
   ============================================
   Shell page wired into the admin shell + shared UI kit. The full events
   workflow + calendar (PHP/JSON store) is built in prompt 31; until then this
   renders the shared header and an empty DataTable preview of the list.
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';
import { AdminPageHeader, DataTable } from '../components/ui';
import styles from './ModuleScaffold.module.css';

const columns = [
  { key: 'title', header: 'Event', sortable: true },
  { key: 'date', header: 'Date', sortable: true, width: '160px' },
  { key: 'venue', header: 'Venue', sortable: true, width: '180px' },
  { key: 'status', header: 'Status', width: '120px' },
];

const Events = () => (
  <div className={styles.page}>
    <AdminPageHeader
      eyebrow="Content"
      title="Events"
      icon="mdi:calendar-star-outline"
      subtitle="Schedule college events and surface them on the public Events page and calendar."
      actions={
        <span className={styles.comingSoon}>
          <Icon icon="mdi:progress-wrench" width={16} height={16} />
          Scheduling coming soon
        </span>
      }
    />

    <DataTable
      columns={columns}
      rows={[]}
      searchPlaceholder="Search events…"
      emptyIcon="mdi:calendar-star-outline"
      emptyTitle="No events yet"
      emptyMessage="Scheduled events will appear here once the Events module is connected to its store."
    />
  </div>
);

export default Events;
