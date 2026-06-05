/* ============================================
   Faculty — teaching-staff directory (prompt 20)
   Icon Commerce College
   --------------------------------------------
   A professional /faculty page replacing the old ComingSoon shell:

     PageHero → intro (prospectus credentials) → Leadership & Coordinators
     highlight strip → searchable/filterable faculty directory → Guest Faculty.

   Everything renders from facultyData / guestFaculty. The directory supports a
   department filter (chips derived from the data) AND a live name search; the
   two combine, with an accessible role="status" result count and an EmptyState
   when nothing matches. The Principal, Academic Advisor and programme
   coordinators are pulled into a highlight strip up top yet remain in the
   directory below so a search for any of them still resolves.

   Reveal-on-scroll is reduced-motion safe (<Reveal>/<RevealGroup>); card hover
   lifts are CSS-only (the Leadership/Departments precedent). SEO uses useSeo()
   with the /faculty route defaults (src/config/seo.js) plus an ItemList schema
   of the teaching staff (Person each, worksFor the college).
   ============================================ */

import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';

import useSeo from '../../components/common/SEO/useSeo';
import PageHero from '../../components/common/PageHero/PageHero';
import Section from '../../components/common/Section/Section';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import { Reveal, RevealGroup } from '../../components/common/Reveal/Reveal';

import FacultyCard from './FacultyCard';
import { facultyData, guestFaculty } from '../../data/facultyData';
import { generateFacultyListSchema } from '../../utils/seo';
import { slugify } from '../../utils/formatters';
import styles from './Faculty.module.css';

// Pre-resolve each member with a stable id (slug) for React keys.
const faculty = facultyData.map((member) => ({ ...member, id: slugify(member.name) }));
const guests = guestFaculty.map((member) => ({ ...member, id: slugify(member.name) }));

// Principal, Academic Advisor and the programme coordinators (the highlight strip).
const featured = faculty.filter((member) => member.featured);

// Page-level Person ItemList schema covers regular + guest teaching staff.
const facultySchema = generateFacultyListSchema([...facultyData, ...guestFaculty]);

// Department filter chips, derived from the data: "All" + one per department,
// ordered by department size (then A→Z) so the busiest streams lead.
const deptCounts = faculty.reduce((acc, member) => {
  acc[member.department] = (acc[member.department] || 0) + 1;
  return acc;
}, {});

const DEPT_FILTERS = [
  { key: 'all', label: 'All', count: faculty.length },
  ...Object.entries(deptCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ key: label, label, count })),
];

// Intro credential strip + points (design-system §6 / prospectus — no fabrication).
const CREDENTIALS = ['Ph.D.', 'M.Phil.', 'NET', 'SLET'];

const INTRO_POINTS = [
  {
    icon: 'mdi:school-outline',
    title: 'Highly qualified',
    text: 'Ph.D., M.Phil., NET and SLET qualified teachers across Commerce, Arts and Computer Application.',
  },
  {
    icon: 'mdi:flask-outline',
    title: 'Research-active',
    text: 'Around one-third of our faculty are actively pursuing further research and publication.',
  },
  {
    icon: 'mdi:account-heart-outline',
    title: 'Mentor-based guidance',
    text: 'Every student is mentored individually, with a faculty-maintained development record.',
  },
];

