/* ============================================
   Home — full page assembly (prompt 14)
   Icon Commerce College
   --------------------------------------------
   Final Home composition (prompts 11–14):
     Hero → Highlights → About → Vision/Mission → Programs → Stats →
     WhyChoose → Notices & Events → Leadership → Testimonials → CTA.

   The hero + highlights strip render eagerly (above the fold, owns the LCP).
   Everything below the fold is code-split with `React.lazy` + `Suspense` so the
   initial Home bundle stays small (helps Lighthouse mobile perf) and the heavy
   Swiper carousel only loads with its section.

   Each section already owns its reveal-on-scroll entrance via Reveal/RevealGroup
   (reduced-motion safe), so sections are NOT wrapped in an extra <Reveal> here —
   doing so would double-animate against the section's internal "shuttle" stagger
   (the WhyChoose / ProgramCard precedent). The Suspense fallback reserves
   vertical space to limit layout shift while a chunk loads.
   ============================================ */

import React, { Suspense, lazy } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

// Above the fold — eager.
import HeroSection from '../../components/sections/HeroSection';
import HighlightsSection from '../../components/sections/HighlightsSection';

// Below the fold — code-split.
const AboutSection = lazy(() => import('../../components/sections/AboutSection'));
const VisionMission = lazy(() => import('../../components/sections/VisionMission'));
const ProgramsSection = lazy(() => import('../../components/sections/ProgramsSection'));
const StatsSection = lazy(() => import('../../components/sections/StatsSection'));
const WhyChoose = lazy(() => import('../../components/sections/WhyChoose'));
const NoticeBoardSection = lazy(() => import('../../components/sections/NoticeBoard'));
const LeadershipTeaser = lazy(() => import('../../components/sections/LeadershipTeaser'));
const TestimonialsSection = lazy(() => import('../../components/sections/Testimonials'));
const HomeCTASection = lazy(() => import('../../components/sections/HomeCTA'));

// Spacer fallback — reserves height so the page doesn't jump while a section
// chunk streams in (no visible spinner; sections fade in via their own Reveal).
const LazySection = ({ minHeight = 480, children }) => (
  <Suspense fallback={<div style={{ minHeight }} aria-hidden="true" />}>
    {children}
  </Suspense>
);

const Home = () => {
  useDocumentTitle('Icon Commerce College, Guwahati');

  return (
    <>
      <HeroSection />
      <HighlightsSection />

      <LazySection minHeight={560}>
        <AboutSection />
      </LazySection>
      <LazySection minHeight={480}>
        <VisionMission />
      </LazySection>
      <LazySection minHeight={560}>
        <ProgramsSection />
      </LazySection>
      <LazySection minHeight={360}>
        <StatsSection />
      </LazySection>
      <LazySection minHeight={520}>
        <WhyChoose />
      </LazySection>
      <LazySection minHeight={520}>
        <NoticeBoardSection />
      </LazySection>
      <LazySection minHeight={520}>
        <LeadershipTeaser />
      </LazySection>
      <LazySection minHeight={480}>
        <TestimonialsSection />
      </LazySection>
      <LazySection minHeight={360}>
        <HomeCTASection />
      </LazySection>
    </>
  );
};

export default Home;
