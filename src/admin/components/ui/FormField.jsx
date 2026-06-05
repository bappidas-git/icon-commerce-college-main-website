/* ============================================
   FormField — shared admin UI
   ============================================
   Labelled field wrapper used by every admin form (Leads notes, Notices,
   Events, Settings). Wraps any control (MUI or native input) with a
   consistent label, required marker, hint and error slot.
   ============================================ */

import React from 'react';
import styles from './FormField.module.css';

const FormField = ({ label, htmlFor, required = false, hint, error, children, className = '' }) => (
  <div className={`${styles.field} ${className}`.trim()}>
    {label && (
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
    )}
    {children}
    {error ? (
      <p className={styles.error} role="alert">
        {error}
      </p>
    ) : hint ? (
      <p className={styles.hint}>{hint}</p>
    ) : null}
  </div>
);

export default FormField;
