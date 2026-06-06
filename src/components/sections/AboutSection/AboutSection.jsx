/* ============================================
   AboutSection — Home "who we are" teaser (prompt 12)
   Icon Commerce College
   --------------------------------------------
   A two-column storytelling band: the `about-college-building` placeholder
   (with a gold "Estd. 2004" badge) on the left and a condensed College Profile
   on the right — eyebrow, heading, 2–3 short prospectus-sourced paragraphs,
   four bullet ticks and a "Learn More" link to /about.

   The media slides in from the left while the copy reveals as a centralized
   "shuttle" stagger; both route through `useReducedMotionVariants()` (via
   <Reveal>/<RevealGroup>) so motion collapses to static when reduced motion is
   preferred (design-system §4/§6).
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Container from '../../common/Container/Container';
import Img from '../../common/Img';
import { Reveal, RevealGroup } from '../../common/Reveal/Reveal';
import { placeholder } from '../../../utils/assets';
import { collegeInfo } from '../../../data/collegeInfo';
import styles from './AboutSection.module.css';

// Bullet ticks — each fact is drawn from the design-system profile (§1/§6).
const TICKS = [
  'Affiliated to Gauhati University · NEP 2020 FYUGP',
  '4 UG programmes — B.Com · BBA · BCA · B.A.',
  'Qualified & experienced faculty',
  'Smart classrooms, digital library & computer lab',
];

const AboutSection = () => (
  <section className={styles.about} aria-labelledby="about-heading">
    <Container>
      <div className={styles.grid}>
        {/* Media — campus building placeholder with a gold "Estd." badge */}
        <Reveal className={styles.media} variant="slideInLeft">
          <figure className={styles.figure}>
            <Img
              src={placeholder('about-college-building')}
              alt="Icon Commerce College campus building"
              className={styles.image}
              fallback="about-college-building"
            />
            <figcaption className={styles.badge}>
              <span className={styles.badgeLabel}>Estd.</span>
              {collegeInfo.established}
            </figcaption>
          </figure>
        </Reveal>

        {/* Copy — "shuttle" cascade of eyebrow → heading → paragraphs → ticks → CTA */}
        <RevealGroup className={styles.text} stagger={0.08} amount={0.25}>
          <Reveal as="p" className={styles.eyebrow} variant="fadeUp">
            About the College
          </Reveal>

          <Reveal as="h2" id="about-heading" className={styles.heading} variant="fadeUp">
            A legacy of quality higher education in Guwahati
          </Reveal>

          <Reveal className={styles.copy} variant="fadeUp">
            <p>
              Established in {collegeInfo.established} under the {collegeInfo.trust},
              Icon Commerce College is a Commerce, Arts &amp; Computer Application
              college in the heart of Guwahati, affiliated to{' '}
              {collegeInfo.affiliation} under the {collegeInfo.affiliationNote} framework.
            </p>
            <p>
              The college offers four undergraduate programmes — B.Com, BBA, BCA and
              B.A. — guided by qualified and experienced faculty, with smart
              classrooms, a digital library, a computer lab and structured study
              materials supporting every learner.
            </p>
            <p>
              Regular seminars and online classes, together with a steady focus on
              character alongside academics, help our students grow into confident,
              industry-ready graduates.
            </p>
          </Reveal>

          <Reveal as="ul" className={styles.ticks} variant="fadeUp">
            {TICKS.map((tick) => (
              <li key={tick} className={styles.tick}>
                <Icon icon="mdi:check-circle" className={styles.tickIcon} aria-hidden="true" />
                <span>{tick}</span>
              </li>
            ))}
          </Reveal>

          <Reveal className={styles.ctaRow} variant="fadeUp">
            <Link to="/about" className={styles.cta}>
              <span>Learn More</span>
              <Icon icon="mdi:arrow-right" aria-hidden="true" />
            </Link>
          </Reveal>
        </RevealGroup>
      </div>
    </Container>
  </section>
);

export default AboutSection;
