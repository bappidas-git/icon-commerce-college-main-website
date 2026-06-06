/* ============================================
   downloadProspectus — lead-gated file trigger
   Icon Commerce College
   --------------------------------------------
   The actual prospectus file is NEVER fetched until a lead has been captured.
   This helper is called from the global lead drawer's success handler (see
   PublicLayout) once a `prospectus`-preset submission succeeds, so the file
   only ever downloads after the lead lands in the store.

   The file path is the single source of truth in `admissionData.prospectus`.
   ============================================ */

import { admissionData } from '../../../data/admissionData';

/** Public path of the prospectus PDF (swap the file, not this constant). */
export const PROSPECTUS_FILE = admissionData.prospectus.file;

/**
 * sessionStorage key set once the prospectus has downloaded in this session.
 * The Thank-You page reads it to avoid re-offering a file already delivered
 * by the lead-gated `prospectus` flow.
 */
export const PROSPECTUS_DOWNLOADED_KEY = 'icc_prospectus_downloaded';

/** A real, fetchable target is an absolute URL or a root-relative path. */
const isDownloadable = (path) => /^(https?:\/\/|\/)/.test(String(path || ''));

/**
 * Programmatically download the prospectus PDF via a transient <a download>.
 * Same-origin downloads don't navigate the page, so the post-submit redirect
 * to /thank-you is unaffected.
 *
 * @param {string} [file] Override the file path (defaults to PROSPECTUS_FILE).
 * @returns {boolean} true if a download was triggered.
 */
export function triggerProspectusDownload(file = PROSPECTUS_FILE) {
  if (typeof document === 'undefined') return false;

  // If the client hasn't supplied a real file yet (TODO placeholder string),
  // don't send the user to a 404 — fail quietly so the success flow continues.
  if (!isDownloadable(file)) {
    // eslint-disable-next-line no-console
    console.warn('[Prospectus] No downloadable prospectus file configured:', file);
    return false;
  }

  const link = document.createElement('a');
  link.href = file;
  link.download = file.split('/').pop() || 'icon-commerce-college-prospectus.pdf';
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Record the one-shot download for this session so the Thank-You page can show
  // "already downloaded" instead of re-offering the file (prompt 35). Wrapped —
  // sessionStorage can throw in private/locked-down browsers.
  try {
    window.sessionStorage.setItem(PROSPECTUS_DOWNLOADED_KEY, 'true');
  } catch (_) {
    /* ignore storage failures — the download itself still succeeded */
  }
  return true;
}

export default triggerProspectusDownload;
