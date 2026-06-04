/* ============================================
   PageHero — inner-page hero
   Icon Commerce College
   --------------------------------------------
   The shared hero used by every non-home page: a navy gradient laid over a
   labelled placeholder background image, with an optional breadcrumb, an
   eyebrow label, the page title + subtitle and an optional CTA.

   Backward compatible with the Phase 0.4 placeholder: pages that pass only
   `eyebrow` / `title` / `subtitle` keep working unchanged.

   Props:
     title       (string)  — required page title (h1)
     subtitle    (node)    — supporting copy
     eyebrow     (string)  — gold uppercase label above the title
     image       (string)  — placeholder name (e.g. 'about-campus-aerial')
     breadcrumb  (array)   — [{ label, to? }] passed to <Breadcrumbs/>
     cta         (node|obj)— React node, or { label, onClick?, href?, variant? }
     align       'left'|'center'  — content alignment (default 'left')
     children    (node)    — optional extra content rendered under the title
                             (e.g. a meta-pill row on course detail pages)
   ============================================ */

import React from 'react';
import Container from '../Container/Container';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Button from '../Button/Button';
import { placeholder } from '../../../utils/assets';
import styles from './PageHero.module.css';

const PageHero = ({
  title,
  subtitle,
  eyebrow,
  image = 'hero-campus',
  breadcrumb = [],
  cta = null,
  align = 'left',
  children = null,
}) => {
  const bgUrl = placeholder(image);

  // Allow `cta` to be a plain config object or any React node.
  const renderCta = () => {
    if (!cta) return null;
    if (React.isValidElement(cta)) return cta;
    if (typeof cta === 'object' && cta.label) {
      return (
        <Button
          variant={cta.variant || 'primary'}
          size="large"
          onClick={cta.onClick}
          href={cta.href}
          startIcon={cta.icon}
        >
          {cta.label}
        </Button>
      );
    }
    return null;
  };

  return (
    <section
      className={`${styles.hero} ${styles[`align-${align}`]}`}
      aria-label={title}
    >
      {/* Placeholder background image (swap via utils/assets) */}
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${bgUrl})` }}
        role="img"
        aria-label={`${title} — background`}
      />
      {/* Navy gradient overlay for legibility */}
      <div className={styles.overlay} aria-hidden="true" />

      <Container className={styles.inner}>
        {breadcrumb && breadcrumb.length > 0 && (
          <Breadcrumbs items={breadcrumb} variant="dark" className={styles.crumbs} />
        )}
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {children && <div className={styles.extra}>{children}</div>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {cta && <div className={styles.cta}>{renderCta()}</div>}
      </Container>
    </section>
  );
};

export default PageHero;
