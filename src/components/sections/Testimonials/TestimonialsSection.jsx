/* ============================================
   TestimonialsSection — Home alumni voices carousel (prompt 14)
   Icon Commerce College
   --------------------------------------------
   A Swiper carousel of alumni quotes from `testimonialsData` — navy cards with
   a gold quote mark, avatar, name and role. Autoplay is pausable (stops on
   hover / focus) and is disabled entirely under prefers-reduced-motion; the
   carousel still rewinds and stays keyboard- and pagination-navigable.

   `rewind` is used instead of `loop` so Swiper never clones slides (avoiding the
   "not enough slides for loop" warning with the seeded quote count) while still
   returning to the start after the last slide.
   ============================================ */

import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, A11y, Keyboard } from 'swiper/modules';
import { Icon } from '@iconify/react';
import { useReducedMotion } from 'framer-motion';
import Section from '../../common/Section/Section';
import Img from '../../common/Img';
import { Reveal } from '../../common/Reveal/Reveal';
import EmptyState from '../../common/EmptyState/EmptyState';
import { testimonialsData } from '../../../data/testimonialsData';
import styles from './TestimonialsSection.module.css';

import 'swiper/css';
import 'swiper/css/pagination';

const TestimonialsSection = () => {
  const reduced = useReducedMotion();

  // Drop any not-yet-transcribed quotes (TODO stubs) so the Home page only
  // ever shows finished alumni voices (the rest are finalised in prompt 37).
  const testimonials = useMemo(
    () => testimonialsData.filter((t) => !/^todo/i.test(t.quote.trim())),
    []
  );

  // Pausable autoplay, disabled when the user prefers reduced motion.
  const autoplay = reduced
    ? false
    : { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true };

  return (
    <Section
      bg="light"
      container="wide"
      eyebrow="Alumni Voices"
      title="What our students say"
      subtitle="Graduates of Icon Commerce College now build careers in law, academics, banking, government and enterprise."
      aria-label="Alumni testimonials"
    >
      {testimonials.length ? (
        <Reveal className={styles.carousel} variant="fadeUp">
          <Swiper
            modules={[Autoplay, Pagination, A11y, Keyboard]}
            autoplay={autoplay}
            rewind
            keyboard={{ enabled: true }}
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
            grabCursor
            a11y={{ enabled: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={`${t.name}-${t.role}`} className={styles.slide}>
                <figure className={styles.card}>
                  <Icon
                    icon="mdi:format-quote-open"
                    className={styles.quoteMark}
                    aria-hidden="true"
                  />
                  <blockquote className={styles.quote}>{t.quote}</blockquote>
                  <figcaption className={styles.person}>
                    <Img
                      src={t.avatar}
                      alt={t.name}
                      className={styles.avatar}
                      width="52"
                      height="52"
                      fallback="testimonial-avatar"
                    />
                    <span className={styles.meta}>
                      <span className={styles.name}>{t.name}</span>
                      <span className={styles.role}>{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </Reveal>
      ) : (
        <EmptyState
          icon="mdi:comment-quote-outline"
          title="Testimonials coming soon"
          description="Hear from our alumni here shortly."
        />
      )}
    </Section>
  );
};

export default TestimonialsSection;
