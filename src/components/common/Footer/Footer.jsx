/* ============================================
   Footer — Icon Commerce College
   --------------------------------------------
   Polished, informative multi-column footer (navy gradient):
   - Top band: About + social, Quick Links, Programs, Reach Us
     (address / phones / email / office hours + map thumbnail) and
     an Admissions block (Samarth pill, Download Prospectus, Apply Now).
   - Accreditation / affiliation strip (gold-bordered badge chips).
   - Inline enquiry mini-strip that feeds the lead store (source `footer`).
   - Bottom bar: copyright, Privacy Policy / Terms (Modal) and a
     discreet Admin link.
   Built per prompt 06 + design-system §1/§2/§6.
   ============================================ */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, IconButton } from "@mui/material";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";

import Img from "../Img";

import {
  collegeInfo,
  phoneHref,
  emailHref,
  whatsappHref,
} from "../../../data/collegeInfo";
import { footerNav } from "../../../data/navigation";
import { useModal } from "../../../context/ModalContext";
import { submitLeadToWebhook } from "../../../utils/webhookSubmit";
import { validateIndianMobile, validateEmail } from "../../../utils/validators";
import {
  trackCTAClick,
  trackPhoneClick,
  trackWhatsAppClick,
} from "../../../utils/gtm";
import styles from "./Footer.module.css";

const LOGO_URL = "/images/placeholders/logo-icon-commerce.svg";
const MAP_PLACEHOLDER = "/images/placeholders/map-location.svg";

/** Returns true for absolute http(s) URLs (placeholder TODOs resolve to false). */
const isHttpUrl = (value) => /^https?:\/\//i.test(String(value || ""));