const Faculty = () => {
  // /faculty route SEO defaults + the teaching-staff ItemList schema.
  useSeo({ schema: facultySchema });

  const [activeDept, setActiveDept] = useState('all');
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  // Department filter AND name search combine.
  const filtered = useMemo(
    () =>
      faculty.filter((member) => {
        if (activeDept !== 'all' && member.department !== activeDept) return false;
        if (!normalizedQuery) return true;
        return `${member.name} ${member.designation} ${member.department}`
          .toLowerCase()
          .includes(normalizedQuery);
      }),
    [activeDept, normalizedQuery]
  );

  const resetFilters = () => {
    setActiveDept('all');
    setQuery('');
  };

  return (
    <>
      {/* 1 — Hero */}
      <PageHero
        eyebrow="Our People"
        title="Our Faculty"
        subtitle="Experienced, qualified & research-active educators committed to knowledge and character."
        image="hero-students"
        breadcrumb={[{ label: 'Faculty' }]}
      />

      {/* 2 — Intro (prospectus credentials) */}
      <Section
        bg="white"
        container="default"
        align="center"
        eyebrow="Teaching Excellence"
        title="Experienced, qualified & research-active educators"
        subtitle="Icon Commerce College is taught by a dedicated team of teachers across Commerce, Arts and Computer Application. Our faculty are highly qualified and research-active, and mentor every student individually under the NEP 2020 framework."
        aria-label="About our faculty"
      >
        <RevealGroup as="ul" className={styles.creds} stagger={0.06} amount={0.3}>
          {CREDENTIALS.map((cred) => (
            <Reveal as="li" key={cred} className={styles.cred} variant="scaleIn">
              <Icon icon="mdi:certificate-outline" aria-hidden="true" />
              <span>{cred}</span>
            </Reveal>
          ))}
        </RevealGroup>

        <RevealGroup as="ul" className={styles.points} stagger={0.08} amount={0.2}>
          {INTRO_POINTS.map((point) => (
            <Reveal as="li" key={point.title} className={styles.point} variant="fadeUp">
              <span className={styles.pointIcon} aria-hidden="true">
                <Icon icon={point.icon} />
              </span>
              <h3 className={styles.pointTitle}>{point.title}</h3>
              <p className={styles.pointText}>{point.text}</p>
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      {/* 3 — Leadership & Coordinators highlight (pulled to the top) */}
      <Section
        bg="light"
        container="wide"
        eyebrow="Leadership & Coordinators"
        title="The people who lead our academics"
        subtitle="Our Principal, Academic Advisor and the programme coordinators (B.Com / BBA, BCA and B.A.) guide teaching and learning across every stream."
        aria-label="Faculty leadership and programme coordinators"
      >
        <RevealGroup as="ul" className={styles.highlightGrid} stagger={0.07} amount={0.1}>
          {featured.map((member) => (
            <Reveal as="li" key={member.id} className={styles.featuredCell} variant="fadeUp">
              <FacultyCard member={member} />
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      {/* 4 — Faculty directory (department filter + name search + grid) */}
      <Section
        bg="white"
        container="wide"
        eyebrow="Faculty Directory"
        title="Our teaching staff"
        subtitle="Browse the full faculty, filter by department or search by name."
        aria-label="Faculty directory"
      >
        <div className={styles.controls}>
          <div
            className={styles.filterBar}
            role="group"
            aria-label="Filter faculty by department"
          >
            {DEPT_FILTERS.map((filter) => {
              const isActive = activeDept === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  className={`${styles.filter} ${isActive ? styles.filterActive : ''}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveDept(filter.key)}
                >
                  <span>{filter.label}</span>
                  <span className={styles.filterCount} aria-hidden="true">
                    {filter.count}
                  </span>
                  <span className={styles.srOnly}>{filter.count} faculty members</span>
                </button>
              );
            })}
          </div>

          <div className={styles.search} role="search">
            <Icon icon="mdi:magnify" className={styles.searchIcon} aria-hidden="true" />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search faculty by name…"
              aria-label="Search faculty by name"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                className={styles.clear}
                aria-label="Clear search"
                onClick={() => setQuery('')}
              >
                <Icon icon="mdi:close" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <p className={styles.resultCount} role="status">
          Showing <strong>{filtered.length}</strong> of <strong>{faculty.length}</strong>{' '}
          {faculty.length === 1 ? 'member' : 'members'}
          {activeDept !== 'all' && (
            <>
              {' '}
              in <strong>{activeDept}</strong>
            </>
          )}
          {normalizedQuery && (
            <>
              {' '}
              matching “<strong>{query.trim()}</strong>”
            </>
          )}
          .
        </p>

        {filtered.length > 0 ? (
          <RevealGroup as="ul" className={styles.directoryGrid} stagger={0.05} amount={0.05}>
            {filtered.map((member) => (
              <Reveal as="li" key={member.id} className={styles.directoryCell} variant="fadeUp">
                <FacultyCard member={member} />
              </Reveal>
            ))}
          </RevealGroup>
        ) : (
          <EmptyState
            icon="mdi:account-search-outline"
            title="No faculty found"
            description="Try a different name, or clear the filters to see the full teaching staff."
            action={{ label: 'Clear filters', variant: 'navy', onClick: resetFilters }}
          />
        )}
      </Section>

      {/* 5 — Guest Faculty */}
      {guests.length > 0 && (
        <Section
          bg="light"
          container="default"
          eyebrow="Visiting Experts"
          title="Guest Faculty"
          subtitle="Our classrooms are further enriched by distinguished guest faculty who share their subject expertise with our students."
          aria-label="Guest faculty"
        >
          <RevealGroup as="ul" className={styles.highlightGrid} stagger={0.08} amount={0.2}>
            {guests.map((member) => (
              <Reveal as="li" key={member.id} className={styles.guestCell} variant="fadeUp">
                <FacultyCard member={member} />
              </Reveal>
            ))}
          </RevealGroup>
        </Section>
      )}
    </>
  );
};

export default Faculty;
