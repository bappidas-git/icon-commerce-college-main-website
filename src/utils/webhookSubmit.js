/* ============================================
   Lead Submission Utility
   Submits public landing-page leads directly to the
   shared server-side store (public/api/leads.php),
   which is the SINGLE SOURCE OF TRUTH for leads.

   Every submission — no matter which browser or
   device it comes from — is written to the server,
   so the admin panel sees every lead. There is no
   localStorage copy of leads: the server is
   authoritative and the admin reads straight from it.
   ============================================ */

// =============================================
// CONFIGURATION
// Server-side lead storage endpoint. The admin panel reads leads from here,
// so a submission made on one browser/device is visible to every admin.
// Same-origin by default; override with REACT_APP_LEADS_API_URL if the PHP
// endpoint lives elsewhere.
// =============================================
const LEADS_API_URL = process.env.REACT_APP_LEADS_API_URL || "/api/leads.php";

// Server-side tele-calling storage endpoint. Telecallers enter records from
// inside the admin panel and they sync across every device, exactly like
// leads. Same-origin by default; override with REACT_APP_TELECALLS_API_URL.
const TELECALLS_API_URL =
  process.env.REACT_APP_TELECALLS_API_URL || "/api/telecalls.php";

/**
 * Generate a UUID v4
 */
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Submit lead data to the shared server-side store.
 *
 * FIELD-KEY DECISION (prompt 08):
 *   The public form and this util use `program_interest` as the college
 *   field name (design-system §8). For backward compatibility with the
 *   existing admin panel / LMS (leadService, LeadManagement, Dashboard,
 *   LeadDetail) and any leads already stored, the same value is ALSO written
 *   to the canonical server key `service_interest`. Callers may pass either
 *   `program_interest` (preferred) or the legacy `service_interest`.
 *
 * @param {Object} leadData - The form data to submit
 * @param {string} leadData.name - Applicant's full name
 * @param {string} leadData.mobile - Mobile number (10 digits, +91 added separately)
 * @param {string} [leadData.email] - Email address (optional)
 * @param {string} [leadData.program_interest] - Selected program
 *   (B.Com / BBA / BCA / B.A. / Undecided). Preferred key.
 * @param {string} [leadData.service_interest] - Legacy alias of program_interest.
 * @param {string} leadData.state - Applicant's home state (NE India + "Other")
 * @param {string} [leadData.message] - Optional free-text question
 * @param {string} leadData.source - Form source identifier (e.g., 'hero-form', 'contact-form')
 * @returns {Promise<{success: boolean, duplicate?: boolean, message: string}>}
 */
export const submitLeadToWebhook = async (leadData) => {
  // Map the college-facing `program_interest` onto the canonical server key
  // `service_interest` (kept for admin/LMS compatibility) while persisting both
  // so the stored record is self-describing. Drop any honeypot field before it
  // ever reaches the server.
  const { honeypot, program_interest, service_interest, ...rest } = leadData;
  const programValue = program_interest || service_interest || "";

  const submittedAt = new Date().toISOString();
  const params = new URLSearchParams(window.location.search);
  const enrichedData = {
    ...rest,
    program_interest: programValue,
    // Canonical key the admin panel reads — keep in sync with program_interest.
    service_interest: programValue,
    lead_id: generateUUID(),
    status: "new",
    submitted_at: submittedAt,
    updated_at: submittedAt,
    page_url: window.location.href,
    user_agent: navigator.userAgent,
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
    utm_content: params.get("utm_content") || "",
    gclid: params.get("gclid") || "",
    notes: [],
    activity: [
      {
        action: "Lead created",
        status: "new",
        timestamp: submittedAt,
      },
    ],
  };

  if (!LEADS_API_URL) {
    console.error("[LeadsAPI] No lead endpoint configured");
    return {
      success: false,
      message:
        "Submissions aren't configured yet. Please call us at +91 93653 75782.",
    };
  }

  try {
    const response = await fetch(`${LEADS_API_URL}?action=create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead: enrichedData }),
      keepalive: true,
    });

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      if (data && data.duplicate) {
        // Server already holds a lead with this mobile/email — cross-device
        // duplicate prevention without exposing the admin key on the client.
        return {
          success: true,
          duplicate: true,
          message: "An enquiry with these details was already submitted.",
        };
      }
      return { success: true, message: "Lead submitted successfully" };
    }

    console.error("[LeadsAPI] create returned", response.status);
    return {
      success: false,
      message:
        "We couldn't submit your enquiry right now. Please try again or call us at +91 93653 75782.",
    };
  } catch (error) {
    // Network-level failure (offline, DNS error, etc.). Surface honestly so
    // the lead isn't silently lost — the user can retry or call.
    console.error("[LeadsAPI] create failed:", error);
    return {
      success: false,
      message:
        "Network error. Please check your connection and try again, or call us at +91 93653 75782.",
    };
  }
};

/**
 * Get current submission configuration.
 * Used by the admin panel's leadService to resolve the leads API URL.
 */
export const getConfig = () => ({
  LEADS_API_URL,
  TELECALLS_API_URL,
});
