/* ============================================
   LeadershipTeaser — Home "messages from the desks" band (prompt 14)
   Icon Commerce College
   --------------------------------------------
   Three featured profile cards — President (Smt. Dipali Bora), Principal
   (Dr. Mandira Saha) and Academic Advisor (Dr. Nilanjan Bhattacharjee) — each
   with a photo placeholder, name, role, a one-line message excerpt and a
   "Read message" link to that person's anchor on /leadership (#<slug>). The
   band closes with a "Meet our leadership" link to /leadership.

   Identity (name / role / qualifications / photo) is read from `leadershipData`
   so it stays in sync. The full desk messages live there as TODO stubs until
   prompt 37 transcribes the prospectus copy, so the teaser carries its own
   short, neutral excerpts here rather than printing a "TODO:" placeholder.

   Per the section precedent (Highlights / WhyChoose), cards are plain markup
   inside <Reveal>/<RevealGroup> (not the motion-driven <ProfileCard>) so the
   entrance routes through `useReducedMotionVariants()` and never double-animates
   against a card's own transform; the hover lift is pure CSS.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Section from '../../common/Section/Section';
import { Reveal, RevealGroup } from '../../common/Reveal/Reveal';
import { leadershipData } from '../../../data/leadershipData';
import { slugify } from '../../../utils/formatters';
import styles from './LeadershipTeaser.module.css';

// The three desks featured on the Home page, in order (design-system §6 / prompt 14).
// `excerpt` is a short, neutral teaser line (the full message is finalised on the
// Leadership page in prompt 37); identity is pulled from `leadershipData` by name.
const FEATURED = [
  {
    name: 'Smt. Dipali Bora',
    excerpt:
      'Welcome to Icon Commerce College — where we nurture knowledge, character and confidence in every student.',
  },
  {
    name: 'Dr. Mandira Saha',
    excerpt:
      'Our endeavour is to deliver quality, value-based higher education that prepares students for a changing world.',
  },
  {
    name: 'Dr. Nilanjan Bhattacharjee',
    excerpt:
      'Under the NEP 2020 framework we guide students towards a flexible, future-ready and outcome-based education.',
  },
];

// Resolve each featured desk against the canonical leadership records.
const featuredLeaders = FEATURED.map(({ name, excerpt }) => {
  const leader = leadershipData.find((l) => l.name === name);
  return leader ? { ...leader, excerpt, slug: slugify(leader.name) } : null;
}).filter(Boolean);

const LeadershipTeaser = () => (
  <Section
    bg="white"
    container="wide"
    eyebrow="Leadership"
    title="Messages from our leadership"
    subtitle="Guidance and vision from the people who steer Icon Commerce College."
    aria-label="Messages from the college leadership"
  >
    <RevealGroup as="ul" className={styles.grid} stagger={0.08} amount={0.15}>
      {featuredLeaders.map((leader) => (
        <Reveal as="li" key={leader.slug} className={styles.cell} variant="fadeUp">
          <article className={styles.card}>
            <div className={styles.avatarWrap}>
              <img
                src={leader.image}
                alt={`${leader.name}, ${leader.role}`}
                className={styles.avatar}
                loading="lazy"
                width="96"
                height="96"
              />
              <span className={styles.quoteMark} aria-hidden="true">
                <Icon icon="mdi:format-quote-close" />
              </span>
            </div>

            <h3 className={styles.name}>{leader.name}</h3>
            <p className={styles.role}>
              {leader.role}
              {leader.qualifications && (
                <span className={styles.quals}> · {leader.qualifications}</span>
              )}
            </p>

            <p className={styles.excerpt}>{leader.excerpt}</p>

            <Link
              to={`/leadership#${leader.slug}`}
              className={styles.readLink}
              aria-label={`Read the full message from ${leader.name}`}
            >
              <span>Read message</span>
              <Icon icon="mdi:arrow-right" aria-hidden="true" />
            </Link>
          </article>
        </Reveal>
      ))}
    </RevealGroup>

    <Reveal className={styles.footer} variant="fadeUp">
      <Link to="/leadership" className={styles.meetAll}>
        <span>Meet our leadership</span>
        <Icon icon="mdi:arrow-right" aria-hidden="true" />
      </Link>
    </Reveal>
  </Section>
);

export default LeadershipTeaser;
