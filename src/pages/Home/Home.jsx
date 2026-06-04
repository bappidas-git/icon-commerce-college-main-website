/* ============================================
   Home — page shell
   Icon Commerce College
   --------------------------------------------
   The full home page (programs, stats, facilities,
   testimonials, CTA) is assembled across prompts 11–14.
   Prompt 11 adds the hero + highlights strip; prompt 12
   adds the about teaser, vision/mission and stats band;
   prompt 13 adds the programs teaser and why-choose band;
   the remaining sections follow in later prompts.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import HeroSection from '../../components/sections/HeroSection';
import HighlightsSection from '../../components/sections/HighlightsSection';
import AboutSection from '../../components/sections/AboutSection';
import VisionMission from '../../components/sections/VisionMission';
import StatsSection from '../../components/sections/StatsSection';
import ProgramsSection from '../../components/sections/ProgramsSection';
import WhyChoose from '../../components/sections/WhyChoose';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';

const Home = () => {
  useDocumentTitle('Icon Commerce College, Guwahati');

  return (
    <>
      <HeroSection />
      <HighlightsSection />
      <AboutSection />
      <VisionMission />
      <StatsSection />
      <ProgramsSection />
      <WhyChoose />
      <ComingSoon label="home" />
    </>
  );
};

export default Home;
