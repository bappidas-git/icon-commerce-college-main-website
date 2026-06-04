/* ============================================
   Courses — page shell
   Icon Commerce College
   --------------------------------------------
   Shell only. The programs overview (B.Com, BBA,
   BCA, B.A.) is built in a later prompt.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHero from '../../components/common/PageHero/PageHero';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';

const Courses = () => {
  useDocumentTitle('Courses');

  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Our Courses"
        subtitle="Four UG programs under NEP 2020 (FYUGP), affiliated to Gauhati University — B.Com, BBA, BCA and B.A."
      />
      <ComingSoon label="Courses" />
    </>
  );
};

export default Courses;
