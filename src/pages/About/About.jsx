/* ============================================
   About — page shell
   Icon Commerce College
   --------------------------------------------
   Shell only. Profile, history, vision & mission and
   accreditation content is built in a later prompt.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHero from '../../components/common/PageHero/PageHero';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';

const About = () => {
  useDocumentTitle('About');

  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="About Icon Commerce College"
        subtitle="A Commerce, Arts & Computer Application college established in 2004 under the Icon Academy Trust."
      />
      <ComingSoon label="About" />
    </>
  );
};

export default About;
