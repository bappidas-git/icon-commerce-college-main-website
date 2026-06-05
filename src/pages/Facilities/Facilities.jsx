/* ============================================
   Facilities — campus & facilities page (prompt 21)
   Icon Commerce College
   --------------------------------------------
   Replaces the /facilities ComingSoon shell with a polished campus page:

     PageHero → intro (learning environment + focus areas) → facilities grid
     → feature spotlights (alternating image + copy rows) → campus glimpses
     → "Visit our campus" CTA (Book a Campus Visit drawer + gallery link).

   Everything renders from facilitiesData (the 10 facilities), facilitySpotlights
   (3 richer rows) and campusGlimpses (image tiles). Reveal-on-scroll is
   reduced-motion safe (<Reveal>/<RevealGroup>); the facility/glimpse tiles are
   plain markup with CSS-only hover (the WhyChoose precedent) so the entrance
   never double-animates. SEO uses useSeo() with the /facilities route defaults
   (src/config/seo.js) plus an ItemList schema of the facilities.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

import useSeo from '../../components/common/SEO/useSeo';
import PageHero from '../../components/common/PageHero/PageHero';
import Section from '../../components/common/Section/Section';
import Container from '../../components/common/Container/Container';
import Button from '../../components/common/Button/Button';
import { Reveal, RevealGroup } from '../../components/common/Reveal/Reveal';

import FacilityCard from './FacilityCard';
import { useModal } from '../../context/ModalContext';
import {
  facilitiesData,
  facilitySpotlights,
  campusGlimpses,
} from '../../data/facilitiesData';
import { generateFacilityListSchema } from '../../utils/seo';
import styles from './Facilities.module.css';

// Themed focus areas for the intro strip — category labels grounded in the
// facilities (no invented numbers).
const FOCUS_AREAS = [
  { icon: 'mdi:school-outline', label: 'Academics' },
  { icon: 'mdi:laptop', label: 'Technology' },
  { icon: 'mdi:trophy-outline', label: 'Sports & Culture' },
  { icon: 'mdi:hand-heart-outline', label: 'Student Support' },
];

const Facilities = () => {
  // /facilities route SEO defaults + the campus-facilities ItemList schema.
  useSeo({ schema: generateFacilityListSchema(facilitiesData) });

  const { openLeadDrawer } = useModal();

  return (
    <>
      {/* 1 — Hero */}
      <PageHero
        eyebrow="Campus Life"
        title="Campus & Facilities"
        subtitle="A modern, student-first campus — digital library, computer lab, smart classrooms, Wi-Fi, a playground and more."
        image="hero-campus"
        breadcrumb={[{ label: 'Facilities' }]}
      />

      {/* 2 — Intro (the learning environment) */}
      <Section
        bg="white"
        container="default"
        align="center"
        eyebrow="Our Campus"
        title="A learning environment built for focus and growth"
        subtitle="From a quiet digital library and an internet-enabled computer lab to smart classrooms, sports and student support, our Chandmari campus is designed to help every student learn, grow and thrive."
        aria-label="About our campus and facilities"
      >
        <RevealGroup as="ul" className={styles.focusAreas} stagger={0.06} amount={0.3}>
          {FOCUS_AREAS.map((area) => (
            <Reveal as="li" key={area.label} className={styles.focusArea} variant="scaleIn">
              <Icon icon={area.icon} aria-hidden="true" />
              <span>{area.label}</span>
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      {/* 3 — Facilities grid (all 10 from facilitiesData) */}
      <Section
        bg="light"
        container="wide"
        eyebrow="Facilities"
        title="Everything you need on campus"
        subtitle="Ten core facilities that support teaching, learning and student life at Icon Commerce College."
        aria-label="Campus facilities"
      >
        <RevealGroup as="ul" className={styles.grid} stagger={0.06} amount={0.1}>
          {facilitiesData.map((facility) => (
            <Reveal
              as="li"
              key={facility.title}
              className={styles.gridCell}
              variant="fadeUp"
            >
              <FacilityCard facility={facility} />
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      {/* 4 — Feature spotlights (alternating image + copy rows) */}
      <Section
        bg="white"
        container="wide"
        eyebrow="In Focus"
        title="A closer look at our key facilities"
        subtitle="Three of the spaces our students rely on most — for study, for practicals and for the spirit of college life beyond the classroom."
        aria-label="Facility spotlights"
      >
        <div className={styles.spotlights}>
          {facilitySpotlights.map((spotlight, index) => {
            const reversed = index % 2 === 1;
            return (
              <div
                key={spotlight.key}
                id={spotlight.key}
                className={`${styles.spotlight} ${reversed ? styles.reversed : ''}`}
              >
                <Reveal
                  className={styles.spotlightMedia}
                  variant={reversed ? 'slideInRight' : 'slideInLeft'}
                  amount={0.3}
                >
                  <figure className={styles.spotlightFigure}>
                    <img
                      src={spotlight.image}
                      alt={spotlight.alt}
                      className={styles.spotlightImage}
                      loading="lazy"
                    />
                    <span className={styles.spotlightBadge} aria-hidden="true">
                      <Icon icon={spotlight.icon} />
                    </span>
                  </figure>
                </Reveal>

                <RevealGroup className={styles.spotlightCopy} stagger={0.08} amount={0.3}>
                  <Reveal as="p" className={styles.spotlightEyebrow} variant="fadeUp">
                    {spotlight.eyebrow}
                  </Reveal>
                  <Reveal as="h3" className={styles.spotlightHeading} variant="fadeUp">
                    {spotlight.title}
                  </Reveal>
                  <Reveal as="p" className={styles.spotlightLead} variant="fadeUp">
                    {spotlight.lead}
                  </Reveal>
                  <Reveal as="ul" className={styles.points} variant="fadeUp">
                    {spotlight.points.map((point) => (
                      <li key={point} className={styles.point}>
                        <Icon
                          icon="mdi:check-circle"
                          className={styles.pointIcon}
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </Reveal>
                </RevealGroup>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 5 — Campus glimpses (image tiles, reusing the remaining placeholders) */}
      <Section
        bg="light"
        container="wide"
        eyebrow="Around Campus"
        title="A glimpse of campus life"
        subtitle="A few more corners of our campus — from smart classrooms to the canteen and campus-wide Wi-Fi."
        aria-label="Campus glimpses"
      >
        <RevealGroup as="ul" className={styles.glimpses} stagger={0.08} amount={0.15}>
          {campusGlimpses.map((glimpse) => (
            <Reveal
              as="li"
              key={glimpse.title}
              className={styles.glimpseCell}
              variant="fadeUp"
            >
              <figure className={styles.glimpse}>
                <img
                  src={glimpse.image}
                  alt={glimpse.title}
                  className={styles.glimpseImage}
                  loading="lazy"
                />
                <figcaption className={styles.glimpseCaption}>
                  <span className={styles.glimpseTitle}>{glimpse.title}</span>
                  <span className={styles.glimpseText}>{glimpse.caption}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      {/* 6 — "Visit our campus" CTA (navy + gold glow) */}
      <section className={styles.cta} aria-labelledby="facilities-cta-heading">
        <span className={styles.ctaGlow} aria-hidden="true" />
        <Container size="default">
          <RevealGroup className={styles.ctaInner} stagger={0.08} amount={0.3}>
            <Reveal as="p" className={styles.ctaEyebrow} variant="fadeUp">
              See It For Yourself
            </Reveal>

            <Reveal
              as="h2"
              id="facilities-cta-heading"
              className={styles.ctaHeading}
              variant="fadeUp"
            >
              Visit our campus
            </Reveal>

            <Reveal as="p" className={styles.ctaSubtitle} variant="fadeUp">
              Pictures only tell part of the story. Book a guided tour of our Chandmari
              campus to see our library, labs and classrooms for yourself — or browse the
              gallery for a closer look.
            </Reveal>

            <Reveal className={styles.ctaActions} variant="fadeUp">
              <Button
                variant="primary"
                size="large"
                startIcon="mdi:map-marker-outline"
                onClick={() => openLeadDrawer('visit', { source: 'facilities-cta' })}
              >
                Book a Campus Visit
              </Button>
            </Reveal>

            <Reveal className={styles.ctaLinkRow} variant="fadeUp">
              <Link to="/gallery" className={styles.ctaLink}>
                <Icon icon="mdi:image-multiple-outline" aria-hidden="true" />
                <span>Explore our photo &amp; video gallery</span>
                <Icon icon="mdi:arrow-right" aria-hidden="true" />
              </Link>
            </Reveal>
          </RevealGroup>
        </Container>
      </section>
    </>
  );
};

export default Facilities;
