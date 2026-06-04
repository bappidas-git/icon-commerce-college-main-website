/* ============================================
   Contact — page shell
   Icon Commerce College
   --------------------------------------------
   Shell only. The contact form, map and info are
   built in a later prompt.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHero from '../../components/common/PageHero/PageHero';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';

const Contact = () => {
  useDocumentTitle('Contact');

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="Rajgarh Road, Chandmari, Guwahati – 781003 · +91 93653 75782 · iconcom.2004@gmail.com"
      />
      <ComingSoon label="Contact" />
    </>
  );
};

export default Contact;
