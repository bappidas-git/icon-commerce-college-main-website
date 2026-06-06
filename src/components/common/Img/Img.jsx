/* ============================================
   Img — production-ready image primitive (prompt 36)
   Icon Commerce College
   --------------------------------------------
   A thin, drop-in replacement for a bare <img> that bakes in the
   performance + resilience defaults the whole site needs so no call
   site has to remember them:

     • loading="lazy" + decoding="async" by default (off the critical
       path); pass `priority` for an above-the-fold image to switch to
       eager loading + fetchpriority="high".
     • a gold→white shimmer placeholder while the file loads (cleared on
       load), so a slow real photo never shows as a blank gap. The
       shimmer is reduced-motion safe.
     • a graceful onError fallback to a labelled §7 placeholder, so a
       missing/renamed production asset degrades to the swap-me card
       instead of a broken-image icon (guarded so the fallback can't
       loop).

   It renders a single <img> and forwards `className` untouched, so the
   existing per-component CSS (which already owns sizing / aspect-ratio /
   object-fit / border-radius, keeping CLS at bay) is preserved exactly —
   this is a behavioural upgrade, not a layout change.

   Production swap: keep referencing the logical placeholder names via
   utils/assets; drop real files into public/images/... (see
   docs/images.md and design-system §7) and pass real width/height (or an
   `aspectRatio`) so the box is reserved before the photo arrives.
   ============================================ */

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { placeholder } from '../../../utils/assets';
import styles from './Img.module.css';

/**
 * Resolve a `fallback` value to a URL. A bare logical name
 * ('faculty-placeholder') is resolved through the §7 placeholder map; a
 * value that already looks like a path/URL is used as-is.
 */
const resolveFallback = (fallback) => {
  if (!fallback) return placeholder('og-default');
  const str = String(fallback);
  return str.includes('/') ? str : placeholder(str);
};

const Img = forwardRef(
  (
    {
      src,
      alt = '',
      width,
      height,
      aspectRatio,
      className = '',
      priority = false,
      fallback = 'og-default',
      sizes,
      style,
      onLoad,
      onError,
      ...rest
    },
    ref
  ) => {
    // 'loading' shows the shimmer; 'ready' (loaded or errored) clears it.
    const [status, setStatus] = useState('loading');
    // Guard so a broken fallback image can't retrigger onError forever.
    const erroredRef = useRef(false);

    // If the source changes (e.g. gallery lightbox prev/next), re-arm the
    // shimmer + error guard for the new file.
    useEffect(() => {
      setStatus('loading');
      erroredRef.current = false;
    }, [src]);

    const handleLoad = (event) => {
      setStatus('ready');
      if (onLoad) onLoad(event);
    };

    const handleError = (event) => {
      if (!erroredRef.current) {
        erroredRef.current = true;
        setStatus('ready');
      }
      if (onError) onError(event);
    };

    const showFallback = erroredRef.current || !src;
    const resolvedSrc = showFallback ? resolveFallback(fallback) : src;

    const classNames = [
      styles.img,
      status === 'loading' ? styles.loading : styles.loaded,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <img
        ref={ref}
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        className={classNames}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // Lowercase attribute is passed straight through by React 18.2
        // (no camelCase warning); only emitted for priority images.
        fetchpriority={priority ? 'high' : undefined}
        style={aspectRatio ? { aspectRatio, ...style } : style}
        onLoad={handleLoad}
        onError={handleError}
        {...rest}
      />
    );
  }
);

Img.displayName = 'Img';

export default Img;
