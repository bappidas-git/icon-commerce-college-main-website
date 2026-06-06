/* ============================================
   Notices — notices & announcements listing (prompt 24)
   Icon Commerce College
   --------------------------------------------
   Replaces the /notices ComingSoon shell with the full listing:

     PageHero (Notices & Announcements · breadcrumb)
       → controls: search box + category filter chips
       → list of <NoticeCard>s (pinned first, then newest — from useNotices())
         with a "Load more" pager
       → <EmptyState> when there are no notices, or no search/filter matches

   Data comes from `useNotices()`, now wired to the live notices.php store
   (published-only, silent seed fallback) — same record shape, so this page is
   untouched. Sorting (pinned first, newest next) is owned by the hook; this page
   only filters, searches and pages. SEO uses useSeo() with the /notices defaults.
   ============================================ */

import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';

import useSeo from '../../components/common/SEO/useSeo';
import PageHero from '../../components/common/PageHero/PageHero';
import Section from '../../components/common/Section/Section';
import Button from '../../components/common/Button/Button';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import InlineNotice from '../../components/common/InlineNotice';
import { Reveal } from '../../components/common/Reveal/Reveal';

import useNotices from '../../hooks/useNotices';
import NoticeCard from './NoticeCard';
import styles from './Notices.module.css';

const PAGE_SIZE = 6;

const Notices = () => {
  useSeo();

  const { items, loading, error, reload } = useNotices();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Category chips — 'All' + the categories actually present (first-seen order).
  const categories = useMemo(() => {
    const seen = [];
    items.forEach((n) => {
      if (n.category && !seen.includes(n.category)) seen.push(n.category);
    });
    return ['All', ...seen];
  }, [items]);

  // Filter by category + free-text search across title and body.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((n) => {
      if (category !== 'All' && n.category !== category) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        (n.body || '').toLowerCase().includes(q)
      );
    });
  }, [items, category, query]);

  // Reset the pager whenever the result set changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, category]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
  };

  return (
    <>
      {/* 1 — Hero */}
      <PageHero
        eyebrow="Announcements"
        title="Notices & Announcements"
        subtitle="Official notices and announcements from Icon Commerce College — admissions, examinations and important updates."
        image="hero-library"
        breadcrumb={[{ label: 'Notices' }]}
      />

      {/* 2 — Listing */}
      <Section bg="light" container="default" aria-label="Notices listing">
        <div className={styles.board}>
          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.search}>
              <Icon icon="mdi:magnify" className={styles.searchIcon} aria-hidden="true" />
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search notices…"
                aria-label="Search notices"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div
              className={styles.filters}
              role="group"
              aria-label="Filter notices by category"
            >
              {categories.map((cat) => {
                const active = cat === category;
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                    aria-pressed={active}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live store unreachable — saved notices are shown below; offer a retry. */}
          {error && (
            <InlineNotice
              icon="mdi:wifi-alert"
              action={{ label: 'Retry', icon: 'mdi:refresh', onClick: reload }}
            >
              We couldn&apos;t load the latest notices, so you&apos;re seeing saved
              ones. Check your connection and try again.
            </InlineNotice>
          )}

          {/* Result summary */}
          {!loading && items.length > 0 && filtered.length > 0 && (
            <p className={styles.count} role="status">
              {filtered.length === items.length
                ? `${items.length} ${items.length === 1 ? 'notice' : 'notices'}`
                : `Showing ${visible.length} of ${filtered.length} ${
                    filtered.length === 1 ? 'notice' : 'notices'
                  }`}
            </p>
          )}

          {/* List / empty states */}
          {items.length === 0 ? (
            <EmptyState
              icon="mdi:bullhorn-outline"
              title="No notices yet"
              description="New announcements will appear here as soon as they're published."
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="mdi:file-search-outline"
              title="No matching notices"
              description="Try a different search term or category."
              action={{ label: 'Clear filters', onClick: clearFilters, variant: 'navy' }}
            />
          ) : (
            <>
              <ul className={styles.list}>
                {visible.map((notice) => (
                  <Reveal as="li" key={notice.id} variant="fadeUp" amount={0.1}>
                    <NoticeCard notice={notice} />
                  </Reveal>
                ))}
              </ul>

              {hasMore && (
                <div className={styles.more}>
                  <Button
                    variant="outline"
                    size="large"
                    endIcon="mdi:chevron-down"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  >
                    Load more notices
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Section>
    </>
  );
};

export default Notices;
