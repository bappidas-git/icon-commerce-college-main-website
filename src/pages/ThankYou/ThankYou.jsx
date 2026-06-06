/* ============================================
   ThankYou Page (prompt 35)
   Icon Commerce College
   --------------------------------------------
   Post lead-submission confirmation. Celebrates a real submission (subtle,
   reduced-motion-safe confetti + personalised "what happens next"), but ALSO
   renders gracefully when reached directly (refresh, shared link) — it never
   bounces the visitor away. CTAs: Explore Courses, Download Prospectus (unless
   already downloaded in this session), Back to Home, plus the Samarth pill.
   `noindex`.
   ============================================ */

import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Grid } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@iconify/react";
import confetti from "canvas-confetti";
import styles from "./ThankYou.module.css";
import { updatePageSEO } from "../../utils/seo";
import { seoConfig } from "../../config/seo";
import { collegeInfo, phoneHref, whatsappHref } from "../../data/collegeInfo";
import {
  triggerProspectusDownload,
  PROSPECTUS_DOWNLOADED_KEY,
} from "../../components/common/ProspectusDownload/downloadProspectus";

// Pre-filled WhatsApp message for the post-enquiry contact paths.
const WHATSAPP_MESSAGE =
  "Hi Icon Commerce College, I just submitted the enquiry form and would like to know more about admissions.";

// Trust badges
const trustBadges = [
  {
    icon: "mdi:school",
    label: "Affiliated to Gauhati University",
    color: "#1A2A52",
  },
  {
    icon: "mdi:certificate",
    label: "NEP 2020 / FYUGP",
    color: "#1E8E5A",
  },
  {
    icon: "mdi:headset",
    label: "100% Free Admission Guidance",
    color: "#E0301E",
  },
];

// What-happens-next checklist (shown after a real submission).
const nextSteps = [
  "Keep your phone reachable — our admission team will call you shortly on the number you shared.",
  "Have your HS (Class 12) marksheet and registration/migration certificate handy.",
  "Feel free to ask about programs, fees, facilities and the Samarth portal admission process.",
];

