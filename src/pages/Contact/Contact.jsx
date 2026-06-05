/* ============================================
   Contact — contact form, details & map (prompt 24)
   Icon Commerce College
   --------------------------------------------
   Replaces the /contact ComingSoon shell with the full contact page:

     PageHero (Contact Us · breadcrumb)
       → Two-column band:
           • left  — <UnifiedLeadForm source="contact"> (full fields + message)
           • right — contact details from collegeInfo: address (→ Maps), both
                     phones (click-to-call), email (mailto), office hours, a
                     Samarth "College Code 842" pill, WhatsApp chip + social icons
       → Full-width embedded Google Map (iframe by mapsQuery) + "Open in Maps"
       → "How to reach us" note (Rajgarh Road, Chandmari, Guwahati)

   All contact facts come from `collegeInfo` (the single source of truth) via its
   `phoneHref` / `emailHref` / `whatsappHref` helpers. SEO uses useSeo() with the
   /contact route defaults plus a LocalBusiness JSON-LD schema. Reveal-on-scroll
   is reduced-motion safe; the lead form owns its own card styling.
   ============================================ */

import React from 'react';
import { Icon } from '@iconify/react';

import useSeo from '../../components/common/SEO/useSeo';
import PageHero from '../../components/common/PageHero/PageHero';
import Section from '../../components/common/Section/Section';
import UnifiedLeadForm from '../../components/common/UnifiedLeadForm/UnifiedLeadForm';
import { Reveal } from '../../components/common/Reveal/Reveal';

import {
  collegeInfo,
  phoneHref,
  emailHref,
  whatsappHref,
} from '../../data/collegeInfo';
import { trackPhoneClick, trackWhatsAppClick } from '../../utils/gtm';
import styles from './Contact.module.css';

/** True for absolute http(s) URLs (placeholder `TODO:` values resolve false). */
const isHttpUrl = (value) => /^https?:\/\//i.test(String(value || ''));

const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  collegeInfo.mapsQuery
)}`;
// Keyless embed: the public Maps "output=embed" endpoint needs no API key.
const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  collegeInfo.mapsQuery
)}&output=embed`;

const socialLinks = [
  { id: 'facebook', icon: 'mdi:facebook', label: 'Facebook', url: collegeInfo.social.facebook },
  { id: 'youtube', icon: 'mdi:youtube', label: 'YouTube', url: collegeInfo.social.youtube },
  { id: 'instagram', icon: 'mdi:instagram', label: 'Instagram', url: collegeInfo.social.instagram },
];

