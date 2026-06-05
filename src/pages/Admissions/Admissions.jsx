/* ============================================
   Admissions — admission process, eligibility, fees & prospectus (prompt 23)
   Icon Commerce College
   --------------------------------------------
   The full /admissions page:

     PageHero (Admissions 2026-27 · Apply CTA · breadcrumb)
       → How to Apply  — 4-step Samarth process + "Go to Samarth Portal"
                          (official URL) + "Apply / Enquire" drawer CTA
       → Eligibility   — general note + per-programme cards (from coursesData)
       → Fee structure — accessible Tabs of per-programme fee tables (data)
       → Documents & Scholarships — verification checklist + scholarship note
       → Admission FAQ — Accordion + FAQPage JSON-LD (kept in sync via useSeo)
       → CTA band      — Apply / Download Prospectus (lead-gated) / Call

   Every fee/eligibility figure renders from `coursesData` (single source of
   truth); the process, documents, scholarship note and FAQ come from
   `admissionData`. The prospectus download is lead-gated via <ProspectusButton>
   — it opens the lead drawer and only downloads after a successful submit.
   Reveal-on-scroll is reduced-motion safe; hover lifts are CSS-only.
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';

import useSeo from '../../components/common/SEO/useSeo';
import PageHero from '../../components/common/PageHero/PageHero';
import Section from '../../components/common/Section/Section';
import Container from '../../components/common/Container/Container';
import Button from '../../components/common/Button/Button';
import Tabs from '../../components/common/Tabs/Tabs';
import Accordion from '../../components/common/Accordion/Accordion';
import { Reveal, RevealGroup } from '../../components/common/Reveal/Reveal';
import ProspectusButton from '../../components/common/ProspectusDownload/ProspectusButton';

import { useModal } from '../../context/ModalContext';
import { admissionData } from '../../data/admissionData';
import { coursesData } from '../../data/coursesData';
import { collegeInfo, phoneHref } from '../../data/collegeInfo';
import styles from './Admissions.module.css';

// Current admission intake (matches the seed notices / site CTAs, §6).
const ADMISSION_SESSION = '2026-27';
// Hero <h1> variant with a non-breaking hyphen (U+2011) so the year never
// splits mid-token (e.g. "2026-" / "27") during the font-display:swap FOUT or
// at very narrow widths — it wraps at the space instead.
const HERO_SESSION = ADMISSION_SESSION.replace('-', '‑');

/* ------------------------------------------------------------------
   Per-programme fee table (reused inside each Fees tab).
   ------------------------------------------------------------------ */
const FeeTable = ({ course }) => (
  <div className={styles.feePanel}>
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
  </div>
);

