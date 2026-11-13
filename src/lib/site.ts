// Client-safe site constants and helpers (no secrets here).
export const SITE_URL = "https://formation-ia.optimatt.fr";
export const SITE_NAME = "Le Guide Formation IA";
export const SITE_PROMISE = "Se former à l'IA, sans se tromper de voie";
export const SITE_DESCRIPTION =
  "Métiers, outils, financement CPF : les guides d'un commercial et product builder certifié, ingénieur BTP de formation, pour choisir sa formation à l'IA et au no-code.";
/**
 * Guides linked from the home page in the « Les guides essentiels » section, in this order.
 * Chosen for their search potential from Search Console (pages with impressions ranking in the top 30,
 * export of 11/11/2026); unpublished slugs are skipped.
 */
export const KEY_GUIDE_SLUGS = [
  "formation-ia-cpf-2026",
  "formation-product-builder-rncp-comparatif",
  "bootcamp-product-builder-retour-experience",
  "contrat-freelance-product-builder",
  "strategie-contenu-linkedin",
] as const;

/** Article opened by the "Lire le guide de départ" button on the home page. */
export const START_GUIDE_SLUG = "devenir-product-builder";

export const CONTACT_EMAIL = "contact@optimatt.fr";

/** Choices of the contact form (« Besoin »). `label` must match the Airtable single-select option. */
export const CONTACT_NEEDS = [
  { id: "audit", label: "Audit SEO de mon site" },
  { id: "redaction", label: "Rédaction d'articles" },
  { id: "automatisation", label: "Automatisation" },
  { id: "site", label: "Création de site web" },
  { id: "autre", label: "Autre" },
] as const;
export type ContactNeedId = (typeof CONTACT_NEEDS)[number]["id"];

/** Public name of the SEO / AEO / GEO skill, worded for non-specialists: it mainly writes blog articles. */
export const SKILL_NAME = "Rédiger des articles pour être référencé sur Google et ChatGPT";

export const LINKEDIN_URL = "https://www.linkedin.com/in/matthieuaudineau/";
/**
 * IndexNow key (public by design): served as /<key>.txt so Bing and the other engines can check it.
 */
export const INDEXNOW_KEY = "8419d695fed04a5b559c6e45d1de56d0";

/**
 * Last real content change of the pages that are not articles, for the sitemap <lastmod>.
 * Update the date when a page's content changes (not for style or code-only edits).
 */
export const STATIC_PAGES_UPDATED: Record<string, string> = {
  "/a-propos": "2026-11-09",
  "/skill-seo-aeo-geo": "2026-11-09",
  "/audit-seo": "2026-11-09",
  "/contact": "2026-11-09",
  "/tuto-shorts": "2026-11-09",
  "/boutique": "2026-11-09",
  "/simulateur-roi": "2026-11-05",
  "/realisations": "2026-11-09",
  "/creation-site-web": "2026-11-12",
  "/automatisation": "2026-11-13",
};

export const YOUTUBE_URL = "https://www.youtube.com/@LeGuideFormationIA";

