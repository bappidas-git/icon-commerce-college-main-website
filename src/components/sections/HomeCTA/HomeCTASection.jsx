/* ============================================
   HomeCTASection — Home closing call-to-action band (prompt 14)
   Icon Commerce College
   --------------------------------------------
   A full-width navy band with a gold accent glow that closes the Home page:
   a single warm-red primary action ("Apply Now") alongside a gold-outline
   "Download Prospectus" and a tertiary link out to the Samarth admission
   portal (College Code 842). Apply / Prospectus open the global lead drawer
   in the matching context (design-system §8); Samarth opens externally.

   Per the design system, the band keeps exactly ONE primary (warm-red) action;
   gold is used only for the accent glow and the secondary outline. The content
   reveals as a centralized "shuttle" stagger (reduced-motion safe).
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';
import Container from '../../common/Container/Container';
import Button from '../../common/Button/Button';
import { Reveal, RevealGroup } from '../../common/Reveal/Reveal';
import { useModal } from '../../../context/ModalContext';
import { collegeInfo } from '../../../data/collegeInfo';
import styles from './HomeCTASection.module.css';

const HomeCTASection = () => {
  const { openLeadDrawer } = useModal();

  return (
    <section className={styles.cta} aria-labelledby="home-cta-heading">
      <span className={styles.glow} aria-hidden="true" />
      <Container size="default">
        <RevealGroup className={styles.inner} stagger={0.08} amount={0.3}>
          <Reveal as="p" className={styles.eyebrow} variant="fadeUp">
            Admissions 2026 Open
          </Reveal>

          <Reveal as="h2" id="home-cta-heading" className={styles.heading} variant="fadeUp">
            Begin your journey at Icon Commerce College
          </Reveal>

          <Reveal as="p" className={styles.subtitle} variant="fadeUp">
            Take the first step towards a Gauhati University degree under NEP 2020.
            Apply now or download the prospectus — our admission team will guide
            you through every step.
          </Reveal>

          <Reveal className={styles.actions} variant="fadeUp">
            <Button
              variant="primary"
              size="large"
              startIcon="mdi:school-outline"
              onClick={() => openLeadDrawer('apply-now', { source: 'home-cta' })}
            >
              Apply Now
            </Button>
            <Button
              variant="outline"
              size="large"
              startIcon="mdi:file-download-outline"
              onClick={() => openLeadDrawer('prospectus', { source: 'home-cta' })}
            >
              Download Prospectus
            </Button>
          </Reveal>

          <Reveal className={styles.samarthRow} variant="fadeUp">
            <a
              className={styles.samarth}
              href={collegeInfo.samarthUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="mdi:open-in-new" aria-hidden="true" />
              <span>
                Register on the Samarth portal · College Code{' '}
                <strong>{collegeInfo.samarthCode}</strong>
              </span>
            </a>
          </Reveal>
        </RevealGroup>
      </Container>
    </section>
  );
};

export default HomeCTASection;
