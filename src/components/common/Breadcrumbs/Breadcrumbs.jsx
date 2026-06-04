/* ============================================
   Breadcrumbs — schema-friendly trail
   Icon Commerce College
   --------------------------------------------
   Home icon + chevron-separated trail with gold hover. Emits
   BreadcrumbList JSON-LD (schema.org `itemListElement`) for SEO.

   Pass `items` as an array of { label, to? } — the last item is rendered
   as the current page (no link). A Home crumb is prepended automatically
   unless `includeHome={false}`.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import styles from './Breadcrumbs.module.css';

/**
 * @param {{label: string, to?: string}[]} items  Trail after Home.
 * @param {boolean} includeHome  Prepend a Home crumb (default true).
 * @param {'light'|'dark'} variant  Colour scheme (dark = over navy hero).
 * @param {boolean} jsonLd  Emit BreadcrumbList structured data (default true).
 */
const Breadcrumbs = ({
  items = [],
  includeHome = true,
  variant = 'light',
  jsonLd = true,
  className = '',
}) => {
  const crumbs = includeHome
    ? [{ label: 'Home', to: '/', home: true }, ...items]
    : items;

  if (!crumbs.length) return null;

  // Build schema.org BreadcrumbList for richer search results.
  const origin =
    typeof window !== 'undefined' && window.location ? window.location.origin : '';
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      ...(crumb.to ? { item: `${origin}${crumb.to}` } : {}),
    })),
  };

  const classNames = [styles.breadcrumbs, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={classNames} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className={styles.item}>
              {index > 0 && (
                <Icon
                  icon="mdi:chevron-right"
                  className={styles.separator}
                  aria-hidden="true"
                />
              )}
              {isLast || !crumb.to ? (
                <span className={styles.current} aria-current="page">
                  {crumb.home && (
                    <Icon icon="mdi:home" className={styles.homeIcon} aria-hidden="true" />
                  )}
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.to} className={styles.link}>
                  {crumb.home && (
                    <Icon icon="mdi:home" className={styles.homeIcon} aria-hidden="true" />
                  )}
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </nav>
  );
};

export default Breadcrumbs;
