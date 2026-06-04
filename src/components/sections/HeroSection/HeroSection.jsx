/* ============================================
   HeroSection — Home hero (prompt 11)
   Icon Commerce College
   --------------------------------------------
   The first impression: a navy-gradient overlay (`--gradient-hero`) over the
   `hero-campus` placeholder with a subtle, reduced-motion-safe Ken-Burns zoom.

   Left column  — eyebrow, headline, subtitle, CTAs and trust chips, revealed
                  with the centralized "shuttle" stagger (headline → subtitle →
                  CTAs → chips), guarded by `prefers-reduced-motion`.
   Right column — a floating compact <UnifiedLeadForm> (source `hero`) shown on
                  desktop; hidden below 1024px where the Apply Now CTA carries
                  lead capture (design-system §1, §2, §4, §6).
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Container from '../../common/Container/Container';
import EnquiryButton from '../../common/EnquiryButton/EnquiryButton';
import UnifiedLeadForm from '../../common/UnifiedLeadForm/UnifiedLeadForm';
import {
  useReducedMotionVariants,
  REVEAL_DURATION,
  EASE_SHUTTLE,
} from '../../../utils/motion';
import { placeholder } from '../../../utils/assets';
import { collegeInfo } from '../../../data/collegeInfo';
import styles from './HeroSection.module.css';

// Trust chips row (design-system §1/§6) — university, framework, code, programs.
const TRUST_CHIPS = [
  { icon: 'mdi:school-outline', label: 'Gauhati University' },
  { icon: 'mdi:book-education-outline', label: 'NEP 2020' },
  { icon: 'mdi:barcode', label: 'Samarth Code 842' },
  { icon: 'mdi:certificate-outline', label: '4 UG Programs' },
];

const HeroSection = () => {
  const v = useReducedMotionVariants();
  const bgUrl = placeholder('hero-campus');

  // Floating enquiry card entrance — fades in after the headline cascade.
  // Skipped entirely when the user prefers reduced motion.
  const cardMotion = v.reduced
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: REVEAL_DURATION, ease: EASE_SHUTTLE, delay: 0.3 },
      };

  return (
    <section className={styles.hero} aria-label="Welcome to Icon Commerce College">
      {/* Placeholder background image (swap via utils/assets) + Ken-Burns zoom */}
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${bgUrl})` }}
        role="img"
        aria-label="Icon Commerce College campus"
      />
      {/* Navy gradient overlay keeps the headline AA-legible over the image */}
      <div className={styles.overlay} aria-hidden="true" />

      <Container size="wide" className={styles.inner}>
        {/* Headline column — staggered "shuttle" entrance */}
        <motion.div
          className={styles.content}
          variants={v.container(0.1)}
          initial="hidden"
          animate="show"
        >
          <motion.p className={styles.eyebrow} variants={v.fadeUp}>
            Admissions Open 2026–27 · Affiliated to Gauhati University
          </motion.p>

          <motion.h1 className={styles.title} variants={v.fadeUp}>
            {collegeInfo.tagline}
          </motion.h1>

          <motion.p className={styles.subtitle} variants={v.fadeUp}>
            {collegeInfo.taglineSecondary}
            <span className={styles.estd}>Estd. 2004 · Guwahati, Assam.</span>
          </motion.p>

          <motion.div className={styles.ctas} variants={v.fadeUp}>
            <div className={styles.ctaButtons}>
              <EnquiryButton
                preset="apply-now"
                source="hero"
                variant="primary"
                size="large"
                startIcon="mdi:school-outline"
              >
                Apply Now
              </EnquiryButton>
              <EnquiryButton
                preset="prospectus"
                source="hero"
                variant="outline"
                size="large"
                startIcon="mdi:download-outline"
              >
                Download Prospectus
              </EnquiryButton>
            </div>
            <Link to="/courses" className={styles.exploreLink}>
              <span>Explore Courses</span>
              <Icon icon="mdi:arrow-right" aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.ul
            className={styles.chips}
            variants={v.fadeUp}
            aria-label="Key facts"
          >
            {TRUST_CHIPS.map((chip) => (
              <li key={chip.label} className={styles.chip}>
                <Icon icon={chip.icon} className={styles.chipIcon} aria-hidden="true" />
                <span>{chip.label}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Floating quick-enquiry card (desktop only) */}
        <motion.aside
          className={styles.enquiryCard}
          aria-label="Quick admission enquiry"
          {...cardMotion}
        >
          <span className={styles.cardBadge}>
            <Icon icon="mdi:lightning-bolt" aria-hidden="true" />
            Quick Enquiry
          </span>
          <UnifiedLeadForm
            source="hero"
            formId="hero"
            variant="default"
            compact
            submitButtonText="Enquire Now"
            showTrustBadges={false}
          />
        </motion.aside>
      </Container>
    </section>
  );
};

export default HeroSection;
