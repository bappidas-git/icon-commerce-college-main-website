/* ============================================
   Section — vertical-rhythm page section
   Icon Commerce College
   --------------------------------------------
   Wraps a block of page content with the standard vertical padding
   (design-system §4: clamp(56px, 8vw, 112px)), an optional background
   tone, an inner <Container>, and an optional <SectionTitle> header.
   ============================================ */

import React from 'react';
import Container from '../Container/Container';
import SectionTitle from '../SectionTitle/SectionTitle';
import styles from './Section.module.css';

/**
 * @param {React.ElementType} as   Element/tag (default 'section').
 * @param {'light'|'white'|'navy'|'gold-soft'} bg  Background tone.
 * @param {'default'|'wide'|'narrow'|'fluid'} container  Inner container width.
 * @param {string}  eyebrow   Gold uppercase label (renders a SectionTitle).
 * @param {string}  title     Section heading (renders a SectionTitle).
 * @param {string}  subtitle  Section sub-heading.
 * @param {'left'|'center'|'right'} align  Header alignment.
 * @param {boolean} noContainer  Render children without the inner Container.
 * @param {string}  id        Anchor id for in-page navigation.
 */
const Section = ({
  as: Tag = 'section',
  bg = 'light',
  container = 'default',
  eyebrow,
  title,
  subtitle,
  align = 'center',
  noContainer = false,
  className = '',
  id,
  children,
  ...props
}) => {
  const isDark = bg === 'navy';

  const classNames = [
    styles.section,
    styles[`bg-${bg}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const header = (title || eyebrow) && (
    <SectionTitle
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      align={align}
      variant={isDark ? 'dark' : 'light'}
    />
  );

  const body = (
    <>
      {header}
      {children}
    </>
  );

  return (
    <Tag id={id} className={classNames} {...props}>
      {noContainer ? body : <Container size={container}>{body}</Container>}
    </Tag>
  );
};

export default Section;
