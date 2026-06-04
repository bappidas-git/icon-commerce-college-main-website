/* ============================================
   About — page (prompt 15)
   Icon Commerce College
   --------------------------------------------
   The full /about story, in order:
     PageHero → College Profile → Vision & Mission (reused, prompt 12) →
     Core Values → At a Glance (stats + accreditation chips) →
     Milestones timeline → CTA band (Apply / Prospectus / Visit Campus).

   Every block reveals on scroll via <Reveal>/<RevealGroup> (reduced-motion
   safe through useReducedMotionVariants). Card hover-lifts are pure CSS so
   they never fight the entrance transform (the WhyChoose / Highlights
   precedent). Page SEO is applied with useSeo() — the /about route defaults
   (title, description, keywords) live in src/config/seo.js.

   Internal links out to /courses, /leadership and /admissions are present in
   the profile and CTA blocks (acceptance criteria). All copy is sourced from
   collegeInfo / the design system — no fabricated data; uncertain timeline
   years are marked TODO for the client to confirm.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

import useSeo from '../../components/common/SEO/useSeo';
import PageHero from '../../components/common/PageHero/PageHero';
import Section from '../../components/common/Section/Section';
import Container from '../../components/common/Container/Container';
import Button from '../../components/common/Button/Button';
import AnimatedCounter from '../../components/common/AnimatedCounter/AnimatedCounter';
import { Reveal, RevealGroup } from '../../components/common/Reveal/Reveal';
import VisionMission from '../../components/sections/VisionMission';

import { useModal } from '../../context/ModalContext';
import { placeholder } from '../../utils/assets';
import { collegeInfo } from '../../data/collegeInfo';
import { statsData } from '../../data/statsData';
import styles from './About.module.css';

// Scannable quick-facts for the profile column (sourced from collegeInfo / §6).
const PROFILE_FACTS = [
  {
    icon: 'mdi:calendar-star',
    text: `Established ${collegeInfo.established} under the ${collegeInfo.trust}`,
  },
  {
    icon: 'mdi:map-marker-outline',
    text: `${collegeInfo.address.parts.line1}, ${collegeInfo.address.parts.area}, ${collegeInfo.address.parts.city} – ${collegeInfo.address.parts.pincode}`,
  },
  {
    icon: 'mdi:certificate-outline',
    text: `Affiliated to ${collegeInfo.affiliation} · ${collegeInfo.affiliationNote}`,
  },
  {
    icon: 'mdi:clipboard-check-outline',
    text: `Permitted Samarth examination centre · College Code ${collegeInfo.samarthCode}`,
  },
];

// Core values / "Why ICC" — six icon cards (prompt 15 brief, §6 ethos).
const CORE_VALUES = [
  {
    icon: 'mdi:trophy-outline',
    title: 'Academic Excellence',
    text: 'High standards in teaching and learning that help every student reach their full potential.',
  },
  {
    icon: 'mdi:sprout-outline',
    title: 'Holistic Development',
    text: 'Growth beyond the syllabus — skills, sports, culture and confidence alongside academics.',
  },
  {
    icon: 'mdi:scale-balance',
    title: 'Moral Integrity',
    text: 'Honesty, discipline and ethical conduct at the heart of campus life and character.',
  },
  {
    icon: 'mdi:account-heart-outline',
    title: 'Student-Centric Approach',
    text: 'Mentoring, guidance and support built around each learner’s needs, pace and goals.',
  },
  {
    icon: 'mdi:account-group-outline',
    title: 'Inclusive Community',
    text: 'A welcoming campus where students of every background and stream truly belong.',
  },
  {
    icon: 'mdi:briefcase-outline',
    title: 'Industry Readiness',
    text: 'Practical, NEP-aligned learning that prepares graduates for careers, higher study and enterprise.',
  },
];

// Affiliation / accreditation chips for the "At a Glance" band (§1/§6).
const ACCREDITATIONS = [
  { icon: 'mdi:school-outline', label: collegeInfo.affiliation },
  { icon: 'mdi:book-education-outline', label: collegeInfo.affiliationNote },
  { icon: 'mdi:identifier', label: `Samarth Code ${collegeInfo.samarthCode}` },
  { icon: 'mdi:calendar-star', label: `Estd. ${collegeInfo.established}` },
];

// Founding → today timeline (optional block). Years that are not firmly
// documented are intentionally given descriptive markers and flagged TODO so
// nothing on the page is fabricated.
const TIMELINE = [
  {
    marker: '2004',
    title: 'Foundation',
    text: `Icon Commerce College is established under the ${collegeInfo.trust} on Rajgarh Road, Chandmari, Guwahati.`,
  },
  {
    // TODO: confirm the key expansion years with the college.
    marker: 'Growth',
    title: 'Expanding horizons',
    text: 'Programmes and departments grow across Arts, Commerce and Computer Application streams.',
  },
  {
    // TODO: confirm the exact academic session of the FYUGP rollout.
    marker: 'NEP 2020',
    title: 'FYUGP adopted',
    text: `Curriculum aligns with the National Education Policy 2020 — the Four-Year Undergraduate Programme under ${collegeInfo.affiliation}.`,
  },
  {
    marker: 'Today',
    title: 'A trusted name in Guwahati',
    text: `A permitted Samarth examination centre (College Code ${collegeInfo.samarthCode}) with experienced faculty and thousands of alumni.`,
  },
];

const About = () => {
  // Apply the /about route SEO (title, description, keywords, OG/Twitter, schema).
  useSeo();

  const { openLeadDrawer } = useModal();

  return (
    <>
      {/* 1 — Hero */}
      <PageHero
        eyebrow="Our Story"
        title="About Icon Commerce College"
        subtitle="A Commerce, Arts & Computer Application college in Guwahati — established in 2004 under the Icon Academy Trust and affiliated to Gauhati University."
        image="about-campus-aerial"
        breadcrumb={[{ label: 'About' }]}
      />

      {/* 2 — College Profile */}
      <section className={styles.profile} aria-labelledby="about-profile-heading">
        <Container>
          <div className={styles.profileGrid}>
            {/* Media — campus building placeholder with a gold "Estd." badge */}
            <Reveal className={styles.profileMedia} variant="slideInLeft">
              <figure className={styles.profileFigure}>
                <img
                  src={placeholder('about-college-building')}
                  alt="Icon Commerce College campus building"
                  className={styles.profileImage}
                  loading="lazy"
                />
                <figcaption className={styles.profileBadge}>
                  <span className={styles.profileBadgeLabel}>Estd.</span>
                  {collegeInfo.established}
                </figcaption>
              </figure>
            </Reveal>

            {/* Copy — "shuttle" cascade of eyebrow → heading → paragraphs → facts → CTA */}
            <RevealGroup className={styles.profileText} stagger={0.08} amount={0.2}>
              <Reveal as="p" className={styles.eyebrow} variant="fadeUp">
                About the College
              </Reveal>

              <Reveal
                as="h2"
                id="about-profile-heading"
                className={styles.heading}
                variant="fadeUp"
              >
                A legacy of quality higher education in Guwahati
              </Reveal>

              <Reveal className={styles.copy} variant="fadeUp">
                <p>
                  Established in {collegeInfo.established} under the {collegeInfo.trust},
                  Icon Commerce College is a Commerce, Arts &amp; Computer Application
                  college in the heart of Guwahati, affiliated to {collegeInfo.affiliation}{' '}
                  under the {collegeInfo.affiliationNote} framework. The college offers
                  undergraduate programmes across Arts, Commerce, BBA and BCA.
                </p>
                <p>
                  As a permitted Samarth examination centre (College Code{' '}
                  {collegeInfo.samarthCode}), the college pairs an enriched library and
                  structured study materials with smart classrooms, a computer lab and
                  online classes — so learning continues well beyond the lecture hall.
                </p>
                <p>
                  Regular seminars and workshops, together with experienced and
                  research-active faculty, help our students grow into confident,
                  industry-ready graduates — knowledge and character, hand in hand.
                </p>
              </Reveal>

              <Reveal as="ul" className={styles.facts} variant="fadeUp">
                {PROFILE_FACTS.map((fact) => (
                  <li key={fact.text} className={styles.fact}>
                    <Icon icon={fact.icon} className={styles.factIcon} aria-hidden="true" />
                    <span>{fact.text}</span>
                  </li>
                ))}
              </Reveal>

              <Reveal className={styles.profileActions} variant="fadeUp">
                <Link to="/courses" className={styles.primaryLink}>
                  <span>Explore our programmes</span>
                  <Icon icon="mdi:arrow-right" aria-hidden="true" />
                </Link>
                <Link to="/leadership" className={styles.secondaryLink}>
                  <Icon icon="mdi:account-tie-outline" aria-hidden="true" />
                  <span>Meet our leadership</span>
                </Link>
              </Reveal>
            </RevealGroup>
          </div>
        </Container>
      </section>

      {/* 3 — Vision & Mission (reused section, prompt 12) */}
      <VisionMission />

      {/* 4 — Core Values / Why ICC */}
      <Section
        bg="light"
        container="wide"
        eyebrow="Why Icon Commerce College"
        title="The values that shape every graduate"
        subtitle="Six principles guide life and learning on our Chandmari campus."
        aria-label="Core values of Icon Commerce College"
      >
        <RevealGroup as="ul" className={styles.valuesGrid} stagger={0.07} amount={0.15}>
          {CORE_VALUES.map((value) => (
            <Reveal as="li" key={value.title} className={styles.valueCell} variant="fadeUp">
              <article className={styles.valueCard}>
                <span className={styles.valueChip} aria-hidden="true">
                  <Icon icon={value.icon} />
                </span>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueText}>{value.text}</p>
              </article>
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      {/* 5 — At a Glance (stats strip — reuses statsData — + accreditation chips) */}
      <Section
        bg="navy"
        container="wide"
        eyebrow="At a Glance"
        title="Icon Commerce College by the numbers"
        subtitle="A snapshot of who we are — and the affiliations that back every degree."
        aria-label="Icon Commerce College at a glance"
      >
        <RevealGroup className={styles.glanceStats} stagger={0.08} amount={0.3}>
          {statsData.map((stat) => {
            const isNumeric = typeof stat.value === 'number';
            // "Since 2004" is a calendar year — render it ungrouped (no thousands comma).
            const isYear = /since/i.test(stat.prefix || '');

            return (
              <Reveal as="figure" key={stat.label} className={styles.statCell} variant="fadeUp">
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
                  <span className={styles.statDisplay}>{stat.display}</span>
                )}
                <figcaption className={styles.statLabel}>{stat.label}</figcaption>
              </Reveal>
            );
          })}
        </RevealGroup>

        <Reveal as="ul" className={styles.chips} variant="fadeUp">
          {ACCREDITATIONS.map((chip) => (
            <li key={chip.label} className={styles.chip}>
              <Icon icon={chip.icon} className={styles.chipIcon} aria-hidden="true" />
              <span>{chip.label}</span>
            </li>
          ))}
        </Reveal>
      </Section>

      {/* 6 — Milestones / Timeline */}
      <Section
        bg="white"
        container="default"
        eyebrow="Our Journey"
        title="Milestones along the way"
        subtitle="From a 2004 founding to a NEP-aligned college today."
        aria-label="Icon Commerce College milestones"
      >
        <RevealGroup as="ol" className={styles.timeline} stagger={0.1} amount={0.15}>
          {TIMELINE.map((item) => (
            <Reveal as="li" key={item.marker} className={styles.tItem} variant="fadeUp">
              <span className={styles.tDot} aria-hidden="true" />
              <div className={styles.tCard}>
                <span className={styles.tMarker}>{item.marker}</span>
                <h3 className={styles.tTitle}>{item.title}</h3>
                <p className={styles.tText}>{item.text}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      {/* 7 — CTA band */}
      <section className={styles.cta} aria-labelledby="about-cta-heading">
        <span className={styles.ctaGlow} aria-hidden="true" />
        <Container size="default">
          <RevealGroup className={styles.ctaInner} stagger={0.08} amount={0.3}>
            <Reveal as="p" className={styles.ctaEyebrow} variant="fadeUp">
              Admissions 2026 Open
            </Reveal>

            <Reveal as="h2" id="about-cta-heading" className={styles.ctaHeading} variant="fadeUp">
              Begin your journey at Icon Commerce College
            </Reveal>

            <Reveal as="p" className={styles.ctaSubtitle} variant="fadeUp">
              Apply for a Gauhati University degree under NEP 2020, download the
              prospectus or plan a visit to our Chandmari campus — our admission team
              is here to guide you.
            </Reveal>

            <Reveal className={styles.ctaActions} variant="fadeUp">
              <Button
                variant="primary"
                size="large"
                startIcon="mdi:school-outline"
                onClick={() => openLeadDrawer('apply-now', { source: 'about-cta' })}
              >
                Apply Now
              </Button>
              <Button
                variant="outline"
                size="large"
                startIcon="mdi:file-download-outline"
                onClick={() => openLeadDrawer('prospectus', { source: 'about-cta' })}
              >
                Download Prospectus
              </Button>
              <Button
                variant="outline"
                size="large"
                startIcon="mdi:map-marker-outline"
                onClick={() => openLeadDrawer('visit', { source: 'about-cta' })}
              >
                Visit Campus
              </Button>
            </Reveal>

            <Reveal className={styles.ctaLinkRow} variant="fadeUp">
              <Link to="/admissions" className={styles.ctaLink}>
                <span>See the full admission process</span>
                <Icon icon="mdi:arrow-right" aria-hidden="true" />
              </Link>
            </Reveal>
          </RevealGroup>
        </Container>
      </section>
    </>
  );
};

export default About;
