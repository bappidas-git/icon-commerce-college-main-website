/* ============================================
   ProgramsSection — Home programs teaser (prompt 13)
   Icon Commerce College
   --------------------------------------------
   Showcases the four undergraduate programmes (B.Com · BBA · BCA · B.A.) from
   `coursesData` in a responsive 1/2/4-column grid of <ProgramCard>s, beneath a
   gold-eyebrow SectionTitle. A "View All Programs" link closes the section out
   to /courses.

   The grid reveals as the centralized "shuttle" stagger via <RevealGroup>; each
   card's hover lift + gold accent are CSS-only (in ProgramCard) so they don't
   fight the entrance transform. All motion is reduced-motion safe.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Section from '../../common/Section/Section';
import { Reveal, RevealGroup } from '../../common/Reveal/Reveal';
import ProgramCard from './ProgramCard';
import { coursesData } from '../../../data/coursesData';
import styles from './ProgramsSection.module.css';

const ProgramsSection = () => (
  <Section
    bg="light"
    container="wide"
    eyebrow="Programs"
    title="Undergraduate Programs (NEP 2020)"
    subtitle="Four UG programmes under the FYUGP framework, affiliated to Gauhati University — choose the path that fits your goals."
    aria-label="Undergraduate programs"
  >
    <RevealGroup className={styles.grid} stagger={0.08} amount={0.15}>
      {coursesData.map((course) => (
        <Reveal key={course.slug} className={styles.cell} variant="fadeUp">
          <ProgramCard course={course} />
        </Reveal>
      ))}
    </RevealGroup>

    <Reveal className={styles.footer} variant="fadeUp">
      <Link to="/courses" className={styles.viewAll}>
        <span>View All Programs</span>
        <Icon icon="mdi:arrow-right" aria-hidden="true" />
      </Link>
    </Reveal>
  </Section>
);

export default ProgramsSection;
