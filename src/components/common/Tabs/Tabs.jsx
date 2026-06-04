/* ============================================
   Tabs — accessible tablist
   Icon Commerce College
   --------------------------------------------
   Used by the Course detail page and Departments (by stream). Implements
   the WAI-ARIA tabs pattern: roving focus with Arrow/Home/End keys,
   `role="tab"`/`role="tabpanel"`, and `aria-selected`/`aria-controls`
   wiring. The active indicator is an animated gold "shuttle" underline
   (static under `prefers-reduced-motion`).

   Usage:
     <Tabs
       tabs={[{ label, content, icon? }, ...]}
       defaultIndex={0}
       onChange={(i) => ...}
     />
   ============================================ */

import React, { useState, useId, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import styles from './Tabs.module.css';

/**
 * @param {{label: React.ReactNode, content: React.ReactNode, icon?: string}[]} tabs
 * @param {number}  defaultIndex  Initially selected tab.
 * @param {(index: number) => void} onChange  Fired on selection change.
 * @param {'underline'|'pill'} variant  Visual style of the tablist.
 * @param {'left'|'center'} align  Tablist alignment.
 * @param {boolean} sticky  Pin the tablist below the fixed header while its
 *                          panel scrolls (used by the Course detail sub-nav).
 */
const Tabs = ({
  tabs = [],
  defaultIndex = 0,
  onChange,
  variant = 'underline',
  align = 'left',
  sticky = false,
  className = '',
}) => {
  const [active, setActive] = useState(defaultIndex);
  const baseId = useId();
  const tabRefs = useRef([]);

  const select = useCallback(
    (index) => {
      setActive(index);
      if (onChange) onChange(index);
    },
    [onChange]
  );

  // Roving keyboard navigation (Arrow / Home / End).
  const onKeyDown = useCallback(
    (event) => {
      const count = tabs.length;
      let next = null;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          next = (active + 1) % count;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          next = (active - 1 + count) % count;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = count - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      select(next);
      tabRefs.current[next]?.focus();
    },
    [active, tabs.length, select]
  );

  const classNames = [
    styles.tabs,
    styles[variant],
    styles[`align-${align}`],
    sticky ? styles.sticky : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      <div role="tablist" className={styles.tablist} aria-orientation="horizontal">
        {tabs.map((tab, index) => {
          const isActive = index === active;
          const tabId = `${baseId}-tab-${index}`;
          const panelId = `${baseId}-panel-${index}`;
          return (
            <button
              key={index}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={tabId}
              role="tab"
              type="button"
              className={`${styles.tab} ${isActive ? styles.active : ''}`}
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={onKeyDown}
            >
              {tab.icon && (
                <Icon icon={tab.icon} className={styles.tabIcon} aria-hidden="true" />
              )}
              <span>{tab.label}</span>
              {isActive && variant === 'underline' && (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  className={styles.indicator}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      {tabs.map((tab, index) => {
        const isActive = index === active;
        const tabId = `${baseId}-tab-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div
            key={index}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isActive}
            tabIndex={0}
            className={styles.panel}
          >
            {isActive && tab.content}
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;
