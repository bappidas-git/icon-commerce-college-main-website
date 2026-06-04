/* ============================================
   SEO Configuration — Icon Commerce College
   Central configuration for SEO settings,
   schemas, and page metadata. The full per-route
   SEO system is expanded in prompt 10.
   ============================================ */

export const seoConfig = {
  // =========================================
  // Site-level Settings
  // =========================================
  siteName: "Icon Commerce College",
  // TODO: set the production domain when available.
  siteUrl: "https://www.iconcommercecollege.in",
  defaultTitle:
    "Icon Commerce College, Guwahati | Commerce, Arts & Computer Applications",
  titleTemplate: "%s | Icon Commerce College",
  defaultDescription:
    "Icon Commerce College, Guwahati — empowering Commerce, Arts & Computer Application graduates since 2004. Affiliated to Gauhati University under NEP 2020 (FYUGP). B.Com, BBA, BCA and B.A. programs.",
  defaultImage: "/images/placeholders/og-default.jpg",
  locale: "en_IN",
  language: "en",

  // =========================================
  // Organization Details (Educational)
  // =========================================
  organization: {
    name: "Icon Commerce College",
    alternateName: "ICON Commerce College",
    url: "https://www.iconcommercecollege.in",
    logo: "/images/placeholders/logo-icon-commerce.svg",
    phone: "+91 93653 75782",
    email: "iconcom.2004@gmail.com",
    description:
      "Icon Commerce College, Guwahati is a Commerce, Arts & Computer Application college established in 2004 under the Icon Academy Trust and affiliated to Gauhati University (NEP 2020 / FYUGP).",
    address: {
      streetAddress: "Rajgarh Road, Near Byelane No-3, Chandmari",
      addressLocality: "Guwahati",
      addressRegion: "Assam",
      postalCode: "781003",
      addressCountry: "IN",
    },
    sameAs: [],
    foundingDate: "2004",
    // UG programs offered (used for hasOfferingCatalog)
    courses: [
      {
        name: "Bachelor of Commerce (B.Com.)",
        description:
          "Four-year FYUGP Bachelor of Commerce program affiliated to Gauhati University.",
      },
      {
        name: "Bachelor of Business Administration (BBA)",
        description:
          "Four-year FYUGP Bachelor of Business Administration program affiliated to Gauhati University.",
      },
      {
        name: "Bachelor of Computer Applications (BCA)",
        description:
          "Four-year FYUGP Bachelor of Computer Applications program affiliated to Gauhati University.",
      },
      {
        name: "Bachelor of Arts (B.A.)",
        description:
          "Four-year FYUGP Bachelor of Arts program affiliated to Gauhati University.",
      },
    ],
  },

  // =========================================
  // Page-specific SEO Settings
  // =========================================
  pages: {
    home: {
      title:
        "Icon Commerce College, Guwahati | Commerce, Arts & Computer Applications",
      description:
        "Admissions open at Icon Commerce College, Guwahati. B.Com, BBA, BCA and B.A. programs affiliated to Gauhati University (NEP 2020 / FYUGP). Established 2004.",
      keywords:
        "icon commerce college, commerce college guwahati, bcom guwahati, bba guwahati, bca guwahati, ba guwahati, gauhati university college, fyugp commerce, college code 842",
    },
    thankYou: {
      title: "Thank You | Icon Commerce College",
      description:
        "Thanks for your interest in Icon Commerce College. Our admission team will call you shortly to guide you through the process.",
      robots: "noindex, nofollow",
    },
    admin: {
      title: "Admin Panel | Icon Commerce College",
      robots: "noindex, nofollow",
    },
  },

  // =========================================
  // FAQ Schema Data (Admissions)
  // =========================================
  faqs: [
    {
      question: "Which programs does Icon Commerce College offer?",
      answer:
        "Icon Commerce College offers four UG programs under NEP 2020 (FYUGP), affiliated to Gauhati University: Bachelor of Commerce (B.Com.), Bachelor of Business Administration (BBA), Bachelor of Computer Applications (BCA) and Bachelor of Arts (B.A.).",
    },
    {
      question: "Who is eligible to apply?",
      answer:
        "Applicants who have passed HS (10+2) under AHSEC or an equivalent board are eligible. B.Com, BBA and B.A. accept any stream; BCA prefers Mathematics/Computer Science (Diploma holders in CSE/IT are also eligible). Honours admission requires the minimum marks specified by Gauhati University.",
    },
    {
      question: "How do I apply for admission?",
      answer:
        "Register on the Samarth portal (assamadmission.samarth.ac.in) using Icon Commerce College — College Code 842 — and select your preferred program. After verification you can complete admission at the college or online, and approved candidates receive a confirmation SMS.",
    },
    {
      question: "Where is the college located?",
      answer:
        "Icon Commerce College is at Rajgarh Road, Near Byelane No-3, Chandmari, Guwahati, Assam – 781003.",
    },
  ],

  // =========================================
  // CollegeOrUniversity Schema Settings
  // =========================================
  localBusiness: {
    type: "CollegeOrUniversity",
    priceRange: "$",
    openingHours: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "17:00",
    },
    // TODO: verify exact coordinates for the Chandmari campus.
    geo: {
      latitude: "",
      longitude: "",
    },
    hasMap:
      "https://www.google.com/maps/search/?api=1&query=Icon+Commerce+College+Rajgarh+Road+Guwahati",
  },
};
