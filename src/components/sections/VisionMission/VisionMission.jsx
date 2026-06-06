/* ============================================
   VisionMissionSection — Home vision & mission (prompt 12)
   Icon Commerce College
   --------------------------------------------
   Two gold-accented cards (Vision + Mission) built around the prospectus
   Principal/President messaging — excellence, holistic development, moral
   integrity and industry readiness (design-system §6). The `vision-mission`
   placeholder sits alongside the cards as a side accent on desktop.

   Cards reveal as a "shuttle" stagger and the accent image slides in from the
   right; both are reduced-motion safe via <Reveal>/<RevealGroup>.
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';
import Section from '../../common/Section/Section';
import Img from '../../common/Img';
import { Reveal, RevealGroup } from '../../common/Reveal/Reveal';
import { placeholder } from '../../../utils/assets';
import styles from './VisionMission.module.css';

// Mission commitments — each tied to a prospectus-sanctioned theme (§6).
const MISSION_POINTS = [
  'Impart quality, value-based education in Commerce, Arts & Computer Application.',
  'Foster the holistic development of every student — intellect, skills and character.',
  'Instil moral integrity, discipline and social responsibility.',
  'Prepare industry-ready graduates for careers, higher studies and entrepreneurship.',
];

const VisionMissionSection = () => (
  <Section
    bg="white"
    container="default"
    eyebrow="Our Guiding Principles"
    title="Vision & Mission"
    subtitle="The values that shape every Icon Commerce College graduate."
    aria-label="Vision and mission"
  >
    <div className={styles.layout}>
      <RevealGroup className={styles.cards} stagger={0.1} amount={0.2}>
        {/* Vision */}
        <Reveal className={styles.card} variant="fadeUp">
          <span className={styles.icon} aria-hidden="true">
            <Icon icon="mdi:eye-outline" />
          </span>
          <h3 className={styles.cardTitle}>Our Vision</h3>
          <p className={styles.cardText}>
            To be a center of excellence in higher education — empowering students
            with knowledge, character and confidence, and nurturing morally upright,
            socially responsible citizens who lead with integrity.
          </p>
        </Reveal>

        {/* Mission */}
        <Reveal className={styles.card} variant="fadeUp">
          <span className={styles.icon} aria-hidden="true">
            <Icon icon="mdi:flag-outline" />
          </span>
          <h3 className={styles.cardTitle}>Our Mission</h3>
          <ul className={styles.missionList}>
            {MISSION_POINTS.map((point) => (
              <li key={point} className={styles.missionItem}>
                <Icon icon="mdi:check-circle" className={styles.missionIcon} aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </RevealGroup>

      {/* Side accent image (desktop) */}
      <Reveal className={styles.media} variant="slideInRight">
        <Img
          src={placeholder('vision-mission')}
          alt="Icon Commerce College — vision and mission"
          className={styles.image}
          fallback="vision-mission"
        />
      </Reveal>
    </div>
  </Section>
);

export default VisionMissionSection;
