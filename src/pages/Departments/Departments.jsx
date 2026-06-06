/* ============================================
   Departments — consolidated /departments page (prompt 19)
   Icon Commerce College
   --------------------------------------------
   ONE clean, well-organised page that replaces the old thin per-department
   routes. Subjects are grouped by stream (Arts / Commerce / Science):

     PageHero → intro + stream filter chips (counts) → one stream section per
     stream (image intro band + accessible department-card grid) → "Not sure
     which stream?" enquiry CTA.

   Everything renders from departmentsData (enriched in prompt 19); related
   programme links resolve against coursesData. The filter keeps each stream
   mounted in the default "All" view so deep-links like /departments#accountancy
   scroll to the right card. Reveal-on-scroll is reduced-motion safe; card and
   image hover lifts are CSS-only. SEO uses useSeo() with the /departments
   route defaults (src/config/seo.js) plus an ItemList schema of departments.
   ============================================ */

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

import useSeo from '../../components/common/SEO/useSeo';
import PageHero from '../../components/common/PageHero/PageHero';
import Section from '../../components/common/Section/Section';
import Container from '../../components/common/Container/Container';
import Button from '../../components/common/Button/Button';
import Img from '../../components/common/Img';
import { Reveal, RevealGroup } from '../../components/common/Reveal/Reveal';

import DepartmentCard from './DepartmentCard';
import { useModal } from '../../context/ModalContext';
import { departmentsData } from '../../data/departmentsData';
import { getCourseBySlug } from '../../data/coursesData';
import { generateDepartmentListSchema } from '../../utils/seo';
import styles from './Departments.module.css';

const { streams } = departmentsData;

// Total department listings across all streams (Economics / English recur, so
// this is a count of listings — it lines up with the "18+ Departments" stat).
const TOTAL_COUNT = streams.reduce((sum, stream) => sum + stream.subjects.length, 0);

// Department slugs are unique within a stream but Economics / English recur
// across streams. A recurring slug is stream-qualified (e.g. "commerce-economics")
// to keep DOM ids unique, while a unique slug keeps its bare form so links like
// /departments#accountancy resolve exactly as documented.
const slugCounts = streams
  .flatMap((stream) => stream.subjects)
  .reduce((acc, subject) => {
    acc[subject.slug] = (acc[subject.slug] || 0) + 1;
    return acc;
  }, {});

const anchorFor = (streamKey, subjectSlug) =>
  slugCounts[subjectSlug] > 1 ? `${streamKey}-${subjectSlug}` : subjectSlug;

// Resolve a subject's related programme slugs to { slug, shortName } for links.
const resolveRelated = (relatedSlugs = []) =>
  relatedSlugs
    .map((courseSlug) => getCourseBySlug(courseSlug))
    .filter(Boolean)
    .map((course) => ({ slug: course.slug, shortName: course.shortName }));

// Filter chips: All + one per stream, each with its department count.
const FILTERS = [
  { key: 'all', label: 'All', count: TOTAL_COUNT },
  ...streams.map((stream) => ({
    key: stream.key,
    label: stream.label,
    count: stream.subjects.length,
  })),
];

// A stream-band hash (#arts) pre-selects that stream; a department hash keeps
// "All" so the (unique) target card is mounted and scrolls into view.
const getInitialStream = () => {
  if (typeof window === 'undefined') return 'all';
  const hash = window.location.hash.replace('#', '');
  return streams.some((stream) => stream.key === hash) ? hash : 'all';
};

