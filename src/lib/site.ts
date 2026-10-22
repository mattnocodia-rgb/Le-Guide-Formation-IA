// Client-safe site constants and helpers (no secrets here).
export const SITE_URL = "https://formation-ia.optimatt.fr";
export const SITE_NAME = "Le Guide Formation IA";
export const SITE_PROMISE = "Se former à l'IA, sans se tromper de voie";
export const SITE_DESCRIPTION =
  "Métiers, outils, financement CPF : les guides d'un ingénieur BTP devenu product builder pour choisir sa formation à l'IA et au no-code.";
export const LINKEDIN_URL = "https://www.linkedin.com/in/matthieuaudineau/";

export const CATEGORIES = [
  {
    name: "Métier & reconversion",
    short: "Métier",
    slug: "metier-reconversion",
    color: "#E2583E",
    description: "Product builder, freelance, passer du CDI à l'IA.",
  },
  {
    name: "Outils & vibe coding",
    short: "Outils",
    slug: "outils-vibe-coding",
    color: "#1E3A5F",
    description: "Lovable, n8n, Make, Claude Code : quels outils apprendre, et dans quel ordre.",
  },
  {
    name: "IA en entreprise",
    short: "IA en entreprise",
    slug: "ia-en-entreprise",
    color: "#2E7D5B",
    description: "Audit IA, AI Act, vendre des agents IA aux entreprises.",
  },
  {
    name: "Growth & marketing",
    short: "Growth",
    slug: "growth-marketing",
    color: "#D99A1C",
    description: "Contenu LinkedIn, positionnement, acquisition.",
  },
  {
    name: "Financement",
    short: "Financement",
    slug: "financement",
    color: "#8A5A9E",
    description: "CPF, France Travail, OPCO : ce qui a changé en 2026.",
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

/** Short date for handwritten notes, e.g. "22/10". */
export function formatDateShort(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Paris",
  }).format(d);
}

/** Small, deterministic tilt so cards look hand-placed without changing between renders. */
export function tiltFor(index: number) {
  const tilts = ["-0.8deg", "0.7deg", "-0.4deg", "0.9deg", "-0.6deg", "0.5deg"];
  return tilts[index % tilts.length] ?? "0deg";
}

export const ORGANIZATION_LD = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
};

/** Author as structured data. No name is published on purpose: the LinkedIn profile identifies the author. */
export function authorLd(name?: string | null) {
  return {
    "@type": "Person",
    ...(name ? { name } : {}),
    url: LINKEDIN_URL,
    sameAs: [LINKEDIN_URL],
    jobTitle: "Product Builder No-Code & IA",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: "Titre RNCP niveau 6 — Product Builder No-Code",
      recognizedBy: { "@type": "Organization", name: "École Cube" },
    },
  };
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
