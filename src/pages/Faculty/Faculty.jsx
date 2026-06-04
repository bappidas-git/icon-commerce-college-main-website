/* ============================================
   Faculty — page shell
   Icon Commerce College
   --------------------------------------------
   Shell only. Teaching-staff listing is built in a
   later prompt.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHero from '../../components/common/PageHero/PageHero';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';

const Faculty = () => {
  useDocumentTitle('Faculty');

  return (
    <>
      <PageHero
        eyebrow="Our People"
        title="Faculty"
        subtitle="Qualified and experienced teaching staff guiding our students."
      />
      <ComingSoon label="Faculty" />
    </>
  );
};

export default Faculty;
