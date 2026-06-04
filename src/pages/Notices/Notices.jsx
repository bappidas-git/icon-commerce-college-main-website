/* ============================================
   Notices — page shell
   Icon Commerce College
   --------------------------------------------
   Shell only. The dynamic notices listing (served
   from the admin store) is built in a later prompt.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHero from '../../components/common/PageHero/PageHero';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';

const Notices = () => {
  useDocumentTitle('Notices');

  return (
    <>
      <PageHero
        eyebrow="Announcements"
        title="Notices"
        subtitle="Official notices and announcements from Icon Commerce College."
      />
      <ComingSoon label="Notices" />
    </>
  );
};

export default Notices;
