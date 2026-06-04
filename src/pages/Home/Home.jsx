/* ============================================
   Home — page shell
   Icon Commerce College
   --------------------------------------------
   The full home page (programs, stats, facilities,
   testimonials, CTA) is assembled across prompts 11–14.
   Prompt 11 adds the hero + highlights strip at the top;
   the remaining sections follow in later prompts.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import HeroSection from '../../components/sections/HeroSection';
import HighlightsSection from '../../components/sections/HighlightsSection';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';

const Home = () => {
  useDocumentTitle('Icon Commerce College, Guwahati');

  return (
    <>
      <HeroSection />
      <HighlightsSection />
      <ComingSoon label="home" />
    </>
  );
};

export default Home;
