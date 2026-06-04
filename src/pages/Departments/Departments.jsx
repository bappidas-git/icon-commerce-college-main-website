/* ============================================
   Departments — page shell
   Icon Commerce College
   --------------------------------------------
   Shell only. Departments grouped by Arts / Commerce
   / Science are built in a later prompt.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHero from '../../components/common/PageHero/PageHero';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';

const Departments = () => {
  useDocumentTitle('Departments');

  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="Departments"
        subtitle="Departments across Arts, Commerce and Science at Icon Commerce College."
      />
      <ComingSoon label="Departments" />
    </>
  );
};

export default Departments;
