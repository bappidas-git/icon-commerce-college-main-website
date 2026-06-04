/* ============================================
   Footer Component — Icon Commerce College
   Multi-column footer with quick links, contact
   info, affiliation strip and privacy modal.
   (Redesigned in prompt 06.)
   ============================================ */

import React, { useState } from "react";
import { Container, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import styles from "./Footer.module.css";

const LOGO_URL = "/images/placeholders/logo-icon-commerce.svg";

const PRIMARY_PHONE = "+919365375782";
const PRIMARY_PHONE_DISPLAY = "+91 93653 75782";
const SECONDARY_PHONE_DISPLAY = "+91 93653 83289";
const EMAIL = "iconcom.2004@gmail.com";
const WHATSAPP_LINK =
  "https://api.whatsapp.com/send?phone=919365375782&text=Hello%20Icon%20Commerce%20College%2C%20I%27d%20like%20to%20know%20more%20about%20admissions.";

// Privacy Policy Content — Icon Commerce College
const PrivacyPolicyContent = () => (
  <div className={styles.legalContent}>
    <section className={styles.legalSection}>
      <h3>Introduction</h3>
      <p>
        Icon Commerce College, Guwahati respects your privacy and is committed to
        protecting the personal information you share with us through this
        website. This Privacy Policy explains what we collect, how we use it, and
        your rights.
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
          To share information about courses, fees, facilities and the admission
          process — by phone, WhatsApp or email.
        </li>
        <li>To improve our website and the guidance we provide to applicants.</li>
      </ul>
    </section>

    <section className={styles.legalSection}>
      <h3>Sharing of Information</h3>
      <p>
        Your details are used only by the college&apos;s admission office to assist
        you. We do not sell your personal information to third parties.
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
        <strong>Icon Commerce College</strong>
        <br />
        Rajgarh Road, Near Byelane No-3, Chandmari,
        <br />
        Guwahati, Assam – 781003
        <br />
        Phone: {PRIMARY_PHONE_DISPLAY} · Email: {EMAIL}
      </p>
    </section>

    <p className={styles.lastUpdated}>Last Updated: June 2026</p>
  </div>
);

// Legal Modal Component
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
                aria-label="Close modal"
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

// Quick Links — placeholder anchors (real multi-page links land in prompt 06)
const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Facilities", href: "#facilities" },
  { label: "Contact", href: "#contact" },
];

const affiliationItems = [
  "Affiliated to Gauhati University",
  "NEP 2020 / FYUGP",
  "Samarth College Code 842",
  "Established 2004",
];

const Footer = () => {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  return (
    <>
      <footer className={styles.footer}>
        {/* Main Footer Content */}
        <div className={styles.mainFooter}>
          <Container maxWidth="xl">
            <div className={styles.footerGrid}>
              {/* Column 1: Logo & Tagline */}
              <div className={styles.footerBrand}>
                <div className={styles.logoWrapper}>
                  <img
                    src={LOGO_URL}
                    alt="Icon Commerce College"
                    style={{ height: "40px", width: "auto" }}
                  />
                </div>
                <p className={styles.tagline}>
                  Icon Commerce College, Guwahati — empowering Commerce, Arts &amp;
                  Computer Application graduates since 2004. Affiliated to Gauhati
                  University under NEP 2020 (FYUGP).
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div className={styles.footerColumn}>
                <h4 className={styles.columnTitle}>Quick Links</h4>
                <ul className={styles.footerLinks}>
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className={styles.footerLink}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Contact */}
              <div className={styles.footerColumn}>
                <h4 className={styles.columnTitle}>Contact</h4>
                <ul className={styles.contactList}>
                  <li className={styles.contactItem}>
                    <div className={styles.contactLabelRow}>
                      <Icon
                        icon="mdi:phone-in-talk-outline"
                        className={styles.contactIcon}
                      />
                      <span className={styles.contactLabel}>Call or WhatsApp</span>
                    </div>
                    <span className={styles.contactValue}>
                      {PRIMARY_PHONE_DISPLAY} · {SECONDARY_PHONE_DISPLAY}
                    </span>
                    <div className={styles.contactChipRow}>
                      <a
                        href={`tel:${PRIMARY_PHONE}`}
                        className={`${styles.contactChip} ${styles.contactChipCall}`}
                        aria-label={`Call ${PRIMARY_PHONE_DISPLAY}`}
                      >
                        <Icon icon="mdi:phone" />
                        <span>Call</span>
                      </a>
                      <a
                        href={WHATSAPP_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.contactChip} ${styles.contactChipWhatsapp}`}
                        aria-label={`Chat on WhatsApp with ${PRIMARY_PHONE_DISPLAY}`}
                      >
                        <Icon icon="mdi:whatsapp" />
                        <span>Chat</span>
                      </a>
                    </div>
                  </li>

                  <li className={styles.contactItem}>
                    <div className={styles.contactLabelRow}>
                      <Icon icon="mdi:map-marker" className={styles.contactIcon} />
                      <span className={styles.contactLabel}>Campus</span>
                    </div>
                    <span className={styles.contactValue}>
                      Rajgarh Road, Near Byelane No-3, Chandmari,
                      <br />
                      Guwahati, Assam – 781003
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Container>
        </div>

        {/* Affiliation Strip */}
        <div className={styles.accreditationStrip}>
          <Container maxWidth="xl">
            <ul className={styles.accreditationList}>
              {affiliationItems.map((item) => (
                <li key={item} className={styles.accreditationItem}>
                  <Icon
                    icon="mdi:shield-check-outline"
                    className={styles.accreditationIcon}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Container>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <Container maxWidth="xl">
            <div className={styles.bottomContent}>
              <p className={styles.copyright}>
                &copy; {new Date().getFullYear()} Icon Commerce College. All rights
                reserved.
              </p>
              <div className={styles.legalLinks}>
                <button
                  className={styles.legalLink}
                  onClick={() => setPrivacyModalOpen(true)}
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </Container>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <LegalModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </LegalModal>
    </>
  );
};

export default Footer;
