/* ============================================
   VideoGallery — video cards + lazy YouTube modal (prompt 22)
   Icon Commerce College
   --------------------------------------------
   The "Videos" tab: responsive cards (thumbnail + play badge + title), each a
   single accessible button. Clicking opens the generic <Modal/> with a 16:9
   YouTube embed that is only mounted while the modal is open and never
   autoplays on load (perf). Seed videos still carry a "TODO …" id until the
   client supplies the real YouTube id, so those open a tasteful "coming soon"
   panel instead of a broken iframe — the embed wires up automatically once a
   real id is filled in. Entrance is reduced-motion-safe (<RevealGroup>); card
   and thumbnail hover lifts are CSS-only.
   ============================================ */

import React, { useState } from 'react';
import { Icon } from '@iconify/react';

import Modal from '../../components/common/Modal/Modal';
import { Reveal, RevealGroup } from '../../components/common/Reveal/Reveal';
import styles from './VideoGallery.module.css';

// A seed video carries a placeholder "TODO …" id until the client provides the
// real YouTube id; treat those as "coming soon" rather than embedding a broken
// frame.
const hasRealId = (id) => Boolean(id) && !/^todo/i.test(String(id).trim());

const VideoGallery = ({ videos = [] }) => {
  const [activeVideo, setActiveVideo] = useState(null);

  const openVideo = (video) => setActiveVideo(video);
  const closeVideo = () => setActiveVideo(null);

  const playable = activeVideo && hasRealId(activeVideo.youtubeId);

  return (
    <div className={styles.wrap}>
      {videos.length > 0 ? (
        <RevealGroup as="ul" className={styles.grid} stagger={0.08} amount={0.15}>
          {videos.map((video, index) => (
            <Reveal
              as="li"
              key={`${video.title}-${index}`}
              className={styles.cell}
              variant="fadeUp"
            >
              <button
                type="button"
                className={styles.card}
                onClick={() => openVideo(video)}
                aria-label={`Play video: ${video.title}`}
              >
                <span className={styles.thumbWrap}>
                  <img
                    src={video.thumb}
                    alt={`${video.title} thumbnail`}
                    className={styles.thumb}
                    loading="lazy"
                  />
                  <span className={styles.play} aria-hidden="true">
                    <Icon icon="mdi:play" />
                  </span>
                </span>
                <span className={styles.cardTitle}>{video.title}</span>
              </button>
            </Reveal>
          ))}
        </RevealGroup>
      ) : (
        <p className={styles.empty}>Videos will be added soon.</p>
      )}

      {/* Video modal — iframe is only mounted while open (lazy, no autoplay) */}
      <Modal
        isOpen={activeVideo !== null}
        onClose={closeVideo}
        maxWidth="xl"
        title={activeVideo ? activeVideo.title : undefined}
      >
        {activeVideo && (
          <div className={styles.frame}>
            {playable ? (
              <iframe
                className={styles.iframe}
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0`}
                title={activeVideo.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className={styles.comingSoon}>
                <Icon icon="mdi:movie-open-play-outline" aria-hidden="true" />
                <p className={styles.comingSoonTitle}>Video coming soon</p>
                <p className={styles.comingSoonText}>
                  This video will be available here once the college publishes it.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VideoGallery;
