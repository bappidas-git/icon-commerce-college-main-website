/* ============================================
   WhyChoose — Home "why choose us" band (prompt 13)
   Icon Commerce College
   --------------------------------------------
   A split layout that distils the college USP into six reasons to choose ICC:
   the `hero-students` placeholder with a floating gold stat callout on the left,
   and a two-column grid of six icon "reason" cards on the right.

   Following the HighlightsSection precedent, each reason renders as plain
   icon-card markup inside <Reveal>/<RevealGroup> (rather than the motion-driven
   <IconCard>) so every animation routes through `useReducedMotionVariants()` and
   the entrance never double-animates against a card's own transform.
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';
import Section from '../../common/Section/Section';
import Img from '../../common/Img';
import { Reveal, RevealGroup } from '../../common/Reveal/Reveal';
import { placeholder } from '../../../utils/assets';
import styles from './WhyChoose.module.css';

// Six reasons distilled from facilities / USP (prompt 13 brief, design-system §6).
const REASONS = [
  {
    icon: 'mdi:certificate-outline',
    title: 'Affiliated to Gauhati University',
    blurb:
      'All four UG programmes are affiliated to Gauhati University and recognised under NEP 2020.',
  },
  {
    icon: 'mdi:book-education-outline',
    title: 'NEP 2020 Outcome-Based Curriculum',
    blurb:
      'A multidisciplinary FYUGP curriculum with flexible multiple entry and exit options.',
  },
  {
    icon: 'mdi:human-male-board',
    title: 'Experienced & Research-Active Faculty',
    blurb:
      'Learn from qualified, experienced teachers who mentor and guide every student.',
  },
  {
    icon: 'mdi:monitor-dashboard',
    title: 'Smart Classrooms & Computer Lab',
    blurb:
      'Technology-enabled smart classrooms and a modern, internet-enabled computer laboratory.',
  },
  {
    icon: 'mdi:bookshelf',
    title: 'Digital Library & Study Materials',
    blurb:
      'A well-stocked digital library with reference books, journals and structured study materials.',
  },
  {
    icon: 'mdi:hand-coin',
    title: 'Scholarships & Student Support',
    blurb:
      'Guidance for government scholarships plus dedicated academic and career support.',
  },
];

const WhyChoose = () => (
  <Section
    bg="white"
    container="wide"
    eyebrow="Why Choose Us"
    title="Reasons to choose Icon Commerce College"
    subtitle="A focused, future-ready learning environment built around our students — affiliated, outcome-driven and well-supported."
    aria-label="Why choose Icon Commerce College"
  >
    <div className={styles.split}>
      {/* Media — students placeholder with a floating gold stat callout */}
      <Reveal className={styles.media} variant="slideInLeft">
        <figure className={styles.figure}>
          <Img
            src={placeholder('hero-students')}
            alt="Students at Icon Commerce College"
            className={styles.image}
            fallback="hero-students"
          />
          <figcaption className={styles.callout}>
            <Icon
              icon="mdi:school-outline"
              className={styles.calloutIcon}
              aria-hidden="true"
            />
            <span className={styles.calloutValue}>Estd. 2004</span>
            <span className={styles.calloutLabel}>
              Affiliated to Gauhati University · NEP 2020
            </span>
          </figcaption>
        </figure>
      </Reveal>

      {/* Reasons — six icon cards in a 2-column grid */}
      <RevealGroup as="ul" className={styles.grid} stagger={0.07} amount={0.15}>
        {REASONS.map((reason) => (
          <Reveal as="li" key={reason.title} className={styles.cell} variant="fadeUp">
            <article className={styles.card}>
              <span className={styles.chip} aria-hidden="true">
                <Icon icon={reason.icon} />
              </span>
              <div className={styles.text}>
                <h3 className={styles.cardTitle}>{reason.title}</h3>
                <p className={styles.cardBlurb}>{reason.blurb}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </RevealGroup>
    </div>
  </Section>
);

export default WhyChoose;
