/* ============================================
   CourseDetail — page shell
   Icon Commerce College
   --------------------------------------------
   Reads the `:slug` route param and 404s on an
   unknown course. The full course detail layout
   (overview, fees, eligibility, documents, careers)
   is built in a later prompt.
   ============================================ */

import React from 'react';
import { useParams } from 'react-router-dom';
import { getCourseBySlug } from '../../data/coursesData';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHero from '../../components/common/PageHero/PageHero';
import ComingSoon from '../../components/common/ComingSoon/ComingSoon';
import NotFound from '../NotFound/NotFound';

const CourseDetail = () => {
  const { slug } = useParams();
  const course = getCourseBySlug(slug);

  // Unknown slug → render the 404 page.
  useDocumentTitle(course ? course.shortName : null);

  if (!course) {
    return <NotFound />;
  }

  return (
    <>
      <PageHero
        eyebrow={course.affiliation}
        title={course.name}
        subtitle={course.summary}
      />
      <ComingSoon label={course.shortName} />
    </>
  );
};

export default CourseDetail;
