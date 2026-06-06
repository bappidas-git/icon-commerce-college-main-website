/* ============================================
   ErrorBoundary — global + per-section render guard (prompt 35)
   Icon Commerce College
   --------------------------------------------
   Catches render-time errors in its subtree so a thrown component never
   blanks the whole app. Two presentations:

     • variant="page" (default) — a full navy card ("Something went wrong",
       reload + back-to-home). Wraps the router in App.jsx.
     • variant="section" — a compact, recoverable inline card with a "Try
       again" reset, used per-section on Home so one failed section can't take
       the rest of the page down with it.

   Errors are logged to the console only (no third-party error logging in this
   project). A class component is required here — error boundaries have no hook
   equivalent.
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';
import { collegeInfo } from '../../../data/collegeInfo';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleReset = this.handleReset.bind(this);
    this.handleReload = this.handleReload.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Console only — keep a useful trace for debugging without shipping a
    // logging dependency.
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Caught a render error:', error, info);
  }

  handleReset() {
    // Clear the error and re-render the subtree. Recovers transient render
    // failures and re-attempts a failed lazy-chunk import (section variant).
    this.setState({ hasError: false });
    if (typeof this.props.onReset === 'function') this.props.onReset();
  }

  handleReload() {
    if (typeof window !== 'undefined') window.location.reload();
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const { variant = 'page', title, message } = this.props;

    // Per-section: quiet, inline, recoverable — never dominates the page.
    if (variant === 'section') {
      return (
        <div className={styles.section} role="alert">
          <Icon
            icon="mdi:cloud-off-outline"
            className={styles.sectionIcon}
            aria-hidden="true"
          />
          <p className={styles.sectionText}>
            {message || "This section couldn't load."}
          </p>
          <button
            type="button"
            className={styles.sectionBtn}
            onClick={this.handleReset}
          >
            <Icon icon="mdi:refresh" aria-hidden="true" />
            <span>Try again</span>
          </button>
        </div>
      );
    }

    // Full-page fallback (navy card).
    return (
      <main className={styles.page} role="alert">
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <Icon icon="mdi:alert-circle-outline" aria-hidden="true" />
          </div>
          <h1 className={styles.title}>{title || 'Something went wrong'}</h1>
          <p className={styles.message}>
            {message ||
              `An unexpected error stopped this page from loading. Please reload to try again — if it keeps happening, call us at ${collegeInfo.phones[0]}.`}
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.reloadBtn}
              onClick={this.handleReload}
            >
              <Icon icon="mdi:refresh" aria-hidden="true" />
              <span>Reload page</span>
            </button>
            <a href="/" className={styles.homeBtn}>
              <Icon icon="mdi:home-outline" aria-hidden="true" />
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;
