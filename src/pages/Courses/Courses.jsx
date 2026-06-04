/* ============================================
   Courses — Programs overview page (prompt 17)
   Icon Commerce College
   --------------------------------------------
   The /courses hub presenting all four UG programmes (B.Com · BBA · BCA · B.A.)
   in one place, replacing the old thin per-course pages:

     PageHero → Intro band (NEP-2020 FYUGP structure + Samarth route) →
     large ProgramCard grid → comparison table (desktop) / stacked (mobile) →
     navy Admission CTA (4-step summary + Samarth pill + Apply / Prospectus).

   Everything renders from coursesData / admissionData / collegeInfo — no
   fabricated figures. Reveal-on-scroll via <Reveal>/<RevealGroup> (reduced-
   motion safe); card and table hover lifts are CSS-only so they never fight the
   entrance transform. SEO uses useSeo() with the /courses route defaults
   (src/config/seo.js) plus an ItemList schema of the four programmes.
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
import ProgramCard from '../../components/sections/ProgramsSection/ProgramCard';

import { useModal } from '../../context/ModalContext';
import { coursesData } from '../../data/coursesData';
import { admissionSteps } from '../../data/admissionData';
import { collegeInfo } from '../../data/collegeInfo';
import { generateCourseListSchema } from '../../utils/seo';
import styles from './Courses.module.css';

// FYUGP / NEP-2020 structure facts for the intro band (design-system §6).
const STRUCTURE_FACTS = [
  {
    icon: 'mdi:calendar-range',
    label: '3-Year Degree',
    text: 'Six semesters of full undergraduate study.',
  },
  {
    icon: 'mdi:medal-outline',
    label: '4-Year Honours',
    text: 'Eight semesters — Honours / Honours with Research.',
  },
  {
    icon: 'mdi:school-outline',
    label: collegeInfo.affiliation,
    text: `Affiliated under the ${collegeInfo.affiliationNote} framework.`,
  },
  {
    icon: 'mdi:identifier',
    label: `Samarth Code ${collegeInfo.samarthCode}`,
    text: 'Apply through the Samarth admission portal.',
  },
];

// Comparison-table columns (design-system §6 — exactly these five).
const TABLE_COLUMNS = [
  'Program',
  'Duration',
  'Eligibility',
  '1st-Sem Total Fees',
  'Monthly Tuition',
];

// The fee N.B. is identical across programmes (design-system §6) — show it once.
const FEES_NOTE = coursesData[0].fees.note;

const Courses = () => {
  // /courses route SEO defaults + an ItemList schema of the four programmes.
  useSeo({ schema: generateCourseListSchema(coursesData) });

  const { openLeadDrawer } = useModal();

  return (
    <>
      {/* 1 — Hero */}
      <PageHero
        eyebrow="Programs"
        title="Our Programs"
        subtitle="Undergraduate degrees under NEP 2020 (FYUGP), affiliated to Gauhati University — B.Com, BBA, BCA and B.A."
        image="hero-students"
        breadcrumb={[{ label: 'Courses' }]}
      />

      {/* 2 — Intro band: NEP-2020 / FYUGP structure + Samarth route */}
      <Section
        bg="white"
        container="default"
        eyebrow="NEP 2020 · FYUGP"
        title="Four-year undergraduate programmes, the NEP way"
        subtitle={`Choose a 3-year degree (6 semesters) or continue to a 4-year Honours degree (8 semesters) under the ${collegeInfo.affiliation} FYUGP framework. Admission to every programme is through the Samarth portal under College Code ${collegeInfo.samarthCode}.`}
        aria-label="About the FYUGP programme structure"
      >
        <RevealGroup as="ul" className={styles.structureGrid} stagger={0.07} amount={0.2}>
          {STRUCTURE_FACTS.map((fact) => (
            <Reveal as="li" key={fact.label} className={styles.structureCell} variant="fadeUp">
              <article className={styles.structureCard}>
                <span className={styles.structureChip} aria-hidden="true">
                  <Icon icon={fact.icon} />
                </span>
                <h3 className={styles.structureLabel}>{fact.label}</h3>
                <p className={styles.structureText}>{fact.text}</p>
              </article>
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      {/* 3 — Program cards grid (large ProgramCard, eligibility shown) */}
      <Section
        bg="light"
        container="wide"
        eyebrow="Programs"
        title="Choose your undergraduate path"
        subtitle="Four UG programmes under the FYUGP framework — explore the details and fees, or apply in a click."
        aria-label="Undergraduate programs"
      >
        <RevealGroup className={styles.cardGrid} stagger={0.08} amount={0.12}>
          {coursesData.map((course) => (
            <Reveal key={course.slug} className={styles.cardCell} variant="fadeUp">
              <ProgramCard course={course} source="courses-grid" showEligibility />
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      {/* 4 — Comparison table (desktop) / stacked cards (mobile) */}
      <Section
        bg="white"
        container="default"
        eyebrow="Compare"
        title="Programs at a glance"
        subtitle="Duration, eligibility and fees side by side. Select a programme to see full details."
        aria-label="Programs comparison"
      >
        <Reveal variant="fadeUp">
          {/* Scroll wrapper keeps the table usable at tablet/intermediate widths;
              at phone widths the table collapses to stacked cards (CSS below). */}
          <div
            className={styles.tableScroll}
            role="region"
            aria-label="Programs comparison table"
            tabIndex={0}
          >
            <table className={styles.table}>
              <caption className={styles.srOnly}>
                First-semester fees and monthly tuition for all four UG programmes.
              </caption>
              <thead>
                <tr>
                  {TABLE_COLUMNS.map((col) => (
                    <th key={col} scope="col">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coursesData.map((course) => (
                  <tr key={course.slug}>
                    <th scope="row" data-label="Program" className={styles.tableProgram}>
                      <Link to={`/courses/${course.slug}`} className={styles.tableLink}>
                        {course.shortName}
                      </Link>
                    </th>
                    <td data-label="Duration">{course.duration}</td>
                    <td data-label="Eligibility">{course.eligibilityShort}</td>
                    <td data-label="1st-Sem Total Fees" className={styles.tableFee}>
                      {course.fees.total}
                    </td>
                    <td data-label="Monthly Tuition">{course.fees.tuitionMonthly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal as="p" className={styles.tableNote} variant="fadeUp">
          <Icon icon="mdi:information-outline" aria-hidden="true" />
          <span>
            A one-time application fee of ₹300 applies to every programme. {FEES_NOTE}
          </span>
        </Reveal>
      </Section>

      {/* 5 — Admission CTA: 4-step summary + Samarth pill + Apply / Prospectus */}
      <section className={styles.cta} aria-labelledby="courses-cta-heading">
        <span className={styles.ctaGlow} aria-hidden="true" />
        <Container size="default">
          <RevealGroup className={styles.ctaInner} stagger={0.08} amount={0.2}>
            <Reveal as="p" className={styles.ctaEyebrow} variant="fadeUp">
              Admissions 2026-27 Open
            </Reveal>

            <Reveal
              as="h2"
              id="courses-cta-heading"
              className={styles.ctaHeading}
              variant="fadeUp"
            >
              Four steps to your Gauhati University degree
            </Reveal>

            {/* 4-step summary (titles only — full detail lives on /admissions) */}
            <Reveal as="ol" className={styles.steps} variant="fadeUp">
              {admissionSteps.map((step) => (
                <li key={step.number} className={styles.step}>
                  <span className={styles.stepNo} aria-hidden="true">
                    {step.number}
                  </span>
                  <span className={styles.stepTitle}>{step.title}</span>
                </li>
              ))}
            </Reveal>

            {/* Samarth pill → the official admission portal */}
            <Reveal variant="fadeUp">
              <a
                className={styles.samarthPill}
                href={collegeInfo.samarthUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon="mdi:shield-account-outline" aria-hidden="true" />
                <span>
                  Samarth Portal · College Code <strong>{collegeInfo.samarthCode}</strong>
                </span>
                <Icon
                  icon="mdi:open-in-new"
                  className={styles.samarthExternal}
                  aria-hidden="true"
                />
              </a>
            </Reveal>

            <Reveal className={styles.ctaActions} variant="fadeUp">
              <Button
                variant="primary"
                size="large"
                startIcon="mdi:school-outline"
                onClick={() => openLeadDrawer('apply-now', { source: 'courses-cta' })}
              >
                Apply Now
              </Button>
              <Button
                variant="outline"
                size="large"
                startIcon="mdi:file-download-outline"
                onClick={() => openLeadDrawer('prospectus', { source: 'courses-cta' })}
              >
                Download Prospectus
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

export default Courses;