const ThankYou = () => {
  const reduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [userName, setUserName] = useState("");
  const [prospectusDownloaded, setProspectusDownloaded] = useState(false);

  // Detect the arrival context (a real submission vs. a direct visit), set the
  // noindex SEO and push analytics. The page renders either way — no redirect.
  useEffect(() => {
    let didSubmit = false;
    let name = "";
    let prospectus = false;
    try {
      didSubmit = sessionStorage.getItem("lead_submitted") === "true";
      name = sessionStorage.getItem("lead_name") || "";
      prospectus = sessionStorage.getItem(PROSPECTUS_DOWNLOADED_KEY) === "true";
    } catch (_) {
      /* sessionStorage unavailable — fall back to the standalone view */
    }

    setSubmitted(didSubmit);
    setUserName(name);
    setProspectusDownloaded(prospectus);

    // noindex meta (mirrors the /thank-you route SEO; explicit here for the
    // standalone render too).
    updatePageSEO({
      title: seoConfig.pages.thankYou.title,
      description: seoConfig.pages.thankYou.description,
      url: seoConfig.siteUrl + "/thank-you",
      robots: "noindex, nofollow",
    });

    // GTM: always a virtual pageview; the conversion event only fires for a real
    // submission (a direct visit isn't a fresh conversion).
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "virtualPageview",
      pagePath: "/thank-you",
      pageTitle: "Thank You",
    });
    if (didSubmit) {
      window.dataLayer.push({
        event: "lead_form_submission_complete",
        pagePath: "/thank-you",
      });
    }

    // Clear the one-shot flags after a while, so a later refresh shows the calm
    // standalone view rather than re-celebrating a stale submission.
    if (didSubmit) {
      const timeout = setTimeout(() => {
        try {
          sessionStorage.removeItem("lead_submitted");
          sessionStorage.removeItem("lead_name");
        } catch (_) {
          /* ignore */
        }
      }, 300000); // 5 minutes
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, []);

  // Fire confetti effect
  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 10000,
    };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Left side confetti
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#1A2A52", "#C8A04D", "#E0301E", "#2C3E6B"],
      });

      // Right side confetti
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#1A2A52", "#C8A04D", "#E0301E", "#2C3E6B"],
      });
    }, 250);

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1A2A52", "#C8A04D", "#E0301E", "#2C3E6B", "#1E8E5A"],
    });
  }, []);

  // Confetti celebrates a real submission only, and only when the user hasn't
  // asked for reduced motion (canvas-confetti runs outside Framer Motion, so it
  // needs its own guard).
  useEffect(() => {
    if (submitted && !reduceMotion) {
      const timer = setTimeout(fireConfetti, 300);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [submitted, reduceMotion, fireConfetti]);

  // Download the prospectus straight from here: a captured lead has already
  // satisfied the download gate. If no real file is wired yet (placeholder),
  // still flip to the "downloaded" state so the button isn't a dead end.
  const handleDownloadProspectus = useCallback(() => {
    triggerProspectusDownload();
    setProspectusDownloaded(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const scaleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const firstName = userName ? userName.split(" ")[0] : "";
  const greeting = submitted
    ? firstName
      ? `Hi ${firstName}, our admission team will call you shortly to guide you through the admission process at Icon Commerce College.`
      : "Our admission team will call you shortly to guide you through the admission process at Icon Commerce College."
    : "Looking to begin your admission journey? Explore our programs or reach out — our admission team is here to help you at every step.";

  return (
    <main id="main-content" className={styles.thankYouPage}>
      {/* Background Elements */}
      <div className={styles.bgPattern} />
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={styles.content}
        >
          {/* Success Icon — adapts to the arrival context */}
          <motion.div variants={scaleVariants} className={styles.successIcon}>
            <div
              className={`${styles.iconWrapper} ${
                submitted ? "" : styles.iconWrapperAlt
              }`}
            >
              <Icon icon={submitted ? "mdi:check-circle" : "mdi:school"} />
            </div>
            <div className={styles.iconRing} />
            <div className={styles.iconRing2} />
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants} className={styles.thankYouMessage}>
            <Typography variant="h2" className={styles.title}>
              {submitted
                ? "Thank You! Your Admission Enquiry is Received."
                : "Welcome to Icon Commerce College"}
            </Typography>
            <Typography
              className={styles.subtitle}
              sx={{ color: "#FFFFFFB3 !important" }}
            >
              {greeting}
            </Typography>
          </motion.div>

          {/* What happens next + checklist — only after a real submission */}
          {submitted && (
            <>
              <motion.div
                variants={itemVariants}
                className={styles.responseNotice}
              >
                <div className={styles.noticeIcon}>
                  <Icon icon="mdi:clock-check-outline" />
                </div>
                <div className={styles.noticeContent}>
                  <Typography className={styles.noticeTitle}>
                    What happens next?
                  </Typography>
                  <Typography
                    className={styles.noticeDesc}
                    sx={{ color: "#FFFFFFA6 !important" }}
                  >
                    A quick checklist so we can make your admission conversation
                    smooth and useful:
                  </Typography>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className={styles.nextStepsSection}
              >
                <ol className={styles.nextStepsList}>
                  {nextSteps.map((step, index) => (
                    <motion.li
                      key={index}
                      className={styles.nextStepItem}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <span className={styles.stepNumber}>{index + 1}</span>
                      <span className={styles.stepText}>{step}</span>
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            </>
          )}

          {/* Trust Badges */}
          <motion.div
            variants={itemVariants}
            className={styles.highlightsSection}
          >
            <div className={styles.highlightsGrid}>
              {trustBadges.map((item, index) => (
                <motion.div
                  key={item.label}
                  className={styles.highlightCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <div
                    className={styles.highlightIcon}
                    style={{
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                    }}
                  >
                    <Icon icon={item.icon} />
                  </div>
                  <span className={styles.highlightLabel}>{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Samarth pill — official admission portal + college code */}
          <motion.div variants={itemVariants} className={styles.samarthRow}>
            <a
              className={styles.samarthPill}
              href={collegeInfo.samarthUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="mdi:shield-account-outline" aria-hidden="true" />
              <span>
                Apply via Samarth Portal · College Code{" "}
                <strong>{collegeInfo.samarthCode}</strong>
              </span>
              <Icon
                icon="mdi:open-in-new"
                className={styles.samarthExternal}
                aria-hidden="true"
              />
            </a>
          </motion.div>

          {/* Contact Information Card */}
          <motion.div variants={itemVariants} className={styles.contactCard}>
            <div className={styles.contactHeader}>
              <div className={styles.companyBadge}>
                <Icon icon="mdi:phone-in-talk" />
                <span>Admission Desk</span>
              </div>
              <Typography variant="h4" className={styles.companyName}>
                Prefer to talk to us directly?
              </Typography>
            </div>

            <Grid container spacing={3} className={styles.contactGrid}>
              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconWrapper}>
                    <Icon icon="mdi:phone" />
                  </div>
                  <div className={styles.contactDetails}>
                    <span
                      className={styles.contactLabel}
                      style={{ color: "#FFFFFF80" }}
                    >
                      Call Us
                    </span>
                    <a
                      href={phoneHref(collegeInfo.phones[0])}
                      className={styles.contactValue}
                    >
                      {collegeInfo.phones[0]}
                    </a>
                  </div>
                </div>
              </Grid>

              {/* WhatsApp */}
              <Grid item xs={12} sm={6}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconWrapper}>
                    <Icon icon="mdi:whatsapp" />
                  </div>
                  <div className={styles.contactDetails}>
                    <span
                      className={styles.contactLabel}
                      style={{ color: "#FFFFFF80" }}
                    >
                      WhatsApp
                    </span>
                    <a
                      href={whatsappHref(collegeInfo.phones[0], WHATSAPP_MESSAGE)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactValue}
                    >
                      {collegeInfo.phones[0]}
                    </a>
                  </div>
                </div>
              </Grid>

              {/* Office Hours */}
              <Grid item xs={12} sm={6}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIconWrapper}>
                    <Icon icon="mdi:clock-outline" />
                  </div>
                  <div className={styles.contactDetails}>
                    <span
                      className={styles.contactLabel}
                      style={{ color: "#FFFFFF80" }}
                    >
                      Office Hours
                    </span>
                    <span className={styles.contactValue}>
                      {collegeInfo.hours.days}: {collegeInfo.hours.time}
                    </span>
                  </div>
                </div>
              </Grid>
            </Grid>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className={styles.ctaSection}>
            <Link to="/courses" className={styles.primaryBtn}>
              <Icon icon="mdi:school-outline" aria-hidden="true" />
              <span>Explore Courses</span>
            </Link>

            {prospectusDownloaded ? (
              <span className={styles.downloadedChip}>
                <Icon icon="mdi:check-circle-outline" aria-hidden="true" />
                <span>Prospectus downloaded</span>
              </span>
            ) : submitted ? (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleDownloadProspectus}
              >
                <Icon icon="mdi:file-download-outline" aria-hidden="true" />
                <span>Download Prospectus</span>
              </button>
            ) : (
              // Standalone visit: keep the prospectus lead-gated by routing to
              // /admissions (where the gated download CTA lives) instead of
              // delivering the file to an unidentified visitor.
              <Link to="/admissions" className={styles.secondaryBtn}>
                <Icon icon="mdi:file-download-outline" aria-hidden="true" />
                <span>Download Prospectus</span>
              </Link>
            )}

            <Link to="/" className={styles.ghostBtn}>
              <Icon icon="mdi:home-outline" aria-hidden="true" />
              <span>Back to Home</span>
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </main>
  );
};

export default ThankYou;