const Contact = () => {
  // /contact route SEO defaults (title/description/canonical/OG). The
  // LocalBusiness (CollegeOrUniversity) JSON-LD with address, phone, email,
  // opening hours and map is already injected site-wide by <SEOHead/>
  // (utils/seo → injectDefaultSchemas), so this page reuses it rather than
  // emitting a duplicate.
  useSeo();

  return (
    <>
      {/* 1 — Hero */}
      <PageHero
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="Questions about admissions, courses or a campus visit? Send us a message or reach the college office directly — we're happy to help."
        image="hero-campus"
        breadcrumb={[{ label: 'Contact' }]}
      />

      {/* 2 — Form + details */}
      <Section
        bg="light"
        container="wide"
        eyebrow="Talk to Us"
        title="Send us a message"
        subtitle="Share your details and our admission team will get back to you within one working day."
        aria-label="Contact form and details"
      >
        <div className={styles.layout}>
          {/* Left — lead form (full fields incl. message, source: contact) */}
          <Reveal className={styles.formCol} variant="slideInLeft" amount={0.15}>
            <UnifiedLeadForm
              variant="default"
              source="contact"
              formId="contact"
              title="Request a Callback"
              subtitle="Tell us how we can help — admissions, fees, courses or a visit."
              submitButtonText="Send Message"
            />
          </Reveal>

          {/* Right — contact details */}
          <Reveal className={styles.infoCol} variant="slideInRight" amount={0.15}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Reach the college office</h3>
              <p className={styles.infoLead}>
                {collegeInfo.name} · Estd. {collegeInfo.established}
              </p>

              <ul className={styles.details}>
                <li className={styles.detail}>
                  <span className={styles.detailChip} aria-hidden="true">
                    <Icon icon="mdi:map-marker-outline" />
                  </span>
                  <div className={styles.detailBody}>
                    <span className={styles.detailLabel}>Address</span>
                    <a
                      href={mapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.detailValue}
                    >
                      {collegeInfo.address.full}
                    </a>
                  </div>
                </li>

                <li className={styles.detail}>
                  <span className={styles.detailChip} aria-hidden="true">
                    <Icon icon="mdi:phone-in-talk-outline" />
                  </span>
                  <div className={styles.detailBody}>
                    <span className={styles.detailLabel}>Phone</span>
                    <span className={styles.detailValue}>
                      {collegeInfo.phones.map((phone, index) => (
                        <React.Fragment key={phone}>
                          <a
                            href={phoneHref(phone)}
                            className={styles.inlineLink}
                            onClick={() => trackPhoneClick(phone, 'contact')}
                          >
                            {phone}
                          </a>
                          {index < collegeInfo.phones.length - 1 && (
                            <span className={styles.sep}> · </span>
                          )}
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                </li>

                <li className={styles.detail}>
                  <span className={styles.detailChip} aria-hidden="true">
                    <Icon icon="mdi:email-outline" />
                  </span>
                  <div className={styles.detailBody}>
                    <span className={styles.detailLabel}>Email</span>
                    <a href={emailHref()} className={`${styles.detailValue} ${styles.inlineLink}`}>
                      {collegeInfo.email}
                    </a>
                  </div>
                </li>

                <li className={styles.detail}>
                  <span className={styles.detailChip} aria-hidden="true">
                    <Icon icon="mdi:clock-outline" />
                  </span>
                  <div className={styles.detailBody}>
                    <span className={styles.detailLabel}>Office hours</span>
                    <span className={styles.detailValue}>
                      {collegeInfo.hours.days}
                      <br />
                      {collegeInfo.hours.time}
                    </span>
                  </div>
                </li>
              </ul>

              {/* Samarth admission portal pill */}
              <a
                href={collegeInfo.samarthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.samarthPill}
              >
                <Icon icon="mdi:shield-account-outline" aria-hidden="true" />
                <span>
                  Samarth Portal
                  <span className={styles.samarthCode}>
                    College Code {collegeInfo.samarthCode}
                  </span>
                </span>
                <Icon icon="mdi:open-in-new" className={styles.samarthExternal} aria-hidden="true" />
              </a>

              {/* WhatsApp + social */}
              <div className={styles.connect}>
                <a
                  href={whatsappHref(
                    collegeInfo.phones[0],
                    "Hello Icon Commerce College, I'd like to know more about admissions."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsapp}
                  onClick={() => trackWhatsAppClick('contact')}
                >
                  <Icon icon="mdi:whatsapp" aria-hidden="true" />
                  Chat on WhatsApp
                </a>

                <div className={styles.social} aria-label="Social media">
                  {socialLinks.map((social) => (
                    <a
                      key={social.id}
                      href={isHttpUrl(social.url) ? social.url : '#'}
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
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 3 — Map + how to reach us */}
      <Section
        bg="white"
        container="wide"
        eyebrow="Find Us"
        title="Visit our campus"
        subtitle="We're on Rajgarh Road in Chandmari, central Guwahati — easy to reach by city bus, auto or e-rickshaw."
        aria-label="Location map and directions"
      >
        <div className={styles.mapGrid}>
          <Reveal className={styles.mapWrap} variant="fadeUp" amount={0.1}>
            <iframe
              src={mapsEmbedUrl}
              title={`Map showing the location of ${collegeInfo.name}, Chandmari, Guwahati`}
              className={styles.mapFrame}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>

          <Reveal className={styles.reachCard} variant="fadeUp" amount={0.1}>
            <span className={styles.reachChip} aria-hidden="true">
              <Icon icon="mdi:directions" />
            </span>
            <h3 className={styles.reachTitle}>How to reach us</h3>
            <p className={styles.reachText}>
              The campus is located at <strong>{collegeInfo.address.parts.line1}</strong>,{' '}
              {collegeInfo.address.parts.area}, {collegeInfo.address.parts.city} –{' '}
              {collegeInfo.address.parts.pincode}. Look for the Byelane No-3 turning off
              Rajgarh Road in the Chandmari area.
            </p>
            <ul className={styles.reachList}>
              <li>
                <Icon icon="mdi:bus" aria-hidden="true" />
                <span>Well connected by city buses along Rajgarh Road.</span>
              </li>
              <li>
                <Icon icon="mdi:rickshaw" aria-hidden="true" />
                <span>Autos and e-rickshaws available from Chandmari point.</span>
              </li>
            </ul>
            <a
              href={mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapsLink}
            >
              <Icon icon="mdi:map-marker-radius" aria-hidden="true" />
              <span>Open in Google Maps</span>
              <Icon icon="mdi:open-in-new" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </Section>
    </>
  );
};

export default Contact;
