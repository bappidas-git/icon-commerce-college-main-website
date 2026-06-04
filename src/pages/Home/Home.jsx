/* ============================================
   Home — page shell
   Icon Commerce College
   --------------------------------------------
   Shell only. The full home page (hero, programs,
   stats, facilities, testimonials, CTA) is assembled
   across prompts 11–14.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHero from '../../components/common/PageHero/PageHero';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';

const Home = () => {
  useDocumentTitle('Icon Commerce College, Guwahati');

  return (
    <>
      <PageHero
        eyebrow="Established 2004 · Guwahati, Assam"
        title="Icon Commerce College"
        subtitle="Where Knowledge Meets Character — empowering Commerce, Arts & Computer Application graduates, affiliated to Gauhati University (NEP 2020 / FYUGP)."
      />
      <ComingSoon label="home" />
    </>
  );
};

export default Home;