export const CATEGORIES = [
  {
    name: "Métier & reconversion",
    short: "Métier",
    slug: "metier-reconversion",
    color: "#E2583E",
    description: "Product builder, freelance, passer du CDI à l'IA.",
    metaDescription:
      "Devenir product builder, se lancer en freelance, quitter un CDI pour l'IA : les guides d'un reconverti certifié, chiffres sourcés et datés.",
  },
  {
    name: "Outils & vibe coding",
    short: "Outils",
    slug: "outils-vibe-coding",
    color: "#1E3A5F",
    description: "Lovable, n8n, Make, Claude Code : quels outils apprendre, et dans quel ordre.",
    metaDescription:
      "Lovable, n8n, Make, Claude Code : quels outils no-code et IA apprendre en premier, à quoi ils servent et dans quel ordre s'y former.",
  },
  {
    name: "IA en entreprise",
    short: "IA en entreprise",
    slug: "ia-en-entreprise",
    color: "#2E7D5B",
    description: "Audit IA, AI Act, vendre des agents IA aux entreprises.",
    metaDescription:
      "Audit IA, AI Act 2026, agents IA : comment les entreprises adoptent l'IA, et comment leur vendre des automatisations quand on est product builder.",
  },
  {
    name: "Growth & marketing",
    short: "Growth",
    slug: "growth-marketing",
    color: "#D99A1C",
    description: "Contenu LinkedIn, positionnement, acquisition.",
    metaDescription:
      "Contenu LinkedIn, positionnement, prospection avec l'IA : les bases de l'acquisition pour un freelance ou une startup qui se lance.",
  },
  {
    name: "Financement",
    short: "Financement",
    slug: "financement",
    color: "#8A5A9E",
    description: "CPF, France Travail, OPCO : ce qui a changé en 2026.",
    metaDescription:
      "CPF, France Travail, OPCO : ce qui a changé en 2026 pour financer une formation IA ou no-code, avec les montants et les démarches.",
  },
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Categories shown in the top navigation (kept short so the header stays on one line). */
export const NAV_CATEGORIES = CATEGORIES.filter((c) => c.slug !== "growth-marketing");

export function categoryByName(name: string | undefined | null): Category | undefined {
  return CATEGORIES.find((c) => c.name === name);
}
export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function absUrl(path: string) {
  return `${SITE_URL}${path === "/" ? "/" : path}`;
}

export function ogImageFor(categorySlug?: string | null) {
  return `${SITE_URL}/og/${categorySlug ?? "default"}.png`;
}

export function formatDateFr(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(d);
}

/** Month and year for handwritten notes, e.g. "nov. 2025". */
export function formatDateShort(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    month: "short",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(d);
}

/** Small, deterministic tilt so cards look hand-placed without changing between renders. */
export function tiltFor(index: number) {
  const tilts = ["-0.8deg", "0.7deg", "-0.4deg", "0.9deg", "-0.6deg", "0.5deg"];
  return tilts[index % tilts.length] ?? "0deg";
}

/** Brand name of the domain (optimatt.fr), kept as an alternate name of the site. */
export const BRAND_NAME = "Optimatt";
export const AUTHOR_NAME = "Matthieu Audineau";
/** Square author photo served from /public, used by the byline, /a-propos and structured data. */
export const AUTHOR_PHOTO_PATH = "/photo-auteur.jpg";
/** Small WebP copies for display (the 800 px JPEG stays for structured data). */
export const AUTHOR_PHOTO_80 = "/photo-auteur-80.webp";
export const AUTHOR_PHOTO_224 = "/photo-auteur-224.webp";

/** Stable identifiers that tie the structured-data entities together across every page. */
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/a-propos#auteur`;

/** Profiles that identify the author elsewhere. */
export const AUTHOR_SAME_AS = [LINKEDIN_URL];

export const ORGANIZATION_LD = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  alternateName: BRAND_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/apple-touch-icon.png`,
    width: 180,
    height: 180,
  },
  founder: { "@id": PERSON_ID },
  sameAs: [YOUTUBE_URL],
};

export const WEBSITE_LD = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  alternateName: BRAND_NAME,
  url: SITE_URL,
  inLanguage: "fr-FR",
  description: SITE_DESCRIPTION,
  publisher: { "@id": ORGANIZATION_ID },
};

/** Author as structured data, with a stable @id so every page points to the same person. */
export function authorLd() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: AUTHOR_NAME,
    givenName: "Matthieu",
    familyName: "Audineau",
    url: `${SITE_URL}/a-propos`,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}${AUTHOR_PHOTO_PATH}`,
      width: 800,
      height: 800,
    },
    sameAs: AUTHOR_SAME_AS,
    jobTitle: "Product Builder No-Code & IA",
    homeLocation: { "@type": "Place", name: "Nantes" },
    knowsAbout: [
      "No-code",
      "Automatisation",
      "Make",
      "n8n",
      "Airtable",
      "IA générative",
      "Product management",
      "BIM",
      "BTP",
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: "Titre RNCP niveau 6 — Product Builder No-Code",
      recognizedBy: { "@type": "Organization", name: "École Cube" },
    },
  };
}

/** Short author reference for Article/FAQ nodes: keeps the name inline, points to the full node by @id. */
export const AUTHOR_REF = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: AUTHOR_NAME,
  url: `${SITE_URL}/a-propos`,
};

/** The shared entities (site, organization, author) to append to a page's @graph. */
export function siteEntitiesLd() {
  return [WEBSITE_LD, ORGANIZATION_LD, authorLd()];
}

export function pageHead(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}) {
  const url = absUrl(opts.path);
  const image = opts.image ?? ogImageFor();
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: opts.type ?? "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: opts.title },
      { name: "twitter:description", content: opts.description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function jsonLdScript(data: unknown) {
  return {
    type: "application/ld+json",
    // Escape "<" so article text can never close the script tag.
    children: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
