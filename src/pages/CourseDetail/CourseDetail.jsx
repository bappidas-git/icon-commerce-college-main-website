/* ============================================
   CourseDetail — data-driven course template (prompt 18)
   Icon Commerce College
   --------------------------------------------
   One reusable detail page for all four UG programmes (B.Com · BBA · BCA ·
   B.A.), driven entirely by `coursesData` — no per-course markup. Reads the
   `:slug` route param, 404s on an unknown course, and lays out:

     PageHero (shortName badge · duration · affiliation · breadcrumb · Apply CTA)
       → two-column body:
           • sticky Tabs sub-nav — Overview · Eligibility · Fees · Curriculum · Careers
           • sticky side rail — quick facts + Apply / Prospectus / Talk to admissions
             + related programmes
       → navy bottom CTA (Samarth pill + Apply / Prospectus)
       → "Explore other programmes" ProgramCard grid.

   Every figure (fees, eligibility, careers, curriculum) renders from data; the
   detailed GU syllabus link is a TODO until the client supplies it, so the
   Curriculum tab shows a disabled "coming soon" button rather than a broken
   link or an embedded Drive viewer. Per-course SEO + the Course JSON-LD schema
   are applied by useSeo() via the /courses/:slug route resolver (src/utils/seo.js).
   Reveal-on-scroll is reduced-motion safe; card/hover lifts are CSS-only.
   ============================================ */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

import useSeo from '../../components/common/SEO/useSeo';
import PageHero from '../../components/common/PageHero/PageHero';
import Section from '../../components/common/Section/Section';
import Container from '../../components/common/Container/Container';
import Button from '../../components/common/Button/Button';
import Tabs from '../../components/common/Tabs/Tabs';
import ProspectusButton from '../../components/common/ProspectusDownload/ProspectusButton';
import { Reveal, RevealGroup } from '../../components/common/Reveal/Reveal';
import ProgramCard from '../../components/sections/ProgramsSection/ProgramCard';
import NotFound from '../NotFound/NotFound';

import { useModal } from '../../context/ModalContext';
import { coursesData, getCourseBySlug, fyugpCurriculum } from '../../data/coursesData';
import { collegeInfo, phoneHref } from '../../data/collegeInfo';
import styles from './CourseDetail.module.css';

// Current admission intake (matches the seed notices / site CTAs, §6).
const ADMISSION_SESSION = '2026-27';

/* ============================================================
   Tab panels — pure, data-driven presentational blocks.
   ============================================================ */