const Admissions = () => {
  // Apply per-route SEO meta and keep the FAQPage schema in sync with the FAQ
  // actually rendered on the page (overrides the default admissions faqs).
  useSeo({ faqs: admissionData.faqs });

  const { openLeadDrawer } = useModal();

  const openApply = (source) => openLeadDrawer('apply-now', { source });

  const feeTabs = coursesData.map((course) => ({
    label: course.shortName,
    icon: 'mdi:tag-outline',
    content: <FeeTable course={course} />,
  }));

  return (
    <>
      {/* 1 — Hero */}
      <PageHero
        eyebrow="Admissions Open"
        title={`Admissions ${HERO_SESSION}`}
        subtitle="Affiliated to Gauhati University · NEP 2020 (FYUGP)"
        image="hero-students"
        breadcrumb={[{ label: 'Admissions' }]}
        cta={{
          label: 'Apply Now',
          onClick: () => openApply('admissions-hero'),
          icon: 'mdi:school-outline',
        }}
      />

      {/* 2 — How to Apply (4-step Samarth process) */}
      <Section
        bg="white"
        container="wide"
        eyebrow="Get Started"
        title="How to Apply"
        subtitle="Admission is through the Gauhati University Samarth portal — College Code 842. Four simple steps from registration to confirmation."
        aria-label="How to apply"
      >
        <RevealGroup as="ol" className={styles.steps} stagger={0.08} amount={0.15}>
          {admissionData.steps.map((step) => (
            <Reveal as="li" key={step.number} className={styles.step} variant="fadeUp">
              <span className={styles.stepNumber} aria-hidden="true">
                {step.number}
              </span>
              <span className={styles.stepChip} aria-hidden="true">
                <Icon icon={step.icon} />
              </span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.description}</p>
            </Reveal>
          ))}
        </RevealGroup>

        <Reveal className={styles.actionRow} variant="fadeUp">
          <Button
            variant="navy"
            size="large"
            href={admissionData.samarthUrl}
            target="_blank"
            startIcon="mdi:shield-account-outline"
            endIcon="mdi:open-in-new"
          >
            Go to Samarth Portal
          </Button>
          <Button
            variant="primary"
            size="large"
            startIcon="mdi:account-edit-outline"
            onClick={() => openApply('admissions-how')}
          >
            Apply / Enquire
          </Button>
        </Reveal>
      </Section>

      {/* 3 — Eligibility */}
      <Section
        bg="light"
        container="wide"
        eyebrow="Who Can Apply"
        title="Eligibility"
        subtitle={admissionData.eligibilityNote}
        aria-label="Eligibility"
      >
        <RevealGroup as="ul" className={styles.eligGrid} stagger={0.08} amount={0.15}>
          {coursesData.map((course) => (
            <Reveal as="li" key={course.slug} className={styles.eligCard} variant="fadeUp">
              <div className={styles.eligHead}>
                <span className={styles.eligBadge}>{course.shortName}</span>
                <h3 className={styles.eligName}>{course.name}</h3>
              </div>
              <p className={styles.eligText}>{course.eligibility}</p>
              <p className={styles.eligShort}>
                <Icon icon="mdi:check-decagram-outline" aria-hidden="true" />
                <span>{course.eligibilityShort}</span>
              </p>
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      {/* 4 — Fee structure (per-programme tabs) */}
      <Section
        bg="white"
        container="default"
        eyebrow="Fees"
        title="Fee Structure"
        subtitle="First-semester fees by programme. Select a programme to see the full breakdown."
        aria-label="Fee structure"
      >
        <Reveal variant="fadeUp">
          <Tabs tabs={feeTabs} align="center" className={styles.feeTabs} />
        </Reveal>
      </Section>

      {/* 5 + 6 — Documents required & Scholarships */}
      <Section
        bg="light"
        container="wide"
        eyebrow="Before You Come"
        title="Documents & Scholarships"
        subtitle="What to carry for verification — and how we help with scholarships."
        aria-label="Documents and scholarships"
      >
        <div className={styles.docsGrid}>
          <Reveal className={styles.docsCol} variant="fadeUp">
            <h3 className={styles.blockTitle}>
              <Icon icon="mdi:file-document-multiple-outline" aria-hidden="true" />
              Documents required
            </h3>
            <p className={styles.muted}>
              Bring the originals along with a set of self-attested photocopies
              for verification at the time of admission.
            </p>
            <ul className={styles.checklist}>
              {admissionData.documents.map((doc) => (
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

          <Reveal className={styles.scholarship} variant="fadeUp">
            <span className={styles.scholarshipIcon} aria-hidden="true">
              <Icon icon="mdi:hand-coin-outline" />
            </span>
            <h3 className={styles.blockTitle}>Scholarships</h3>
            <p className={styles.scholarshipText}>{admissionData.scholarshipNote}</p>
            <a className={styles.scholarshipLink} href={phoneHref()}>
              <Icon icon="mdi:phone-outline" aria-hidden="true" />
              Talk to the admission office
            </a>
          </Reveal>
        </div>
      </Section>

      {/* 7 — Admission FAQ (Accordion + FAQPage schema) */}
      <Section
        bg="white"
        container="narrow"
        eyebrow="Questions"
        title="Admission FAQ"
        subtitle="Quick answers on eligibility, fees, dates, hostel and how to reach us."
        aria-label="Admission frequently asked questions"
      >
        <Reveal variant="fadeUp">
          <Accordion items={faqItems(admissionData.faqs)} defaultOpen={[0]} accent="gold" />
        </Reveal>
      </Section>

      {/* 8 — CTA band (navy + gold glow) */}
      <section className={styles.cta} aria-labelledby="admissions-cta-heading">
        <span className={styles.ctaGlow} aria-hidden="true" />
        <Container size="default">
          <RevealGroup className={styles.ctaInner} stagger={0.08} amount={0.3}>
            <Reveal as="p" className={styles.ctaEyebrow} variant="fadeUp">
              Admissions {ADMISSION_SESSION} Open
            </Reveal>

            <Reveal
              as="h2"
              id="admissions-cta-heading"
              className={styles.ctaHeading}
              variant="fadeUp"
            >
              Ready to join Icon Commerce College?
            </Reveal>

            <Reveal as="p" className={styles.ctaSubtitle} variant="fadeUp">
              Apply through the Samarth portal under College Code{' '}
              {collegeInfo.samarthCode}, or let our admission team guide you from
              enquiry to enrolment.
            </Reveal>

            <Reveal variant="fadeUp">
              <a
                className={styles.samarthPill}
                href={admissionData.samarthUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon="mdi:shield-account-outline" aria-hidden="true" />
                <span>
                  Samarth Portal · College Code{' '}
                  <strong>{collegeInfo.samarthCode}</strong>
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
                onClick={() => openApply('admissions-cta')}
              >
                Apply Now
              </Button>
              {/* Lead-gated: opens the drawer, downloads only after a submit. */}
              <ProspectusButton variant="outline" size="large" />
              <Button
                variant="outline"
                size="large"
                href={phoneHref()}
                startIcon="mdi:phone-outline"
              >
                Call Admissions
              </Button>
            </Reveal>
          </RevealGroup>
        </Container>
      </section>
    </>
  );
};

// Map the admission FAQ data onto the Accordion's { title, content } shape.
function faqItems(faqs) {
  return faqs.map((faq) => ({
    title: faq.question,
    content: <p className={styles.faqAnswer}>{faq.answer}</p>,
  }));
}

export default Admissions;
