/* ============================================
   Facilities — page shell
   Icon Commerce College
   --------------------------------------------
   Shell only. Campus facilities are built in a later
   prompt.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHero from '../../components/common/PageHero/PageHero';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';

const Facilities = () => {
  useDocumentTitle('Facilities');

  return (
    <>
      <PageHero
        eyebrow="Campus Life"
        title="Facilities"
        subtitle="Digital library, computer lab, smart classrooms, canteen, Wi-Fi, playground and more."
      />
      <ComingSoon label="Facilities" />
    </>
  );
};

export default Facilities;