const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  collegeInfo.mapsQuery,
)}`;

const socialLinks = [
  {
    id: "facebook",
    icon: "mdi:facebook",
    label: "Facebook",
    url: collegeInfo.social.facebook,
  },
  {
    id: "youtube",
    icon: "mdi:youtube",
    label: "YouTube",
    url: collegeInfo.social.youtube,
  },
  {
    id: "instagram",
    icon: "mdi:instagram",
    label: "Instagram",
    url: collegeInfo.social.instagram,
  },
];

// Quick Links — primary public routes (design-system §5).
const quickLinks = [
  { label: "About", path: "/about" },
  { label: "Courses", path: "/courses" },
  { label: "Departments", path: "/departments" },
  { label: "Admissions", path: "/admissions" },
  { label: "Gallery", path: "/gallery" },
  { label: "Contact", path: "/contact" },
];

// Programs — link straight to each course detail page.
const programLinks =
  footerNav.find((group) => group.title === "Programs")?.links ?? [];

const affiliationItems = [
  `Affiliated to ${collegeInfo.affiliation}`,
  collegeInfo.affiliationNote,
  `Samarth Code ${collegeInfo.samarthCode}`,
  `Estd. ${collegeInfo.established}`,
];

/* ------------------------------------------------------------------
   Legal copy (Privacy Policy + Terms) — opened in the Modal below.
   ------------------------------------------------------------------ */
const PrivacyPolicyContent = () => (
  <div className={styles.legalContent}>
    <section className={styles.legalSection}>
      <h3>Introduction</h3>
      <p>
        Icon Commerce College, Guwahati respects your privacy and is committed
        to protecting the personal information you share with us through this
        website. This Privacy Policy explains what we collect, how we use it,
        and your rights.
      </p>
    </section>

    <section className={styles.legalSection}>
      <h3>Information We Collect</h3>
      <ul>
        <li>
          <strong>Contact details:</strong> your name, mobile number and email,
          collected through enquiry and contact forms.
        </li>
        <li>
          <strong>Academic interest:</strong> the program you are interested in
          and your home state, plus any question you choose to add.
        </li>
        <li>
          <strong>Usage data:</strong> anonymised information about how you
          interact with this website, used to improve the experience.
        </li>
      </ul>
    </section>

    <section className={styles.legalSection}>
      <h3>How We Use Your Information</h3>
      <ul>
        <li>To respond to your admission enquiries and questions.</li>
        <li>
          To share information about courses, fees, facilities and the
          admission process — by phone, WhatsApp or email.
        </li>
        <li>To improve our website and the guidance we provide to applicants.</li>
      </ul>
    </section>

    <section className={styles.legalSection}>
      <h3>Sharing of Information</h3>
      <p>
        Your details are used only by the college&apos;s admission office to
        assist you. We do not sell your personal information to third parties.
      </p>
    </section>

    <section className={styles.legalSection}>
      <h3>Your Rights</h3>
      <ul>
        <li>Request a copy of the personal data we hold about you.</li>
        <li>Ask us to correct inaccurate information.</li>
        <li>Ask us to delete your enquiry data, subject to legal obligations.</li>
      </ul>
    </section>

    <section className={styles.legalSection}>
      <h3>Contact</h3>
      <p>For any privacy questions or data requests, contact the college office:</p>
      <p>
        <strong>{collegeInfo.name}</strong>
        <br />
        {collegeInfo.address.full}
        <br />
        Phone: {collegeInfo.phones[0]} · Email: {collegeInfo.email}
      </p>
    </section>

    <p className={styles.lastUpdated}>Last Updated: June 2026</p>
  </div>
);

const TermsContent = () => (
  <div className={styles.legalContent}>
    <section className={styles.legalSection}>
      <h3>Acceptance of Terms</h3>
      <p>
        By accessing and using the Icon Commerce College website, you agree to
        these Terms of Use. If you do not agree, please do not use this website.
      </p>
    </section>

    <section className={styles.legalSection}>
      <h3>Use of the Website</h3>
      <ul>
        <li>
          The content on this site is provided for general information about the
          college, its programs, facilities and admission process.
        </li>
        <li>
          You agree to provide accurate details when submitting enquiry or
          admission forms.
        </li>
        <li>
          You may not misuse the website, attempt to disrupt its operation or
          access it through unauthorised means.
        </li>
      </ul>
    </section>

    <section className={styles.legalSection}>
      <h3>Admissions &amp; Fees</h3>
      <p>
        All admissions are subject to eligibility and the rules of Gauhati
        University and the Samarth admission portal (College Code{" "}
        {collegeInfo.samarthCode}). Fees shown on this website are indicative;
        university registration, enrolment and examination fees are extra and
        subject to change. Fees paid are non-refundable.
      </p>
    </section>

    <section className={styles.legalSection}>
      <h3>Intellectual Property</h3>
      <p>
        The college name, logo and original content on this website are the
        property of Icon Commerce College and may not be reproduced without
        permission.
      </p>
    </section>

    <section className={styles.legalSection}>
      <h3>Limitation of Liability</h3>
      <p>
        While we strive to keep information accurate and up to date, the college
        is not liable for any errors, omissions or decisions made based on the
        content of this website. Always confirm critical details with the
        admission office.
      </p>
    </section>

    <p className={styles.lastUpdated}>Last Updated: June 2026</p>
  </div>
);

/* ------------------------------------------------------------------
   Legal Modal — lightweight portal dialog (Framer Motion).
   ------------------------------------------------------------------ */
const LegalModal = ({ isOpen, onClose, title, children }) => {
  if (typeof window === "undefined") return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } },
  };

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={styles.modalBackdrop}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className={styles.legalModal}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <IconButton
                className={styles.modalCloseBtn}
                onClick={onClose}
                aria-label="Close dialog"
              >
                <Icon icon="mdi:close" />
              </IconButton>
            </div>
            <div className={styles.modalBody}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

/* ------------------------------------------------------------------
   Inline enquiry mini-strip — feeds the lead store with source `footer`.
   ------------------------------------------------------------------ */
const EnquiryStrip = () => {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "submitting") return;

    const digits = mobile.replace(/\D/g, "").slice(-10);
    if (!validateIndianMobile(digits)) {
      setStatus("error");
      setFeedback("Enter a valid 10-digit mobile number.");
      return;
    }
    if (email && !validateEmail(email)) {
      setStatus("error");
      setFeedback("Enter a valid email address, or leave it blank.");
      return;
    }

    setStatus("submitting");
    setFeedback("");

    const result = await submitLeadToWebhook({
      name: email ? email.split("@")[0] : "Website enquiry",
      mobile: digits,
      email: email.trim(),
      program_interest: "Undecided",
      state: "Assam",
      message: "Quick enquiry submitted from the website footer.",
      source: "footer",
    });

    if (result.success) {
      setStatus("success");
      setFeedback(
        result.duplicate
          ? "We already have your details — our team will be in touch."
          : "Thank you! Our admission team will reach out shortly.",
      );
      setMobile("");
      setEmail("");
    } else {
      setStatus("error");
      setFeedback(result.message);
    }
  };

  return (
    <div className={styles.enquiryStrip}>
      <Container maxWidth="xl">
        <div className={styles.enquiryInner}>
          <div className={styles.enquiryCopy}>
            <Icon
              icon="mdi:email-fast-outline"
              className={styles.enquiryIcon}
              aria-hidden="true"
            />
            <div>
              <p className={styles.enquiryTitle}>Have a quick question?</p>
              <p className={styles.enquiryText}>
                Leave your mobile and we&apos;ll call you back about admissions.
              </p>
            </div>
          </div>

          <form
            className={styles.enquiryForm}
            onSubmit={handleSubmit}
            noValidate
          >
            <div className={styles.enquiryFields}>
              <input
                type="tel"
                inputMode="numeric"
                className={styles.enquiryInput}
                placeholder="Mobile number*"
                aria-label="Mobile number"
                value={mobile}
                maxLength={14}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
              <input
                type="email"
                className={styles.enquiryInput}
                placeholder="Email (optional)"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={styles.enquiryButton}
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sending…" : "Enquire Now"}
              {status !== "submitting" && (
                <Icon icon="mdi:arrow-right" aria-hidden="true" />
              )}
            </button>
          </form>
        </div>

        {feedback && (
          <p
            className={`${styles.enquiryFeedback} ${
              status === "success"
                ? styles.enquiryFeedbackOk
                : styles.enquiryFeedbackErr
            }`}
            role="status"
          >
            {feedback}
          </p>
        )}
      </Container>
    </div>
  );
};

const Footer = () => {
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | null
  const { openLeadDrawer } = useModal();
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      };

  const handleDownloadProspectus = () => {
    trackCTAClick("footer_download_prospectus", "footer", "Download Prospectus");
    openLeadDrawer("prospectus");
  };

  const handleApply = () => {
    trackCTAClick("footer_apply_now", "footer", "Apply Now");
    openLeadDrawer("apply-now");
  };

  return (
    <>
      <footer className={styles.footer}>
        {/* ── Inline enquiry mini-strip (feeds lead store, source: footer) ── */}
        <EnquiryStrip />

        {/* ── Main footer band ─────────────────────────────────────── */}
        <div className={styles.mainFooter}>
          <Container maxWidth="xl">
            <motion.div className={styles.footerGrid} {...reveal}>
              {/* About */}
              <div className={styles.footerBrand}>
                <Link
                  to="/"
                  className={styles.logoWrapper}
                  aria-label={`${collegeInfo.name} — Home`}
                >
                  <Img
                    src={LOGO_URL}
                    alt={`${collegeInfo.name} logo`}
                    className={styles.logo}
                    width="360"
                    height="96"
                    fallback="logo-icon-commerce"
                  />
                  <span className={styles.brandText}>
                    <span className={styles.brandName}>{collegeInfo.name}</span>
                    <span className={styles.brandSub}>
                      {collegeInfo.assameseName}
                    </span>
                  </span>
                </Link>
                <p className={styles.tagline}>
                  {collegeInfo.taglineSecondary} Affiliated to{" "}
                  {collegeInfo.affiliation} under {collegeInfo.affiliationNote}.
                </p>

                <div className={styles.socialIcons}>
                  {socialLinks.map((social) => (
                    <a
                      key={social.id}
                      href={isHttpUrl(social.url) ? social.url : "#"}
                      className={styles.socialIcon}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${collegeInfo.name} on ${social.label}`}
                    >
                      <Icon icon={social.icon} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <nav className={styles.footerColumn} aria-label="Quick links">
                <h4 className={styles.columnTitle}>Quick Links</h4>
                <ul className={styles.footerLinks}>
                  {quickLinks.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className={styles.footerLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Programs */}
              <nav className={styles.footerColumn} aria-label="Programs">
                <h4 className={styles.columnTitle}>Programs</h4>
                <ul className={styles.footerLinks}>
                  {programLinks.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className={styles.footerLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Reach Us */}
              <div className={styles.footerColumn}>
                <h4 className={styles.columnTitle}>Reach Us</h4>
                <ul className={styles.contactList}>
                  <li className={styles.contactItem}>
                    <Icon
                      icon="mdi:map-marker"
                      className={styles.contactIcon}
                      aria-hidden="true"
                    />
                    <a
                      href={mapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactValue}
                    >
                      {collegeInfo.address.parts.line1},{" "}
                      {collegeInfo.address.parts.area},{" "}
                      {collegeInfo.address.parts.city},{" "}
                      {collegeInfo.address.parts.state} –{" "}
                      {collegeInfo.address.parts.pincode}
                    </a>
                  </li>

                  <li className={styles.contactItem}>
                    <Icon
                      icon="mdi:phone-in-talk-outline"
                      className={styles.contactIcon}
                      aria-hidden="true"
                    />
                    <span className={styles.contactValue}>
                      {collegeInfo.phones.map((phone, index) => (
                        <React.Fragment key={phone}>
                          <a
                            href={phoneHref(phone)}
                            className={styles.contactInlineLink}
                            onClick={() => trackPhoneClick(phone, "footer")}
                          >
                            {phone}
                          </a>
                          {index < collegeInfo.phones.length - 1 && (
                            <span className={styles.dot}> · </span>
                          )}
                        </React.Fragment>
                      ))}
                    </span>
                  </li>

                  <li className={styles.contactItem}>
                    <Icon
                      icon="mdi:email-outline"
                      className={styles.contactIcon}
                      aria-hidden="true"
                    />
                    <a
                      href={emailHref()}
                      className={`${styles.contactValue} ${styles.contactInlineLink}`}
                    >
                      {collegeInfo.email}
                    </a>
                  </li>

                  <li className={styles.contactItem}>
                    <Icon
                      icon="mdi:clock-outline"
                      className={styles.contactIcon}
                      aria-hidden="true"
                    />
                    <span className={styles.contactValue}>
                      {collegeInfo.hours.days}
                      <br />
                      {collegeInfo.hours.time}
                    </span>
                  </li>
                </ul>

                <a
                  href={whatsappHref(
                    collegeInfo.phones[0],
                    "Hello Icon Commerce College, I'd like to know more about admissions.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappChip}
                  onClick={() => trackWhatsAppClick("footer")}
                >
                  <Icon icon="mdi:whatsapp" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Admissions */}
              <div className={styles.footerColumn}>
                <h4 className={styles.columnTitle}>Admissions</h4>

                <a
                  href={collegeInfo.samarthUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.samarthPill}
                  onClick={() =>
                    trackCTAClick(
                      "footer_samarth_portal",
                      "footer",
                      "Samarth Admission Portal",
                    )
                  }
                >
                  <Icon icon="mdi:school-outline" aria-hidden="true" />
                  <span>
                    Samarth Portal
                    <span className={styles.samarthCode}>
                      College Code {collegeInfo.samarthCode}
                    </span>
                  </span>
                  <Icon icon="mdi:open-in-new" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  className={styles.ghostButton}
                  onClick={handleDownloadProspectus}
                >
                  <Icon icon="mdi:file-download-outline" aria-hidden="true" />
                  Download Prospectus
                </button>

                <button
                  type="button"
                  className={styles.ctaButton}
                  onClick={handleApply}
                >
                  <Icon icon="mdi:send-outline" aria-hidden="true" />
                  Apply Now
                </button>

                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapThumb}
                  aria-label="View Icon Commerce College on Google Maps"
                >
                  <Img
                    src={MAP_PLACEHOLDER}
                    alt="Map showing the location of Icon Commerce College, Chandmari, Guwahati"
                    fallback="map-location"
                  />
                  <span className={styles.mapThumbOverlay}>
                    <Icon icon="mdi:map-marker-radius" aria-hidden="true" />
                    Open in Maps
                  </span>
                </a>
              </div>
            </motion.div>
          </Container>
        </div>

        {/* ── Affiliation / accreditation strip ────────────────────── */}
        <div className={styles.accreditationStrip}>
          <Container maxWidth="xl">
            <ul className={styles.accreditationList}>
              {affiliationItems.map((item) => (
                <li key={item} className={styles.accreditationItem}>
                  <Icon
                    icon="mdi:shield-check-outline"
                    className={styles.accreditationIcon}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Container>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────── */}
        <div className={styles.bottomBar}>
          <Container maxWidth="xl">
            <div className={styles.bottomContent}>
              <p className={styles.copyright}>
                &copy; {new Date().getFullYear()} {collegeInfo.name}. All rights
                reserved.
              </p>
              <div className={styles.legalLinks}>
                <button
                  type="button"
                  className={styles.legalLink}
                  onClick={() => setLegalModal("privacy")}
                >
                  Privacy Policy
                </button>
                <span className={styles.linkDivider} aria-hidden="true">
                  ·
                </span>
                <button
                  type="button"
                  className={styles.legalLink}
                  onClick={() => setLegalModal("terms")}
                >
                  Terms of Use
                </button>
                <span className={styles.linkDivider} aria-hidden="true">
                  ·
                </span>
                <Link to="/admin/login" className={styles.adminLink}>
                  Admin
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </footer>

      {/* Privacy / Terms modal */}
      <LegalModal
        isOpen={legalModal === "privacy"}
        onClose={() => setLegalModal(null)}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </LegalModal>
      <LegalModal
        isOpen={legalModal === "terms"}
        onClose={() => setLegalModal(null)}
        title="Terms of Use"
      >
        <TermsContent />
      </LegalModal>
    </>
  );
};

export default Footer;
