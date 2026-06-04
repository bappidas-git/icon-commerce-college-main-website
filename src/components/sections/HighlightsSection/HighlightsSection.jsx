/* ============================================
   HighlightsSection — quick highlights strip (prompt 11)
   Icon Commerce College
   --------------------------------------------
   A thin strip of four icon highlights sitting directly under the hero. Each
   item is an icon card with a gold chip and a hover lift; the row reveals with
   the centralized "shuttle" stagger (reduced-motion safe via <RevealGroup>).

   The entrance animation lives on the outer <Reveal> wrapper while the hover
   lift is pure CSS on the inner card, so the two never fight over `transform`.
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';
import Container from '../../common/Container/Container';
import { Reveal, RevealGroup } from '../../common/Reveal/Reveal';
import styles from './HighlightsSection.module.css';

// Four quick highlights (design-system §1/§6).
const HIGHLIGHTS = [
  {
    icon: 'mdi:book-education-outline',
    title: 'NEP 2020 FYUGP',
    blurb: 'Four-year UG framework with flexible multiple exit options.',
  },
  {
    icon: 'mdi:school-outline',
    title: '4 UG Programs',
    blurb: 'B.Com · BBA · BCA · B.A. affiliated to Gauhati University.',
  },
  {
    icon: 'mdi:account-tie-outline',
    title: 'Experienced Faculty',
    blurb: 'Qualified, mentoring teachers across 18+ departments.',
  },
  {
    icon: 'mdi:office-building-outline',
    title: 'Modern Campus & Labs',
    blurb: 'Smart classrooms, computer lab, digital library & Wi-Fi.',
  },
];

const HighlightsSection = () => (
  <section className={styles.highlights} aria-label="Why Icon Commerce College">
    <Container size="wide">
      <RevealGroup className={styles.grid} stagger={0.08} amount={0.2}>
        {HIGHLIGHTS.map((item) => (
          <Reveal key={item.title} className={styles.cell} variant="fadeUp">
            <article className={styles.card}>
              <span className={styles.chip} aria-hidden="true">
                <Icon icon={item.icon} />
              </span>
              <div className={styles.text}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.blurb}>{item.blurb}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </RevealGroup>
    </Container>
  </section>
);

export default HighlightsSection;