const Departments = () => {
  // /departments route SEO defaults + an ItemList schema of the departments.
  useSeo({ schema: generateDepartmentListSchema(streams) });

  const { openLeadDrawer } = useModal();
  const [activeStream, setActiveStream] = useState(getInitialStream);

  const isAll = activeStream === 'all';
  const activeLabel = useMemo(
    () => FILTERS.find((filter) => filter.key === activeStream)?.label || 'All',
    [activeStream]
  );
  const shownCount = useMemo(
    () =>
      streams
        .filter((stream) => isAll || stream.key === activeStream)
        .reduce((sum, stream) => sum + stream.subjects.length, 0),
    [activeStream, isAll]
  );

  return (
    <>
      {/* 1 — Hero */}
      <PageHero
        eyebrow="Academics"
        title="Departments"
        subtitle="Our academic departments across three streams — Arts · Commerce · Science."
        image="hero-library"
        breadcrumb={[{ label: 'Departments' }]}
      />

      {/* 2 — Intro + stream filter */}
      <Section
        bg="white"
        container="wide"
        eyebrow="Academics"
        title="Departments across three streams"
        subtitle="Icon Commerce College groups its subjects under three academic streams — Arts, Commerce and Science. Browse every department in one place, filter by stream, and expand any card to see what you’ll study and the programme it leads to."
        aria-label="Browse departments by stream"
      >
        <div
          className={styles.filterBar}
          role="group"
          aria-label="Filter departments by stream"
        >
          {FILTERS.map((filter) => {
            const isActive = activeStream === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                className={`${styles.filter} ${isActive ? styles.filterActive : ''}`}
                aria-pressed={isActive}
                onClick={() => setActiveStream(filter.key)}
              >
                <span>{filter.label}</span>
                <span className={styles.filterCount} aria-hidden="true">
                  {filter.count}
                </span>
                <span className={styles.srOnly}>{filter.count} departments</span>
              </button>
            );
          })}
        </div>

        <p className={styles.resultCount} role="status">
          Showing <strong>{shownCount}</strong>{' '}
          {shownCount === 1 ? 'department' : 'departments'}
          {!isAll && (
            <>
              {' '}
              in <strong>{activeLabel}</strong>
            </>
          )}
          .
        </p>
      </Section>

      {/* 3 — One section per stream (image intro band + department-card grid) */}
      {streams.map((stream, index) => {
        if (!isAll && stream.key !== activeStream) return null;

        const reversed = index % 2 === 1;
        const headingId = `${stream.key}-heading`;

        return (
          <section
            key={stream.key}
            id={stream.key}
            data-stream={stream.key}
            className={styles.stream}
            aria-labelledby={headingId}
          >
            <Container size="wide">
              {/* Stream intro band — image + label + blurb (design-system §6.4) */}
              <div className={`${styles.streamIntro} ${reversed ? styles.reversed : ''}`}>
                <Reveal
                  className={styles.streamMedia}
                  variant={reversed ? 'slideInRight' : 'slideInLeft'}
                  amount={0.3}
                >
                  <figure className={styles.streamFigure}>
                    <Img
                      src={stream.image}
                      alt={`${stream.label} stream at Icon Commerce College`}
                      className={styles.streamImage}
                    />
                    <span className={styles.streamBadge} aria-hidden="true">
                      <Icon icon={stream.icon} />
                    </span>
                  </figure>
                </Reveal>

                <RevealGroup className={styles.streamCopy} stagger={0.08} amount={0.3}>
                  <Reveal as="p" className={styles.streamEyebrow} variant="fadeUp">
                    {stream.label} Stream
                  </Reveal>
                  <Reveal as="h2" id={headingId} className={styles.streamHeading} variant="fadeUp">
                    {stream.label}
                  </Reveal>
                  <Reveal as="p" className={styles.streamBlurb} variant="fadeUp">
                    {stream.blurb}
                  </Reveal>
                  <Reveal as="p" className={styles.streamCount} variant="fadeUp">
                    <Icon icon="mdi:bookshelf" aria-hidden="true" />
                    <span>
                      {stream.subjects.length}{' '}
                      {stream.subjects.length === 1 ? 'department' : 'departments'}
                    </span>
                  </Reveal>
                </RevealGroup>
              </div>

              {/* Department cards */}
              <RevealGroup as="ul" className={styles.cardGrid} stagger={0.06} amount={0.1}>
                {stream.subjects.map((subject) => (
                  <Reveal
                    as="li"
                    key={`${stream.key}-${subject.slug}`}
                    className={styles.cardCell}
                    variant="fadeUp"
                  >
                    <DepartmentCard
                      subject={subject}
                      anchorId={anchorFor(stream.key, subject.slug)}
                      relatedPrograms={resolveRelated(subject.related)}
                    />
                  </Reveal>
                ))}
              </RevealGroup>
            </Container>
          </section>
        );
      })}

      {/* 4 — "Not sure which stream?" enquiry CTA */}
      <section className={styles.cta} aria-labelledby="departments-cta-heading">
        <span className={styles.ctaGlow} aria-hidden="true" />
        <Container size="default">
          <RevealGroup className={styles.ctaInner} stagger={0.08} amount={0.3}>
            <Reveal as="p" className={styles.ctaEyebrow} variant="fadeUp">
              Admissions 2026 Open
            </Reveal>

            <Reveal
              as="h2"
              id="departments-cta-heading"
              className={styles.ctaHeading}
              variant="fadeUp"
            >
              Not sure which stream is right for you?
            </Reveal>

            <Reveal as="p" className={styles.ctaSubtitle} variant="fadeUp">
              Tell us your interests and goals — our admission team will help you choose
              the right stream and programme, and guide you through the Samarth admission
              process.
            </Reveal>

            <Reveal className={styles.ctaActions} variant="fadeUp">
              <Button
                variant="primary"
                size="large"
                startIcon="mdi:chat-question-outline"
                onClick={() => openLeadDrawer('enquiry', { source: 'departments-cta' })}
              >
                Talk to Us
              </Button>
              <Button
                variant="outline"
                size="large"
                startIcon="mdi:file-download-outline"
                onClick={() => openLeadDrawer('prospectus', { source: 'departments-cta' })}
              >
                Download Prospectus
              </Button>
            </Reveal>

            <Reveal className={styles.ctaLinkRow} variant="fadeUp">
              <Link to="/courses" className={styles.ctaLink}>
                <span>Explore our undergraduate programmes</span>
                <Icon icon="mdi:arrow-right" aria-hidden="true" />
              </Link>
            </Reveal>
          </RevealGroup>
        </Container>
      </section>
    </>
  );
};

export default Departments;
