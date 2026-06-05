/* ============================================
   PhotoGallery — filterable masonry + lightbox (prompt 22)
   Icon Commerce College
   --------------------------------------------
   The "Photos" tab: category filter chips, a responsive CSS-columns masonry of
   the placeholder photos (images are loading="lazy"), and an accessible
   lightbox built on the generic <Modal/>. The lightbox supports prev/next
   (buttons + ←/→ keys) and Esc (handled by <Modal/>); its content is only
   rendered while open. Filtering and navigation both operate on the *filtered*
   set. Entrance is a single reduced-motion-safe fade on the grid (per-tile
   transforms inside CSS columns are avoided — the Facilities precedent); tile
   and image hover lifts are CSS-only.
   ============================================ */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';

import Modal from '../../components/common/Modal/Modal';
import { Reveal } from '../../components/common/Reveal/Reveal';
import styles from './PhotoGallery.module.css';

// A deterministic aspect-ratio cycle gives the uniform placeholders a genuine
// "masonry" stagger (object-fit: cover crops each tile to its slot). Kept
// deterministic so heights don't reshuffle between renders.
const TILE_RATIOS = ['3 / 4', '4 / 3', '1 / 1', '4 / 5', '3 / 4', '4 / 3'];

const PhotoGallery = ({ photos = [], categories = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  // Index into the *filtered* list; null = lightbox closed.
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const lightboxRef = useRef(null);

  const filters = useMemo(() => ['All', ...categories], [categories]);

  const filteredPhotos = useMemo(
    () =>
      activeCategory === 'All'
        ? photos
        : photos.filter((p) => p.category === activeCategory),
    [photos, activeCategory]
  );

  const count = filteredPhotos.length;
  const isOpen = lightboxIndex !== null;
  const activePhoto = isOpen ? filteredPhotos[lightboxIndex] : null;

  // Switching filter closes any open lightbox (its index would be stale).
  const selectCategory = useCallback((category) => {
    setActiveCategory(category);
    setLightboxIndex(null);
  }, []);

  const openLightbox = useCallback((index) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showPrev = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i - 1 + count) % count)),
    [count]
  );
  const showNext = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i + 1) % count)),
    [count]
  );

  // Keyboard arrows while the lightbox is open (Esc is handled by <Modal/>).
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, showPrev, showNext]);

  // Move focus into the dialog on open so arrow keys land inside it.
  useEffect(() => {
    if (!isOpen) return undefined;
    const raf = requestAnimationFrame(() => lightboxRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  return (
    <div className={styles.wrap}>
      {/* Category filter chips */}
      <div
        className={styles.filters}
        role="group"
        aria-label="Filter photos by category"
      >
        {filters.map((category) => {
          const active = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              className={`${styles.chip} ${active ? styles.chipActive : ''}`}
              aria-pressed={active}
              onClick={() => selectCategory(category)}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Masonry */}
      {count > 0 ? (
        <Reveal variant="fadeIn" className={styles.masonry} amount={0.05}>
          {filteredPhotos.map((photo, index) => (
            <button
              key={`${photo.caption}-${index}`}
              type="button"
              className={styles.tile}
              style={{ aspectRatio: TILE_RATIOS[index % TILE_RATIOS.length] }}
              onClick={() => openLightbox(index)}
              aria-label={`Open “${photo.caption}” in the lightbox`}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className={styles.tileImage}
                loading="lazy"
              />
              <span className={styles.tileOverlay} aria-hidden="true">
                <span className={styles.tileCaption}>{photo.caption}</span>
                <Icon icon="mdi:magnify-plus-outline" className={styles.tileIcon} />
              </span>
            </button>
          ))}
        </Reveal>
      ) : (
        <p className={styles.empty}>No photos in this category yet.</p>
      )}

      {/* Lightbox — header-less <Modal/>; content rendered only while open */}
      <Modal
        isOpen={isOpen}
        onClose={closeLightbox}
        maxWidth="xl"
        showCloseButton={false}
        contentClassName={styles.lightboxContent}
        aria-label="Photo gallery viewer"
      >
        {activePhoto && (
          <div className={styles.lightbox} ref={lightboxRef} tabIndex={-1}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={closeLightbox}
              aria-label="Close gallery viewer"
            >
              <Icon icon="mdi:close" />
            </button>

            <div className={styles.stage}>
              {count > 1 && (
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.prevBtn}`}
                  onClick={showPrev}
                  aria-label="Previous photo"
                >
                  <Icon icon="mdi:chevron-left" />
                </button>
              )}

              <img
                src={activePhoto.src}
                alt={activePhoto.caption}
                className={styles.stageImage}
              />

              {count > 1 && (
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.nextBtn}`}
                  onClick={showNext}
                  aria-label="Next photo"
                >
                  <Icon icon="mdi:chevron-right" />
                </button>
              )}
            </div>

            <div className={styles.bar}>
              <p className={styles.barCaption}>{activePhoto.caption}</p>
              <div className={styles.barMeta}>
                <span className={styles.barCategory}>{activePhoto.category}</span>
                <span className={styles.barCounter}>
                  {lightboxIndex + 1} / {count}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PhotoGallery;
