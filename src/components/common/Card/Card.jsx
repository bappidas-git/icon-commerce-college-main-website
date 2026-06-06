/* ============================================
   Card Component - Landing Page Boilerplate
   Reusable card with multiple variants and animations
   ============================================ */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Img from '../Img';
import styles from './Card.module.css';

const Card = forwardRef(({
  children,
  variant = 'default', // default, elevated, outlined, flat, gradient, dark, feature, stat
  iconVariant = 'gold', // gold, green, purple, orange, pink, red, teal, blue
  icon = null,
  title = null,
  subtitle = null,
  value = null,
  label = null,
  hoverable = true,
  clickable = false,
  selected = false,
  className = '',
  onClick,
  animationDelay = 0,
  ...props
}, ref) => {

  // Animation variants
  const cardVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: animationDelay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: hoverable ? {
      y: -8,
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
      transition: { duration: 0.3 }
    } : {},
    tap: clickable ? {
      scale: 0.98,
      transition: { duration: 0.1 }
    } : {}
  };

  // Build class names
  const classNames = [
    styles.card,
    styles[variant],
    hoverable ? styles.hoverable : '',
    clickable ? styles.clickable : '',
    selected ? styles.selected : '',
    className
  ].filter(Boolean).join(' ');

  // Render icon with colored background
  const renderIcon = () => {
    if (!icon) return null;

    return (
      <div className={`${styles.iconWrapper} ${styles[`icon${iconVariant.charAt(0).toUpperCase() + iconVariant.slice(1)}`]}`}>
        {typeof icon === 'string' ? (
          <Icon icon={icon} className={styles.icon} />
        ) : (
          icon
        )}
      </div>
    );
  };

  // Render for stat cards
  if (variant === 'stat') {
    return (
      <motion.div
        ref={ref}
        className={classNames}
        variants={cardVariants}
        initial="initial"
        whileInView="animate"
        whileHover="hover"
        whileTap={clickable ? "tap" : undefined}
        viewport={{ once: true, margin: "-50px" }}
        onClick={clickable ? onClick : undefined}
        {...props}
      >
        {renderIcon()}
        <div className={styles.statContent}>
          {value && <div className={styles.statValue}>{value}</div>}
          {label && <div className={styles.statLabel}>{label}</div>}
        </div>
      </motion.div>
    );
  }

  // Render for feature cards (used in highlights section)
  if (variant === 'feature') {
    return (
      <motion.div
        ref={ref}
        className={classNames}
        variants={cardVariants}
        initial="initial"
        whileInView="animate"
        whileHover="hover"
        whileTap={clickable ? "tap" : undefined}
        viewport={{ once: true, margin: "-50px" }}
        onClick={clickable ? onClick : undefined}
        {...props}
      >
        {renderIcon()}
        <div className={styles.featureContent}>
          {title && <h4 className={styles.featureTitle}>{title}</h4>}
          {subtitle && <p className={styles.featureSubtitle} style={variant === 'dark' ? { color: '#FFFFFFCC' } : undefined}>{subtitle}</p>}
          {children}
        </div>
      </motion.div>
    );
  }

  // Render for highlight cards with centered icon
  if (variant === 'highlight') {
    return (
      <motion.div
        ref={ref}
        className={classNames}
        variants={cardVariants}
        initial="initial"
        whileInView="animate"
        whileHover="hover"
        whileTap={clickable ? "tap" : undefined}
        viewport={{ once: true, margin: "-50px" }}
        onClick={clickable ? onClick : undefined}
        {...props}
      >
        {renderIcon()}
        <div className={styles.highlightContent}>
          {title && <p className={styles.highlightTitle}>{title}</p>}
        </div>
      </motion.div>
    );
  }

  // Default card render
  return (
    <motion.div
      ref={ref}
      className={classNames}
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      whileTap={clickable ? "tap" : undefined}
      viewport={{ once: true, margin: "-50px" }}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {icon && (
        <div className={styles.cardHeader}>
          {renderIcon()}
          {title && <h4 className={styles.cardTitle}>{title}</h4>}
        </div>
      )}
      {!icon && title && <h4 className={styles.cardTitle}>{title}</h4>}
      {subtitle && <p className={styles.cardSubtitle} style={variant === 'dark' ? { color: '#FFFFFFCC' } : undefined}>{subtitle}</p>}
      {children && <div className={styles.cardContent}>{children}</div>}
    </motion.div>
  );
});

Card.displayName = 'Card';

// Sub-component for card sections
export const CardHeader = ({ children, className = '' }) => (
  <div className={`${styles.cardHeader} ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`${styles.cardContent} ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`${styles.cardFooter} ${className}`}>{children}</div>
);

export const CardImage = ({ src, alt, className = '' }) => (
  <div className={`${styles.cardImageWrapper} ${className}`}>
    <Img src={src} alt={alt} className={styles.cardImage} />
  </div>
);

/* ============================================
   Generic sub-variant cards (prompt 07)
   Specialized cards (ProgramCard / NoticeCard / EventCard) are built on
   top of these in their respective page prompts.
   ============================================ */

/**
 * IconCard — gold icon chip + title + blurb (facilities, feature grids).
 * @param {string} icon       Iconify icon name.
 * @param {string} iconVariant  Icon chip colour (default 'gold').
 */
export const IconCard = ({
  icon,
  iconVariant = 'gold',
  title,
  subtitle,
  children,
  ...props
}) => (
  <Card
    variant="feature"
    icon={icon}
    iconVariant={iconVariant}
    title={title}
    subtitle={subtitle}
    {...props}
  >
    {children}
  </Card>
);

/**
 * ImageCard — top image + title + subtitle + optional content/footer.
 * @param {string} image  Image URL (use utils/assets placeholder()).
 * @param {string} alt    Required alt text.
 */
export const ImageCard = ({
  image,
  alt = '',
  title,
  subtitle,
  footer,
  children,
  className = '',
  ...props
}) => (
  <Card className={className} {...props}>
    {image && <CardImage src={image} alt={alt} />}
    {title && <h4 className={styles.cardTitle}>{title}</h4>}
    {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
    {children && <CardContent>{children}</CardContent>}
    {footer && <CardFooter>{footer}</CardFooter>}
  </Card>
);

/**
 * ProfileCard — circular avatar + name + role (leadership, faculty).
 * @param {string} image  Avatar URL (use utils/assets placeholder()).
 * @param {string} name   Person's name (rendered as the title).
 * @param {string} role   Role / designation.
 */
export const ProfileCard = ({
  image,
  alt,
  name,
  role,
  children,
  className = '',
  ...props
}) => (
  <Card className={`${styles.profileCard} ${className}`} {...props}>
    {image && (
      <div className={styles.avatarWrapper}>
        <Img
          src={image}
          alt={alt || name}
          className={styles.avatar}
          fallback="faculty-placeholder"
        />
      </div>
    )}
    {name && <h4 className={styles.profileName}>{name}</h4>}
    {role && <p className={styles.profileRole}>{role}</p>}
    {children}
  </Card>
);

/**
 * StatCard — gold/navy stat figure + label (thin wrapper over variant="stat").
 * @param {React.ReactNode} value  The figure (e.g. '40+').
 * @param {string} label  Caption beneath the figure.
 */
export const StatCard = ({ value, label, icon, iconVariant = 'gold', ...props }) => (
  <Card
    variant="stat"
    value={value}
    label={label}
    icon={icon}
    iconVariant={iconVariant}
    {...props}
  />
);

export default Card;
