/* ============================================
   StatsSection — Home animated stats band (prompt 12)
   Icon Commerce College
   --------------------------------------------
   A navy band of gold count-up figures sourced from `statsData` (design-system
   §6). Numeric stats reuse the shared <AnimatedCounter>, which counts up the
   first time it scrolls into view and — being reduced-motion aware — shows the
   final value instantly when `prefers-reduced-motion` is set. Non-numeric stats
   (e.g. "Gauhati University", "1000s") render as static gold text since there is
   nothing to count.
   ============================================ */

import React from 'react';
import Section from '../../common/Section/Section';
import { Reveal, RevealGroup } from '../../common/Reveal/Reveal';
import AnimatedCounter from '../../common/AnimatedCounter/AnimatedCounter';
import { statsData } from '../../../data/statsData';
import styles from './StatsSection.module.css';

const StatsSection = () => (
  <Section
    bg="navy"
    container="wide"
    eyebrow="By the Numbers"
    title="Icon Commerce College at a glance"
    subtitle="Nurturing Commerce, Arts and Computer Application graduates in Guwahati since 2004."
    aria-label="College statistics"
  >
    <RevealGroup className={styles.grid} stagger={0.08} amount={0.3}>
      {statsData.map((stat) => {
        const isNumeric = typeof stat.value === 'number';
        // "Since 2004" is a calendar year — render it ungrouped (no thousands comma);
        // every other numeric stat is < 1000 so grouping is a no-op anyway.
        const isYear = /since/i.test(stat.prefix || '');

        return (
          <Reveal as="figure" key={stat.label} className={styles.cell} variant="fadeUp">
            {isNumeric ? (
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix || ''}
                suffix={stat.suffix || ''}
                color="gold"
                duration={2}
                separator={isYear ? '' : ','}
              />
            ) : (
              <span className={styles.display}>{stat.display}</span>
            )}
            <figcaption className={styles.label}>{stat.label}</figcaption>
          </Reveal>
        );
      })}
    </RevealGroup>
  </Section>
);

export default StatsSection;
