/* ============================================
   Admissions — page shell
   Icon Commerce College
   --------------------------------------------
   Shell only. Admission process, eligibility, fees,
   Samarth portal and prospectus (lead-gated) are
   built in a later prompt.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHero from '../../components/common/PageHero/PageHero';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';

const Admissions = () => {
  useDocumentTitle('Admissions');

  return (
    <>
      <PageHero
        eyebrow="Admissions 2026"
        title="Admission Process"
        subtitle="Apply via the Samarth portal — College Code 842. Eligibility, fees and step-by-step guidance."
      />
      <ComingSoon label="Admissions" />
    </>
  );
};

export default Admissions;
