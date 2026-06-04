/* ============================================
   ProgramCard — single program card (prompt 13)
   Icon Commerce College
   --------------------------------------------
   The rich card used in the Home programs teaser (and reusable on /courses): a
   placeholder course image with a gold shortName badge (+ an optional
   "Most Popular" ribbon), the program name and duration, an optional
   eligibility one-liner, the first three highlight ticks, a 1st-semester
   "starting fees" hint, and two actions — "View Details" → /courses/:slug and
   "Apply" → the global `apply-now` lead drawer pre-set to this program.

   Props:
     course           (object)  — a record from coursesData (required).
     source           (string)  — lead `source` recorded when "Apply" is clicked
                                   (default 'home-programs'; /courses passes
                                   'courses-grid').
     showEligibility  (boolean) — render the eligibility one-liner (default
                                   false; the larger /courses cards opt in).

   Motion is split the same way as the rest of the site: the scroll entrance is
   owned by the outer <Reveal> in ProgramsSection while the hover lift + gold
   accent are pure CSS here, so the two never fight over `transform`.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useModal } from '../../../context/ModalContext';
import styles from './ProgramCard.module.css';

// Show the first three highlights as quick ticks (design-system §6).
const MAX_TICKS = 3;

const ProgramCard = ({ course, source = 'home-programs', showEligibility = false }) => {
  const { openLeadDrawer } = useModal();

  // Open the global lead drawer in "apply-now" mode, pre-selecting this program.
  // `programInterest` is the course shortName, which matches the form's
  // PROGRAM_OPTIONS so the Program select mounts already filled (design-system §8).
  const handleApply = () => {
    openLeadDrawer('apply-now', {
      source,
      programInterest: course.shortName,
    });
  };

  const ticks = course.highlights.slice(0, MAX_TICKS);

  return (
    <article className={styles.card}>
      {/* Media — placeholder course image + gold shortName badge */}
      <div className={styles.media}>
        <img
          src={course.image}
          alt={`${course.name} at Icon Commerce College`}
          className={styles.image}
          loading="lazy"
        />
        <span className={styles.shortBadge}>{course.shortName}</span>
        {course.badge && <span className={styles.ribbon}>{course.badge}</span>}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <p className={styles.duration}>
          <Icon icon="mdi:clock-outline" aria-hidden="true" />
          {course.duration}
        </p>

        <h3 className={styles.name}>{course.name}</h3>

        {/* Optional eligibility one-liner (the larger /courses cards opt in) */}
        {showEligibility && (
          <p className={styles.eligibility}>
            <Icon
              icon="mdi:school-outline"
              className={styles.eligibilityIcon}
              aria-hidden="true"
            />
            <span>
              <span className={styles.eligibilityLabel}>Eligibility:</span>{' '}
              {course.eligibility}
            </span>
          </p>
        )}

        <ul className={styles.ticks}>
          {ticks.map((tick) => (
            <li key={tick} className={styles.tick}>
              <Icon
                icon="mdi:check-circle"
                className={styles.tickIcon}
                aria-hidden="true"
              />
              <span>{tick}</span>
            </li>
          ))}
        </ul>

        {/* Starting-fees hint — 1st-semester total (design-system §6) */}
        <p className={styles.fees}>
          <Icon icon="mdi:tag-outline" className={styles.feesIcon} aria-hidden="true" />
          <span className={styles.feesValue}>{course.fees.total}</span>
          <span className={styles.feesLabel}>1st-semester fees</span>
        </p>

        {/* Actions — navy-outline "View Details" link + navy-filled "Apply" */}
        <div className={styles.actions}>
          <Link
            to={`/courses/${course.slug}`}
            className={styles.btnView}
            aria-label={`View details of ${course.name}`}
          >
            View Details
          </Link>
          <button
            type="button"
            className={styles.btnApply}
            onClick={handleApply}
            aria-label={`Apply for ${course.name}`}
          >
            Apply
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProgramCard;
