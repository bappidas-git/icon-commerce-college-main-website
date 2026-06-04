/* ============================================
   Leadership — page shell
   Icon Commerce College
   --------------------------------------------
   Shell only. "From the Desk of …" messages are
   built in a later prompt.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHero from '../../components/common/PageHero/PageHero';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';

const Leadership = () => {
  useDocumentTitle('Leadership');

  return (
    <>
      <PageHero
        eyebrow="Messages from the Desks"
        title="Leadership"
        subtitle="Guidance from the President, Principal and the leadership of Icon Commerce College."
      />
      <ComingSoon label="Leadership" />
    </>
  );
};

export default Leadership;
