/* ============================================
   Gallery — page shell
   Icon Commerce College
   --------------------------------------------
   Shell only. The photo + video gallery is built in
   a later prompt.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHero from '../../components/common/PageHero/PageHero';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';

const Gallery = () => {
  useDocumentTitle('Gallery');

  return (
    <>
      <PageHero
        eyebrow="Moments"
        title="Gallery"
        subtitle="Photos and videos from campus life, events and celebrations."
      />
      <ComingSoon label="Gallery" />
    </>
  );
};

export default Gallery;