const OverviewPanel = ({ course }) => (
  <Reveal className={styles.panelBlock} variant="fadeUp">
    <p className={styles.lead}>{course.summary}</p>

    <ul className={styles.factRow}>
      <li>
        <span className={styles.factLabel}>Level</span>
        <span className={styles.factValue}>{course.level}</span>
      </li>
      <li>
        <span className={styles.factLabel}>Duration</span>
        <span className={styles.factValue}>{course.duration}</span>
      </li>
      <li>
        <span className={styles.factLabel}>Affiliation</span>
        <span className={styles.factValue}>{course.affiliation}</span>
      </li>
    </ul>

    <h3 className={styles.blockTitle}>Programme highlights</h3>
    <ul className={styles.ticks}>
      {course.highlights.map((item) => (
        <li key={item} className={styles.tick}>
          <Icon icon="mdi:check-circle" className={styles.tickIcon} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>

    {/* Programme objectives — present for BCA (from the prospectus). */}
    {course.objectives?.length > 0 && (
      <>
        <h3 className={styles.blockTitle}>Programme objectives</h3>
        <ul className={styles.checklist}>
          {course.objectives.map((item) => (
            <li key={item} className={styles.checkItem}>
              <Icon
                icon="mdi:bullseye-arrow"
                className={styles.checkIcon}
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </>
    )}

    {/* Indicative topics covered — present for BCA (from the prospectus). */}
    {course.topics?.length > 0 && (
      <>
        <h3 className={styles.blockTitle}>What you’ll study</h3>
        <ul className={styles.topicList}>
          {course.topics.map((topic) => (
            <li key={topic} className={styles.topic}>
              {topic}
            </li>
          ))}
        </ul>
      </>
    )}
  </Reveal>
);

const EligibilityPanel = ({ course }) => (
  <Reveal className={styles.panelBlock} variant="fadeUp">
    <div className={styles.callout}>
      <Icon
        icon="mdi:school-outline"
        className={styles.calloutIcon}
        aria-hidden="true"
      />
      <div>
        <h3 className={styles.calloutTitle}>Who can apply</h3>
        <p className={styles.calloutText}>{course.eligibility}</p>
      </div>
    </div>

    <h3 className={styles.blockTitle}>Documents for verification</h3>
    <p className={styles.muted}>
      Carry the originals along with a set of self-attested photocopies for
      verification at the time of admission.
    </p>
    <ul className={styles.checklist}>
      {course.documents.map((doc) => (
        <li key={doc} className={styles.checkItem}>
          <Icon
            icon="mdi:file-check-outline"
            className={styles.checkIcon}
            aria-hidden="true"
          />
          <span>{doc}</span>
        </li>
      ))}
    </ul>
  </Reveal>
);

const FeesPanel = ({ course }) => (
  <Reveal className={styles.panelBlock} variant="fadeUp">
    <div className={styles.feeTableWrap}>
      <table className={styles.feeTable}>
        <caption className={styles.srOnly}>
          First-semester fee breakdown for {course.shortName}.
        </caption>
        <thead>
          <tr>
            <th scope="col">Particular</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          {course.fees.rows.map((row) => (
            <tr key={row.particular}>
              <th scope="row">{row.particular}</th>
              <td>{row.amount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={styles.feeTotal}>
            <th scope="row">1st-Semester Total</th>
            <td>{course.fees.total}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <ul className={styles.feeFacts}>
      <li>
        <span className={styles.factLabel}>Monthly tuition</span>
        <span className={styles.factValue}>{course.fees.tuitionMonthly}</span>
      </li>
      <li>
        <span className={styles.factLabel}>Application fee</span>
        <span className={styles.factValue}>{course.fees.application}</span>
      </li>
    </ul>

    <p className={styles.note}>
      <Icon icon="mdi:information-outline" aria-hidden="true" />
      <span>{course.fees.note}</span>
    </p>
  </Reveal>
);

const CurriculumPanel = ({ course }) => {
  // A real URL (http…) renders an external link; a TODO renders a disabled
  // "coming soon" button rather than a broken link / embedded Drive viewer.
  const hasSyllabus = /^https?:\/\//i.test(course.syllabusUrl || '');

  return (
    <Reveal className={styles.panelBlock} variant="fadeUp">
      <p className={styles.lead}>
        The {course.shortName} curriculum follows the {course.affiliation} (
        {collegeInfo.affiliationNote}) framework — discipline-specific Major and
        Minor papers are prescribed in the university syllabus.
      </p>
      <p className={styles.muted}>{fyugpCurriculum.summary}</p>

      <h3 className={styles.blockTitle}>Course components</h3>
      <ul className={styles.componentGrid}>
        {fyugpCurriculum.components.map((comp) => (
          <li key={comp.title} className={styles.componentCard}>
            <span className={styles.componentChip} aria-hidden="true">
              <Icon icon={comp.icon} />
            </span>
            <div>
              <h4 className={styles.componentTitle}>{comp.title}</h4>
              <p className={styles.componentText}>{comp.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <h3 className={styles.blockTitle}>Awards &amp; exit options</h3>
      <ol className={styles.exitList}>
        {fyugpCurriculum.exits.map((exit) => (
          <li key={exit.after} className={styles.exitItem}>
            <span className={styles.exitAfter}>{exit.after}</span>
            <Icon
              icon="mdi:arrow-right-thin"
              className={styles.exitArrow}
              aria-hidden="true"
            />
            <span className={styles.exitAward}>{exit.award}</span>
          </li>
        ))}
      </ol>

      <div className={styles.syllabusRow}>
        {hasSyllabus ? (
          <Button
            variant="navy"
            href={course.syllabusUrl}
            target="_blank"
            startIcon="mdi:file-document-outline"
            endIcon="mdi:open-in-new"
          >
            Detailed syllabus
          </Button>
        ) : (
          <>
            <Button variant="navy" disabled startIcon="mdi:file-document-outline">
              Detailed syllabus
            </Button>
            <span className={styles.syllabusNote}>
              <Icon icon="mdi:clock-outline" aria-hidden="true" />
              Detailed Gauhati University syllabus link coming soon.
            </span>
          </>
        )}
      </div>
    </Reveal>
  );
};

const CareersPanel = ({ course }) => (
  <Reveal className={styles.panelBlock} variant="fadeUp">
    <p className={styles.lead}>
      A {course.shortName} from Icon Commerce College opens doors across higher
      study and the workplace. Common career paths include:
    </p>
    <ul className={styles.careerGrid}>
      {course.careers.map((career) => (
        <li key={career} className={styles.careerCard}>
          <Icon
            icon="mdi:arrow-right-circle-outline"
            className={styles.careerIcon}
            aria-hidden="true"
          />
          <span>{career}</span>
        </li>
      ))}
    </ul>
  </Reveal>
);

/* ============================================================
   Page
   ============================================================ */

const CourseDetail = () => {
  const { slug } = useParams();
  const course = getCourseBySlug(slug);

  // Per-course SEO + Course JSON-LD are resolved from the /courses/:slug route
  // (src/utils/seo.js). An unknown slug resolves to the 404 SEO automatically.
  useSeo();

  const { openLeadDrawer } = useModal();

  // Unknown slug → 404.
  if (!course) {
    return <NotFound />;
  }

  // Apply CTAs pre-select this programme so admission leads are attributed to
  // the right course + page location (design-system §8). The lead-gated
  // prospectus download is handled by <ProspectusButton/> (same preselect).
  const apply = (source) =>
    openLeadDrawer('apply-now', { source, programInterest: course.shortName });

  const otherCourses = coursesData.filter((c) => c.slug !== course.slug);

  const tabs = [
    {
      label: 'Overview',
      icon: 'mdi:information-outline',
      content: <OverviewPanel course={course} />,
    },
    {
      label: 'Eligibility',
      icon: 'mdi:clipboard-check-outline',
      content: <EligibilityPanel course={course} />,
    },
    {
      label: 'Fees',
      icon: 'mdi:tag-outline',
      content: <FeesPanel course={course} />,
    },
    {
      label: 'Curriculum',
      icon: 'mdi:book-open-variant',
      content: <CurriculumPanel course={course} />,
    },
    {
      label: 'Careers',
      icon: 'mdi:briefcase-outline',
      content: <CareersPanel course={course} />,
    },
  ];

  return (
    <>
      {/* 1 — Hero (course.image is already a placeholder URL; PageHero resolves
          it idempotently). Breadcrumb renders Home / Courses / <shortName>. */}
      <PageHero
        eyebrow="Undergraduate Programme"
        title={course.name}
        subtitle={course.summary}
        image={course.image}
        breadcrumb={[{ label: 'Courses', to: '/courses' }, { label: course.shortName }]}
        cta={{
          label: `Apply for ${course.shortName}`,
          onClick: () => apply('course-detail-hero'),
          icon: 'mdi:school-outline',
        }}
      >
        <ul className={styles.heroMeta}>
          <li className={styles.heroBadge}>{course.shortName}</li>
          <li className={styles.heroPill}>
            <Icon icon="mdi:clock-outline" aria-hidden="true" />
            {course.duration}
          </li>
          <li className={styles.heroPill}>
            <Icon icon="mdi:school-outline" aria-hidden="true" />
            {course.affiliation}
          </li>
        </ul>
      </PageHero>

      {/* 2 — Body: sticky Tabs sub-nav + sticky side rail */}
      <section className={styles.body} aria-label={`${course.name} details`}>
        <Container size="wide">
          <div className={styles.layout}>
            {/* Main — tabbed content */}
            <div className={styles.main}>
              {/* Anchors the panel <h3>s under an h2 so heading order doesn't
                  skip a level (the visible labels are the tab buttons). */}
              <h2 className={styles.srOnly}>Programme information</h2>
              {/* key={slug} resets the active tab to Overview when switching
                  between programmes. */}
              <Tabs key={course.slug} tabs={tabs} sticky />
            </div>

            {/* Side rail — quick facts, actions, related programmes */}
            <aside className={styles.rail} aria-labelledby="course-rail-heading">
              <div className={styles.railCard}>
                <h2 id="course-rail-heading" className={styles.railTitle}>
                  Quick facts
                </h2>
                <dl className={styles.facts}>
                  <div className={styles.factsRow}>
                    <dt>Duration</dt>
                    <dd>{course.duration}</dd>
                  </div>
                  <div className={styles.factsRow}>
                    <dt>Eligibility</dt>
                    <dd>{course.eligibilityShort}</dd>
                  </div>
                  <div className={styles.factsRow}>
                    <dt>1st-Sem Fees</dt>
                    <dd className={styles.factsStrong}>{course.fees.total}</dd>
                  </div>
                  <div className={styles.factsRow}>
                    <dt>Monthly Tuition</dt>
                    <dd>{course.fees.tuitionMonthly}</dd>
                  </div>
                  <div className={styles.factsRow}>
                    <dt>Intake</dt>
                    <dd>{ADMISSION_SESSION} session</dd>
                  </div>
                  <div className={styles.factsRow}>
                    <dt>Affiliation</dt>
                    <dd>{course.affiliation}</dd>
                  </div>
                </dl>

                <div className={styles.railActions}>
                  <Button
                    variant="primary"
                    fullWidth
                    startIcon="mdi:school-outline"
                    onClick={() => apply('course-detail-rail')}
                  >
                    Apply for {course.shortName}
                  </Button>
                  <ProspectusButton
                    variant="outline"
                    fullWidth
                    source="course-detail-rail"
                    programInterest={course.shortName}
                  >
                    Download Prospectus
                  </ProspectusButton>
                  <Button
                    variant="outline"
                    fullWidth
                    href={phoneHref()}
                    startIcon="mdi:phone-outline"
                  >
                    Talk to admissions
                  </Button>
                </div>
                <a className={styles.railPhone} href={phoneHref()}>
                  {collegeInfo.phones[0]}
                </a>
              </div>

              {/* Related programmes (hidden on phones, where the bottom
                  "Explore other programmes" cards cover the same ground). */}
              <div className={styles.railRelated}>
                <h3 className={styles.railSubTitle}>Related programmes</h3>
                <ul className={styles.relatedList}>
                  {otherCourses.map((c) => (
                    <li key={c.slug}>
                      <Link to={`/courses/${c.slug}`} className={styles.relatedLink}>
                        <span className={styles.relatedBadge}>{c.shortName}</span>
                        <span className={styles.relatedName}>{c.name}</span>
                        <Icon
                          icon="mdi:chevron-right"
                          className={styles.relatedChevron}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* 3 — Bottom CTA (navy + gold glow) */}
      <section className={styles.cta} aria-labelledby="course-cta-heading">
        <span className={styles.ctaGlow} aria-hidden="true" />
        <Container size="default">
          <RevealGroup className={styles.ctaInner} stagger={0.08} amount={0.3}>
            <Reveal as="p" className={styles.ctaEyebrow} variant="fadeUp">
              Admissions {ADMISSION_SESSION} Open
            </Reveal>

            <Reveal
              as="h2"
              id="course-cta-heading"
              className={styles.ctaHeading}
              variant="fadeUp"
            >
              Ready to apply for {course.shortName}?
            </Reveal>

            <Reveal as="p" className={styles.ctaSubtitle} variant="fadeUp">
              Secure your seat in the {course.name} programme — apply through the
              Samarth portal under College Code {collegeInfo.samarthCode}, or let
              our admission team guide you.
            </Reveal>

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
                onClick={() => apply('course-detail-cta')}
              >
                Apply for {course.shortName}
              </Button>
              <ProspectusButton
                variant="outline"
                size="large"
                source="course-detail-cta"
                programInterest={course.shortName}
              >
                Download Prospectus
              </ProspectusButton>
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

      {/* 4 — Explore other programmes */}
      <Section
        bg="light"
        container="wide"
        eyebrow="Keep exploring"
        title="Explore other programmes"
        subtitle="Compare the rest of our NEP-2020 undergraduate degrees, affiliated to Gauhati University."
        aria-label="Other undergraduate programmes"
      >
        <RevealGroup className={styles.exploreGrid} stagger={0.08} amount={0.15}>
          {otherCourses.map((c) => (
            <Reveal key={c.slug} className={styles.exploreCell} variant="fadeUp">
              <ProgramCard course={c} source="course-detail-explore" />
            </Reveal>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
};

export default CourseDetail;
