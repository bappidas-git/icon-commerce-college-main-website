/* ============================================
   SEO Configuration — Icon Commerce College
   Central source of truth for SEO settings, the
   per-route metadata map, schema.org data and the
   FAQ content used by SEOHead / useSeo.
   ============================================ */

export const seoConfig = {
  // =========================================
  // Site-level Settings
  // =========================================
  siteName: "Icon Commerce College",
  siteUrl: "https://iconcommercecollege.in",
  defaultTitle:
    "Icon Commerce College, Guwahati | Commerce, Arts & Computer Applications",
  titleTemplate: "%s | Icon Commerce College",
  defaultDescription:
    "Icon Commerce College, Guwahati — empowering Commerce, Arts & Computer Application graduates since 2004. Affiliated to Gauhati University under NEP 2020 (FYUGP). B.Com, BBA, BCA and B.A. programs.",
  // PRODUCTION SWAP: replace with a real 1200×630 raster (JPG/PNG) — social
  // platforms don't render SVG share images. The placeholder keeps the
  // og:image / twitter:image / schema reference resolvable (see docs/images.md).
  defaultImage: "/images/placeholders/og-default.svg",
  locale: "en_IN",
  language: "en",
  twitterHandle: "", // TODO: set the official @handle when available.

  // =========================================
  // Organization Details (Educational)
  // =========================================
  organization: {
    name: "Icon Commerce College",
    alternateName: "ICC",
    url: "https://iconcommercecollege.in",
    logo: "https://res.cloudinary.com/dn9gyaiik/image/upload/v1777447286/icon-logo_ssglnp.png",
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
    // TODO: add the official Facebook + YouTube profile URLs when supplied.
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
  // Per-page SEO Settings (one entry per route in §5).
  // `crumb` is the short label used in the BreadcrumbList.
  // Detail pages (e.g. /courses/:slug) are generated at
  // runtime in src/utils/seo.js from the route data.
  // =========================================
  pages: {
    home: {
      crumb: "Home",
      title:
        "Icon Commerce College, Guwahati | Commerce, Arts & Computer Applications",
      description:
        "Admissions open at Icon Commerce College, Guwahati. B.Com, BBA, BCA and B.A. programs affiliated to Gauhati University (NEP 2020 / FYUGP). Established 2004.",
      keywords:
        "icon commerce college, commerce college guwahati, bcom guwahati, bba guwahati, bca guwahati, ba guwahati, gauhati university college, fyugp commerce, college code 842",
    },
    about: {
      crumb: "About",
      title: "About Us | Icon Commerce College, Guwahati",
      description:
        "Learn about Icon Commerce College, Guwahati — established 2004 under the Icon Academy Trust, affiliated to Gauhati University. Our history, vision, mission and accreditation.",
      keywords:
        "about icon commerce college, college history guwahati, vision mission, icon academy trust, gauhati university affiliated college",
    },
    leadership: {
      crumb: "Leadership",
      title: "Leadership — Messages from the Desks | Icon Commerce College",
      description:
        "Messages from the desks of the President, Principal, Rector, Directors and Academic Advisors of Icon Commerce College, Guwahati.",
      keywords:
        "icon commerce college leadership, principal message, governing body, president, director, academic advisor",
    },
    courses: {
      crumb: "Courses",
      title: "Courses & Programs (B.Com, BBA, BCA, B.A.) | Icon Commerce College",
      description:
        "Explore the four UG programs at Icon Commerce College — B.Com, BBA, BCA and B.A. under NEP 2020 (FYUGP), affiliated to Gauhati University. Fees, eligibility and careers.",
      keywords:
        "bcom course guwahati, bba course guwahati, bca course guwahati, ba course guwahati, fyugp programs, gauhati university ug courses",
    },
    departments: {
      crumb: "Departments",
      title: "Departments (Arts, Commerce & Science) | Icon Commerce College",
      description:
        "Academic departments at Icon Commerce College across Arts, Commerce and Science streams — from Accountancy and Management to Computer Application and Mathematics.",
      keywords:
        "icon commerce college departments, arts department, commerce department, science department, computer application, accountancy",
    },
    faculty: {
      crumb: "Faculty",
      title: "Faculty — Teaching Staff | Icon Commerce College, Guwahati",
      description:
        "Meet the qualified and experienced teaching faculty of Icon Commerce College, Guwahati, across Commerce, Arts and Computer Application departments.",
      keywords:
        "icon commerce college faculty, teaching staff guwahati, professors, qualified faculty commerce college",
    },
    facilities: {
      crumb: "Facilities",
      title: "Campus Facilities | Icon Commerce College, Guwahati",
      description:
        "Campus facilities at Icon Commerce College — digital library, computer lab, smart classrooms, online classes, canteen, free Wi-Fi, playground and scholarship assistance.",
      keywords:
        "icon commerce college facilities, digital library, computer lab, smart classroom, college wifi, canteen, playground guwahati",
    },
    gallery: {
      crumb: "Gallery",
      title: "Photo & Video Gallery | Icon Commerce College, Guwahati",
      description:
        "Photos and videos from campus life, events and activities at Icon Commerce College, Guwahati.",
      keywords:
        "icon commerce college gallery, campus photos, college events guwahati, college video gallery",
    },
    admissions: {
      crumb: "Admissions",
      title:
        "Admissions 2026-27 (Samarth, College Code 842) | Icon Commerce College",
      description:
        "Apply to Icon Commerce College via the Samarth portal (College Code 842). Admission process, eligibility, fees and prospectus for B.Com, BBA, BCA and B.A. programs.",
      keywords:
        "icon commerce college admission, samarth portal admission, college code 842, assam college admission, bcom bba bca ba admission guwahati, prospectus",
    },
    notices: {
      crumb: "Notices",
      title: "Notices & Announcements | Icon Commerce College, Guwahati",
      description:
        "Latest notices and official announcements from Icon Commerce College, Guwahati — admissions, examinations and important updates.",
      keywords:
        "icon commerce college notices, admission notification, college announcements guwahati",
    },
    events: {
      crumb: "Events",
      title: "Events & College Calendar | Icon Commerce College, Guwahati",
      description:
        "Upcoming events and the college calendar at Icon Commerce College — Annual College Week, ICON Shield & ICON Trophy cricket tournaments and more.",
      keywords:
        "icon commerce college events, college week, icon shield, icon trophy, college calendar guwahati",
    },
    contact: {
      crumb: "Contact",
      title: "Contact Us | Icon Commerce College, Guwahati",
      description:
        "Contact Icon Commerce College, Guwahati — Rajgarh Road, Near Byelane No-3, Chandmari, Guwahati – 781003. Phone, email and location map.",
      keywords:
        "icon commerce college contact, college address guwahati, chandmari college phone, college email",
    },
    thankYou: {
      crumb: "Thank You",
      title: "Thank You | Icon Commerce College",
      description:
        "Thanks for your interest in Icon Commerce College. Our admission team will call you shortly to guide you through the process.",
      robots: "noindex, nofollow",
    },
    notFound: {
      crumb: "Page Not Found",
      title: "Page Not Found (404) | Icon Commerce College",
      description:
        "The page you are looking for could not be found. Explore our courses, admissions and campus information at Icon Commerce College, Guwahati.",
      robots: "noindex, follow",
    },
    admin: {
      crumb: "Admin",
      title: "Admin Panel | Icon Commerce College",
      description: "",
      robots: "noindex, nofollow",
    },
  },

  // =========================================
  // FAQ Schema Data (used on Home + Admissions)
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
      question: "What are the fees for the programs?",
      answer:
        "First-semester total fees are ₹10,900 for B.Com and B.A. and ₹11,000 for BCA and BBA, with monthly tuition of ₹1,800–₹2,000 and a ₹300 application fee. Gauhati University registration, enrolment and examination fees are extra and subject to change.",
    },
    {
      question: "Where is the college located?",
      answer:
        "Icon Commerce College is at Rajgarh Road, Near Byelane No-3, Chandmari, Guwahati, Assam – 781003.",
    },
  ],

  // =========================================
  // CollegeOrUniversity / LocalBusiness Schema Settings
  // =========================================
  localBusiness: {
    type: "CollegeOrUniversity",
    priceRange: "$",
    openingHours: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "16:30",
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

export default seoConfig;
