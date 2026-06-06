/* ============================================
   Leadership — "Messages from the Desks" (prompt 16)
   Icon Commerce College
   --------------------------------------------
   A dignified /leadership page presenting the seven desk messages, in order:
     PageHero → Leadership directory (ProfileCard grid) →
     alternating "From the Desk of …" message blocks →
     Governing Body note → closing link row.

   Each directory card is a router <Link> to that desk's anchor
   (`/leadership#<slug>`, slug = slugify(name)) and each message block is a
   plain <section id={slug}> — a stable, non-transformed scroll target, so the
   deep-links from the Home LeadershipTeaser (and any bookmarked URL) land on
   the right message via the shared <ScrollToTop> (which applies the fixed-header
   offset). Identity, qualifications, photos and the (interim) message copy all
   come from `leadershipData`; the full prospectus text lands in prompt 37.

   Entrances reveal on scroll through <Reveal>/<RevealGroup> (reduced-motion
   safe via useReducedMotionVariants); card/portrait hover-lifts are pure CSS so
   they never fight the entrance transform (the WhyChoose / About precedent).
   Page SEO uses useSeo() — the /leadership route defaults live in
   src/config/seo.js; this page additionally contributes Person schema for the
   President and Principal.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

import useSeo from '../../components/common/SEO/useSeo';
import PageHero from '../../components/common/PageHero/PageHero';
import Section from '../../components/common/Section/Section';
import Container from '../../components/common/Container/Container';
import Img from '../../components/common/Img';
import { Reveal, RevealGroup } from '../../components/common/Reveal/Reveal';

import { leadershipData } from '../../data/leadershipData';
import { collegeInfo } from '../../data/collegeInfo';
import { slugify } from '../../utils/formatters';
import { absoluteUrl } from '../../utils/seo';
import styles from './Leadership.module.css';

// Pre-resolve each desk-holder with a stable slug (used for both the card link
// and the message-block anchor id, so deep-links line up exactly).
const leaders = leadershipData.map((leader) => ({
  ...leader,
  slug: slugify(leader.name),
}));

// Person schema for the highlighted desks (President + Principal) — optional
// per the brief. Built once from the canonical data so it stays in sync.
const personSchema = {
  '@context': 'https://schema.org',
  '@graph': leaders
    .filter((leader) => leader.featured)
    .map((leader) => ({
      '@type': 'Person',
      name: leader.name,
      jobTitle: leader.role,
      image: absoluteUrl(leader.image),
      ...(leader.qualifications && { honorificSuffix: leader.qualifications }),
      worksFor: {
        '@type': 'CollegeOrUniversity',
        name: collegeInfo.name,
      },
    })),
};

const Leadership = () => {
  // /leadership route SEO defaults + this page's Person schema.
  useSeo({ schema: personSchema });

  return (
    <>
      {/* 1 — Hero */}
      <PageHero
        eyebrow="Leadership"
        title="Messages from the Desks"
        subtitle="Guidance and vision from the President, Principal and the leadership team who steer Icon Commerce College — knowledge and character, hand in hand."
        image="about-college-building"
        breadcrumb={[{ label: 'Leadership' }]}
      />

      {/* 2 — Leadership directory (ProfileCard grid → message anchors) */}
      <Section
        bg="light"
        container="wide"
        eyebrow="Our Leadership"
        title="The people who guide Icon Commerce College"
        subtitle="Seven desks, one shared commitment to our students. Select a name to read their message."
        aria-label="Icon Commerce College leadership directory"
      >
        <RevealGroup as="ul" className={styles.cardGrid} stagger={0.07} amount={0.1}>
          {leaders.map((leader) => (
            <Reveal as="li" key={leader.slug} className={styles.cardCell} variant="fadeUp">
              <Link
                to={`/leadership#${leader.slug}`}
                className={styles.card}
                aria-label={`Read the message from ${leader.name}, ${leader.role}`}
              >
                <span className={styles.cardAvatarWrap}>
                  <Img
                    src={leader.image}
                    alt={`${leader.name}, ${leader.role}`}
                    className={styles.cardAvatar}
                    width="112"
                    height="112"
                    fallback="faculty-placeholder"
                  />
                </span>
                <h3 className={styles.cardName}>{leader.name}</h3>
                <p className={styles.cardRole}>
                  {leader.role}
                  {leader.qualifications && (
                    <span className={styles.cardQuals}>{leader.qualifications}</span>
                  )}
                </p>
                <span className={styles.cardLink}>
                  Read message
                  <Icon icon="mdi:arrow-right" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      {/* 3 — "From the Desk of …" message blocks (alternating layout) */}
      {leaders.map((leader, index) => {
        const reversed = index % 2 === 1;
        return (
          <section
            key={leader.slug}
            id={leader.slug}
            className={`${styles.message} ${reversed ? styles.messageAlt : ''}`}
            aria-labelledby={`${leader.slug}-name`}
          >
            <Container>
              <div
                className={`${styles.messageGrid} ${reversed ? styles.reversed : ''}`}
              >
                {/* Portrait */}
                <Reveal
                  className={styles.portrait}
                  variant={reversed ? 'slideInRight' : 'slideInLeft'}
                >
                  <figure className={styles.portraitFigure}>
                    <Img
                      src={leader.image}
                      alt={`${leader.name}, ${leader.role} at Icon Commerce College`}
                      className={styles.portraitImg}
                      fallback="faculty-placeholder"
                    />
                    <span className={styles.portraitQuote} aria-hidden="true">
                      <Icon icon="mdi:format-quote-open" />
                    </span>
                  </figure>
                </Reveal>

                {/* Message body */}
                <RevealGroup className={styles.messageBody} stagger={0.08} amount={0.2}>
                  <Reveal as="p" className={styles.deskEyebrow} variant="fadeUp">
                    From the Desk of
                  </Reveal>

                  <Reveal
                    as="h2"
                    id={`${leader.slug}-name`}
                    className={styles.msgName}
                    variant="fadeUp"
                  >
                    {leader.name}
                  </Reveal>

                  <Reveal as="p" className={styles.msgRole} variant="fadeUp">
                    {leader.role}
                    {leader.qualifications && (
                      <span className={styles.msgQuals}> · {leader.qualifications}</span>
                    )}
                  </Reveal>

                  {/* Gold quote accent — full prospectus message (one <p> per paragraph). */}
                  <Reveal as="blockquote" className={styles.quote} variant="fadeUp">
                    <Icon
                      icon="mdi:format-quote-open"
                      className={styles.quoteMark}
                      aria-hidden="true"
                    />
                    {leader.message.map((paragraph, paraIndex) => (
                      <p key={paraIndex} className={styles.quoteText}>
                        {paragraph}
                      </p>
                    ))}
                  </Reveal>

                  {/* Signature line */}
                  <Reveal className={styles.signature} variant="fadeUp">
                    <span className={styles.signatureRule} aria-hidden="true" />
                    <span className={styles.signatureName}>{leader.name}</span>
                    <span className={styles.signatureRole}>
                      {leader.role}, {collegeInfo.name}
                    </span>
                  </Reveal>
                </RevealGroup>
              </div>
            </Container>
          </section>
        );
      })}

      {/* 4 — Governing Body note */}
      <section className={styles.governance} aria-labelledby="leadership-governance-heading">
        <Container size="narrow">
          <RevealGroup className={styles.governanceInner} stagger={0.08} amount={0.3}>
            <Reveal className={styles.governanceChip} variant="scaleIn">
              <Icon icon="mdi:bank-outline" aria-hidden="true" />
            </Reveal>
            <Reveal as="p" className={styles.governanceEyebrow} variant="fadeUp">
              Governance
            </Reveal>
            <Reveal
              as="h2"
              id="leadership-governance-heading"
              className={styles.governanceHeading}
              variant="fadeUp"
            >
              Under the {collegeInfo.trust}
            </Reveal>
            <Reveal as="p" className={styles.governanceText} variant="fadeUp">
              Icon Commerce College is established and governed under the{' '}
              {collegeInfo.trust}. Its Governing Body, led by the President, provides
              strategic direction and oversight, while the Principal and academic
              leadership steer day-to-day teaching, discipline and student welfare —
              together upholding the standards expected of a {collegeInfo.affiliation}{' '}
              affiliated institution under {collegeInfo.affiliationNote}.
            </Reveal>

            <Reveal className={styles.governanceLinks} variant="fadeUp">
              <Link to="/about" className={styles.governanceLink}>
                <Icon icon="mdi:office-building-outline" aria-hidden="true" />
                <span>About the college</span>
              </Link>
              <Link to="/admissions" className={styles.governanceLink}>
                <span>Admissions 2026</span>
                <Icon icon="mdi:arrow-right" aria-hidden="true" />
              </Link>
            </Reveal>
          </RevealGroup>
        </Container>
      </section>
    </>
  );
};

export default Leadership;
