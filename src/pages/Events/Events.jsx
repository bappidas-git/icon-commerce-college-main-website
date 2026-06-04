/* ============================================
   Events — page shell
   Icon Commerce College
   --------------------------------------------
   Shell only. The events listing + calendar (served
   from the admin store) is built in a later prompt.
   ============================================ */

import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHero from '../../components/common/PageHero/PageHero';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';

const Events = () => {
  useDocumentTitle('Events');

  return (
    <>
      <PageHero
        eyebrow="What's On"
        title="Events"
        subtitle="College Week, ICON Shield, ICON Trophy and more — campus events through the year."
      />
      <ComingSoon label="Events" />
    </>
  );
};

export default Events;
