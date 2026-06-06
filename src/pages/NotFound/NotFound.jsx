/* ============================================
   NotFound (404) — page
   Icon Commerce College
   --------------------------------------------
   Friendly 404 with a navy hero, a "Back to Home"
   CTA and a few suggested links. Also rendered by
   CourseDetail for unknown course slugs. The richer
   error-state treatment lands in prompt 35.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import useSeo from '../../components/common/SEO/useSeo';
import styles from './NotFound.module.css';

// A small set of helpful destinations for a lost visitor.
const SUGGESTED_LINKS = [
  { label: 'Courses', path: '/courses' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Notices', path: '/notices' },
  { label: 'Contact', path: '/contact' },
];

const NotFound = () => {
  // Resolves to the 404 SEO defaults for any unknown path (title + noindex).
  // Also covers the CourseDetail unknown-slug case, which renders <NotFound/>.
  useSeo();

  return (
    <main id="main-content" className={styles.notFound}>
      <div className={styles.inner}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.message}>
          Sorry, the page you are looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back on track.
        </p>

        <Link to="/" className={styles.homeBtn}>
          <Icon icon="mdi:home-outline" className={styles.homeBtnIcon} />
          <span>Back to Home</span>
        </Link>

        <div className={styles.suggested}>
          <p className={styles.suggestedLabel}>Or try one of these</p>
          <ul className={styles.suggestedList}>
            {SUGGESTED_LINKS.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className={styles.suggestedLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
