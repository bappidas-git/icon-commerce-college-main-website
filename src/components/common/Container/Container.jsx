/* ============================================
   Container — centered, max-width content wrapper
   Icon Commerce College
   --------------------------------------------
   Constrains content to the design-system widths (§3): 1200px default,
   1320px "wide". Provides the horizontal page gutters used everywhere.
   ============================================ */

import React from 'react';
import styles from './Container.module.css';

/**
 * @param {React.ElementType} as     Element/tag to render (default 'div').
 * @param {'default'|'wide'|'narrow'|'fluid'} size  Max-width preset.
 * @param {boolean} gutter   Apply horizontal page padding (default true).
 */
const Container = ({
  as: Tag = 'div',
  size = 'default',
  gutter = true,
  className = '',
  children,
  ...props
}) => {
  const classNames = [
    styles.container,
    styles[size],
    gutter ? styles.gutter : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classNames} {...props}>
      {children}
    </Tag>
  );
};

export default Container;
