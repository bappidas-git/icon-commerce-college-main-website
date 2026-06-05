/* ============================================
   Gallery — unified photo + video gallery (prompt 22)
   Icon Commerce College
   --------------------------------------------
   Replaces the /gallery ComingSoon shell with a single page that unifies the
   old separate photo and video galleries:

     PageHero → intro → accessible Tabs ("Photos" | "Videos")
       • Photos  → category filter chips + responsive masonry + lightbox
       • Videos  → responsive cards + lazy-loaded YouTube modal

   Everything renders from galleryData (12 placeholder photos + seed videos).
   The two tab panels own their own layout and modal state (PhotoGallery /
   VideoGallery) so this shell stays thin; <Tabs> implements the WAI-ARIA
   tablist (roving focus, role="tab"/"tabpanel"). SEO uses useSeo() with the
   /gallery route defaults from src/config/seo.js.
   ============================================ */

import React from 'react';

import useSeo from '../../components/common/SEO/useSeo';
import PageHero from '../../components/common/PageHero/PageHero';
import Section from '../../components/common/Section/Section';
import Tabs from '../../components/common/Tabs/Tabs';

import PhotoGallery from './PhotoGallery';
import VideoGallery from './VideoGallery';
import { galleryPhotos, galleryVideos, galleryCategories } from '../../data/galleryData';
import styles from './Gallery.module.css';

const Gallery = () => {
  // /gallery route SEO defaults (title, description, keywords) from config/seo.js.
  useSeo();

  const tabs = [
    {
      label: 'Photos',
      icon: 'mdi:image-multiple-outline',
      content: <PhotoGallery photos={galleryPhotos} categories={galleryCategories} />,
    },
    {
      label: 'Videos',
      icon: 'mdi:play-circle-outline',
      content: <VideoGallery videos={galleryVideos} />,
    },
  ];

  return (
    <>
      {/* 1 — Hero */}
      <PageHero
        eyebrow="Moments"
        title="Gallery"
        subtitle="Photos and videos from campus life, classrooms, sports and cultural events at Icon Commerce College."
        image="hero-students"
        breadcrumb={[{ label: 'Gallery' }]}
      />

      {/* 2 — Tabbed gallery (Photos | Videos) */}
      <Section
        bg="light"
        container="wide"
        eyebrow="Our Gallery"
        title="Life at Icon Commerce College"
        subtitle="A glimpse of our campus and college life — browse the photo gallery or watch our videos."
        align="center"
      >
        <Tabs
          tabs={tabs}
          variant="underline"
          align="center"
          className={styles.tabs}
        />
      </Section>
    </>
  );
};

export default Gallery;
