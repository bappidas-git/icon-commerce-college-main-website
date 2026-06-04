/* ============================================
   SEO Utility Functions
   Dynamic SEO management for SPAs including
   meta tag updates and JSON-LD schema injection.
   ============================================ */

import { seoConfig } from '../config/seo';
import { coursesData, getCourseBySlug } from '../data/coursesData';

// =========================================
// URL helpers
// =========================================

/**
 * Resolve a path or relative URL to an absolute URL on the canonical domain.
 * Absolute http(s) URLs are returned unchanged.
 * @param {string} pathOrUrl
 * @returns {string}
 */
export function absoluteUrl(pathOrUrl = '') {
  if (!pathOrUrl) return seoConfig.siteUrl;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${seoConfig.siteUrl}${path}`;
}

// =========================================
// Page SEO — Update document title & meta tags
// =========================================

/**
 * Update page title, meta description, OG tags, and Twitter cards dynamically.
 * @param {Object} pageConfig - Page-specific SEO overrides
 * @param {string} [pageConfig.title] - Page title
 * @param {string} [pageConfig.description] - Meta description (150-160 chars recommended)
 * @param {string} [pageConfig.image] - OG/Twitter image URL
 * @param {string} [pageConfig.url] - Canonical URL for this page
 * @param {string} [pageConfig.robots] - Robots directive (e.g., 'noindex, nofollow')
 * @param {string} [pageConfig.type] - OG type (default: 'website')
 */
export function updatePageSEO(pageConfig = {}) {
  const {
    title,
    description = seoConfig.defaultDescription,
    image = seoConfig.defaultImage,
    url,
    robots,
    type = 'website',
  } = pageConfig;

  // Title
  if (title) {
    document.title = title;
  }

  // Helper to set or create a meta tag
  const setMeta = (attr, key, value) => {
    if (!value) return;
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  };

  // Standard meta
  setMeta('name', 'description', description);
  if (robots) {
    setMeta('name', 'robots', robots);
  }

  // Open Graph
  setMeta('property', 'og:title', title || seoConfig.defaultTitle);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:type', type);
  setMeta('property', 'og:site_name', seoConfig.siteName);
  setMeta('property', 'og:locale', seoConfig.locale);
  if (url) {
    setMeta('property', 'og:url', url);
  }

  // Twitter Card
  setMeta('name', 'twitter:title', title || seoConfig.defaultTitle);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);

  // Canonical URL
  if (url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }
}

// =========================================
// JSON-LD Schema Injection / Removal
// =========================================

/**
 * Inject a JSON-LD schema into the <head>. If a script with the given ID
 * already exists, its content is replaced.
 * @param {string} id - Unique ID for the script element (e.g., 'schema-organization')
 * @param {Object} schemaObject - The JSON-LD object to inject
 */
export function injectSchema(id, schemaObject) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', id);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaObject);
}

/**
 * Remove a JSON-LD schema by its script element ID.
 * @param {string} id - The ID of the script element to remove
 */
export function removeSchema(id) {
  const script = document.getElementById(id);
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }
}

// =========================================
// Schema Generators
// =========================================

/**
 * Generate Organization schema from seoConfig.
 * @param {Object} [config] - Override seoConfig.organization
 * @returns {Object} JSON-LD Organization schema
 */
export function generateOrganizationSchema(config) {
  const org = config || seoConfig.organization;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: org.name,
    alternateName: org.alternateName,
    url: org.url,
    logo: absoluteUrl(org.logo),
    image: absoluteUrl(org.logo),
    description: org.description,
    telephone: org.phone,
    email: org.email,
    address: {
      '@type': 'PostalAddress',
      ...(org.address.streetAddress && { streetAddress: org.address.streetAddress }),
      addressLocality: org.address.addressLocality,
      addressRegion: org.address.addressRegion,
      ...(org.address.postalCode && { postalCode: org.address.postalCode }),
      addressCountry: org.address.addressCountry,
    },
  };

  if (org.sameAs && org.sameAs.length > 0) {
    schema.sameAs = org.sameAs;
  }

  if (org.foundingDate) {
    schema.foundingDate = org.foundingDate;
  }

  if (org.courses && org.courses.length > 0) {
    schema.hasOfferingCatalog = {
      '@type': 'OfferCatalog',
      name: 'Undergraduate Programs',
      itemListElement: org.courses.map((course) => ({
        '@type': 'Course',
        name: course.name,
        description: course.description,
        provider: {
          '@type': 'CollegeOrUniversity',
          name: org.name,
          sameAs: org.url,
        },
      })),
    };
  }

  return schema;
}

/**
 * Generate FAQPage schema.
 * @param {Array<{question: string, answer: string}>} [faqs] - Array of FAQ items
 * @returns {Object} JSON-LD FAQPage schema
 */
export function generateFAQSchema(faqs) {
  const faqItems = faqs || seoConfig.faqs;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate LocalBusiness schema.
 * @param {Object} [config] - Override seoConfig.localBusiness
 * @returns {Object} JSON-LD LocalBusiness schema
 */
export function generateLocalBusinessSchema(config) {
  const biz = config || seoConfig.localBusiness;
  const org = seoConfig.organization;

  const schema = {
    '@context': 'https://schema.org',
    '@type': biz.type,
    name: org.name,
    image: absoluteUrl(org.logo),
    telephone: org.phone,
    email: org.email,
    address: {
      '@type': 'PostalAddress',
      ...(org.address.streetAddress && { streetAddress: org.address.streetAddress }),
      addressLocality: org.address.addressLocality,
      addressRegion: org.address.addressRegion,
      ...(org.address.postalCode && { postalCode: org.address.postalCode }),
      addressCountry: org.address.addressCountry,
    },
    priceRange: biz.priceRange,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: biz.openingHours.days,
      opens: biz.openingHours.opens,
      closes: biz.openingHours.closes,
    },
  };

  if (biz.geo && biz.geo.latitude && biz.geo.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: biz.geo.latitude,
      longitude: biz.geo.longitude,
    };
  }

  if (org.url) {
    schema.url = org.url;
  }

  if (biz.hasMap) {
    schema.hasMap = biz.hasMap;
  }

  if (org.courses && org.courses.length > 0) {
    schema.hasOfferingCatalog = {
      '@type': 'OfferCatalog',
      name: 'Undergraduate Programs',
      itemListElement: org.courses.map((course) => ({
        '@type': 'Course',
        name: course.name,
        description: course.description,
      })),
    };
  }

  return schema;
}

/**
 * Generate BreadcrumbList schema.
 * @param {Array<{name: string, url: string}>} items - Breadcrumb items in order
 * @returns {Object} JSON-LD BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate WebPage schema.
 * @param {Object} config - Page configuration
 * @param {string} config.name - Page name/title
 * @param {string} config.description - Page description
 * @param {string} config.url - Page URL
 * @returns {Object} JSON-LD WebPage schema
 */
export function generateWebPageSchema(config) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: config.name || seoConfig.defaultTitle,
    description: config.description || seoConfig.defaultDescription,
    url: config.url || seoConfig.siteUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.organization.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(seoConfig.organization.logo),
      },
    },
  };
}

/**
 * Generate WebSite schema with a SearchAction (sitelinks search box).
 * @returns {Object} JSON-LD WebSite schema
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    alternateName: seoConfig.organization.alternateName,
    url: seoConfig.siteUrl,
    inLanguage: seoConfig.language,
    publisher: {
      '@type': 'CollegeOrUniversity',
      name: seoConfig.organization.name,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${seoConfig.siteUrl}/?s={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Course schema for a single program (course detail pages).
 * @param {Object} course - A course record from coursesData
 * @returns {Object} JSON-LD Course schema
 */
export function generateCourseSchema(course) {
  if (!course) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.summary || course.description,
    url: `${seoConfig.siteUrl}/courses/${course.slug}`,
    inLanguage: seoConfig.language,
    provider: {
      '@type': 'CollegeOrUniversity',
      name: seoConfig.organization.name,
      sameAs: seoConfig.organization.url,
    },
    educationalCredentialAwarded: course.name,
    ...(course.image && { image: absoluteUrl(course.image) }),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      ...(course.duration && { courseWorkload: course.duration }),
      location: {
        '@type': 'Place',
        name: seoConfig.organization.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: seoConfig.organization.address.addressLocality,
          addressRegion: seoConfig.organization.address.addressRegion,
          addressCountry: seoConfig.organization.address.addressCountry,
        },
      },
    },
    ...(course.fees &&
      course.fees.application && {
        offers: {
          '@type': 'Offer',
          category: 'Application Fee',
          price: String(course.fees.application).replace(/[^\d.]/g, ''),
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: `${seoConfig.siteUrl}/admissions`,
        },
      }),
  };
}

/**
 * Generate an ItemList schema for the UG programs (the /courses overview page).
 * Each entry is a Course provided by the college, in catalogue order.
 * @param {Array} [courses] - course records (defaults to all of coursesData)
 * @returns {Object} JSON-LD ItemList of Course items
 */
export function generateCourseListSchema(courses = coursesData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Undergraduate Programs',
    itemListElement: courses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        name: course.name,
        description: course.summary || course.description,
        url: `${seoConfig.siteUrl}/courses/${course.slug}`,
        provider: {
          '@type': 'CollegeOrUniversity',
          name: seoConfig.organization.name,
          sameAs: seoConfig.organization.url,
        },
      },
    })),
  };
}

/**
 * Generate Service schema for a list of services/plans.
 * @param {Array<{name: string, description: string, id: string}>} services - Service data
 * @returns {Object} JSON-LD Service schema (ItemList)
 */
export function generateServiceSchema(services) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: {
          '@type': 'Organization',
          name: seoConfig.organization.name,
        },
        ...(service.duration && {
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR',
            description: service.duration,
            availability: 'https://schema.org/InStock',
          },
        }),
      },
    })),
  };
}

/**
 * Generate Product schema for service plans with pricing.
 * @param {Array<Object>} products - Product/plan data
 * @param {string} products[].name - Product name
 * @param {string} products[].description - Product description
 * @param {string} [products[].price] - Price (numeric string)
 * @param {string} [products[].currency] - Currency code (default: 'INR')
 * @returns {Object} JSON-LD Product schema (ItemList)
 */
export function generateProductSchema(products) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        brand: {
          '@type': 'Organization',
          name: seoConfig.organization.name,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: product.currency || 'INR',
          ...(product.price
            ? { price: product.price }
            : { price: '0', description: 'Contact for pricing' }),
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };
}

// =========================================
// Convenience: Inject site-wide schemas (once)
// =========================================

/**
 * Inject the route-independent schemas that appear on every public page:
 * Organization/CollegeOrUniversity, LocalBusiness and WebSite (+ SearchAction).
 * Per-route schemas (WebPage, BreadcrumbList, FAQPage, Course) are managed by
 * {@link applySeo}. Safe to call multiple times — schemas are keyed by id.
 */
export function injectDefaultSchemas() {
  injectSchema('schema-organization', generateOrganizationSchema());
  injectSchema('schema-localbusiness', generateLocalBusinessSchema());
  injectSchema('schema-website', generateWebSiteSchema());
}

/**
 * Remove every public schema (used when entering admin routes).
 */
export function removeAllSchemas() {
  [
    'schema-organization',
    'schema-localbusiness',
    'schema-website',
    'schema-webpage',
    'schema-breadcrumb',
    'schema-faq',
    'schema-course',
  ].forEach(removeSchema);
}

// =========================================
// Per-route resolution
// =========================================

/** Map static public pathnames to a key in seoConfig.pages. */
const ROUTE_KEY_BY_PATH = {
  '/': 'home',
  '/about': 'about',
  '/leadership': 'leadership',
  '/courses': 'courses',
  '/departments': 'departments',
  '/faculty': 'faculty',
  '/facilities': 'facilities',
  '/gallery': 'gallery',
  '/admissions': 'admissions',
  '/notices': 'notices',
  '/events': 'events',
  '/contact': 'contact',
  '/thank-you': 'thankYou',
};

/** Normalise a pathname: strip trailing slash (except root), drop query/hash. */
function normalisePath(pathname = '/') {
  const clean = String(pathname).split(/[?#]/)[0];
  if (clean.length > 1 && clean.endsWith('/')) return clean.slice(0, -1);
  return clean || '/';
}

/**
 * Build the BreadcrumbList trail for a pathname using the page `crumb` labels
 * (with course names resolved for /courses/:slug).
 * @param {string} pathname
 * @returns {Array<{name: string, url: string}>}
 */
export function buildBreadcrumbs(pathname) {
  const path = normalisePath(pathname);
  const crumbs = [{ name: 'Home', url: `${seoConfig.siteUrl}/` }];
  if (path === '/') return crumbs;

  const segments = path.split('/').filter(Boolean);
  let acc = '';
  segments.forEach((segment, i) => {
    acc += `/${segment}`;
    let name;
    const key = ROUTE_KEY_BY_PATH[acc];
    if (key && seoConfig.pages[key]) {
      name = seoConfig.pages[key].crumb;
    } else if (segments[0] === 'courses' && i === 1) {
      const course = getCourseBySlug(segment);
      name = course ? course.shortName : segment;
    } else {
      name = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    crumbs.push({ name, url: `${seoConfig.siteUrl}${acc}` });
  });
  return crumbs;
}

/**
 * Resolve the full SEO descriptor for a pathname from the route map + data.
 * @param {string} pathname
 * @returns {Object} { key, title, description, keywords, image, url, robots,
 *                      type, isAdmin, faq, course }
 */
export function resolvePageSeo(pathname) {
  const path = normalisePath(pathname);
  const url = `${seoConfig.siteUrl}${path === '/' ? '/' : path}`;

  // Admin (noindex, no schemas)
  if (path === '/admin' || path.startsWith('/admin/')) {
    const cfg = seoConfig.pages.admin;
    return {
      key: 'admin',
      title: cfg.title,
      description: cfg.description || seoConfig.defaultDescription,
      image: absoluteUrl(seoConfig.defaultImage),
      url,
      robots: cfg.robots,
      type: 'website',
      isAdmin: true,
    };
  }

  // Course detail — /courses/:slug
  const courseMatch = path.match(/^\/courses\/([^/]+)$/);
  if (courseMatch) {
    const course = getCourseBySlug(courseMatch[1]);
    if (course) {
      return {
        key: 'courseDetail',
        title: `${course.name} | Icon Commerce College, Guwahati`,
        description: course.summary,
        keywords: `${course.shortName} guwahati, ${course.name}, ${course.affiliation}, fyugp ${course.shortName}, icon commerce college`,
        image: absoluteUrl(course.image),
        url,
        robots: 'index, follow',
        type: 'article',
        course,
      };
    }
    // Unknown slug → 404 treatment
  }

  // Known static route
  const key = ROUTE_KEY_BY_PATH[path];
  if (key) {
    const cfg = seoConfig.pages[key];
    return {
      key,
      title: cfg.title,
      description: cfg.description || seoConfig.defaultDescription,
      keywords: cfg.keywords,
      image: absoluteUrl(cfg.image || seoConfig.defaultImage),
      url,
      robots: cfg.robots || 'index, follow',
      type: key === 'home' ? 'website' : 'website',
      faq: key === 'home' || key === 'admissions',
    };
  }

  // Fallback → 404
  const cfg = seoConfig.pages.notFound;
  return {
    key: 'notFound',
    title: cfg.title,
    description: cfg.description,
    image: absoluteUrl(seoConfig.defaultImage),
    url,
    robots: cfg.robots,
    type: 'website',
  };
}

// =========================================
// Per-page override store
// =========================================
// Lets pages contribute SEO overrides (via the useSeo hook) that the global
// SEOHead merges over the route defaults. Keyed by pathname so the global
// applier (which runs after child effects) always sees the latest override.

const overrideStore = new Map();

/** Register/replace SEO overrides for a pathname. */
export function setSeoOverride(pathname, override) {
  overrideStore.set(normalisePath(pathname), override || {});
}

/** Remove SEO overrides for a pathname. */
export function clearSeoOverride(pathname) {
  overrideStore.delete(normalisePath(pathname));
}

/** Read SEO overrides for a pathname (or undefined). */
export function getSeoOverride(pathname) {
  return overrideStore.get(normalisePath(pathname));
}

// =========================================
// Central applier — meta + per-route schemas
// =========================================

/**
 * Resolve + apply all SEO for a pathname: title/description/canonical/OG/Twitter
 * meta and the per-route JSON-LD schemas (WebPage, BreadcrumbList, FAQPage,
 * Course). Site-wide schemas are handled by {@link injectDefaultSchemas}.
 * Any registered per-page override (see {@link setSeoOverride}) is merged last.
 *
 * @param {string} pathname - current location pathname
 */
export function applySeo(pathname) {
  const base = resolvePageSeo(pathname);
  const override = getSeoOverride(pathname) || {};

  const resolved = {
    ...base,
    ...override,
    image: override.image ? absoluteUrl(override.image) : base.image,
  };

  // --- Meta tags ---
  updatePageSEO({
    title: resolved.title,
    description: resolved.description,
    image: resolved.image,
    url: resolved.url,
    robots: resolved.robots,
    type: resolved.type,
  });

  // Keywords (optional)
  if (resolved.keywords) {
    let el = document.querySelector('meta[name="keywords"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', 'keywords');
      document.head.appendChild(el);
    }
    el.setAttribute('content', resolved.keywords);
  }

  // --- Schemas ---
  // Admin: strip every schema and bail.
  if (resolved.isAdmin) {
    removeAllSchemas();
    return;
  }

  // Ensure the site-wide schemas exist (they may have been removed on admin).
  injectDefaultSchemas();

  // WebPage (per route)
  injectSchema(
    'schema-webpage',
    generateWebPageSchema({
      name: resolved.title,
      description: resolved.description,
      url: resolved.url,
    })
  );

  // BreadcrumbList (skip the single-item Home trail)
  const crumbs = buildBreadcrumbs(pathname);
  if (crumbs.length > 1) {
    injectSchema('schema-breadcrumb', generateBreadcrumbSchema(crumbs));
  } else {
    removeSchema('schema-breadcrumb');
  }

  // FAQPage (Home + Admissions, or when a page provides its own faqs)
  if (override.faqs && override.faqs.length) {
    injectSchema('schema-faq', generateFAQSchema(override.faqs));
  } else if (resolved.faq) {
    injectSchema('schema-faq', generateFAQSchema());
  } else {
    removeSchema('schema-faq');
  }

  // Course (course detail pages)
  if (resolved.course) {
    injectSchema('schema-course', generateCourseSchema(resolved.course));
  } else {
    removeSchema('schema-course');
  }

  // Arbitrary extra schema passed by a page override
  if (override.schema) {
    injectSchema('schema-page-extra', override.schema);
  } else {
    removeSchema('schema-page-extra');
  }
}

/** All public program records (handy for sitemaps/tests). */
export { coursesData };
