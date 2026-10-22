// Client-safe site constants and helpers (no secrets here).
export const SITE_URL = "https://formation-ia.optimatt.fr";
export const SITE_NAME = "Le Guide Formation IA";
export const SITE_PROMISE = "Choisir sa formation IA et no-code, sans se tromper";
export const SITE_DESCRIPTION =
  "Guides pratiques et sourcés pour choisir sa formation à l'IA et au no-code : métiers, reconversion, outils, financement.";

export const CATEGORIES = [
  { name: "Métier & reconversion", slug: "metier-reconversion", description: "Les métiers de l'IA et du no-code, et comment s'y reconvertir." },
  { name: "Outils & vibe coding", slug: "outils-vibe-coding", description: "Les outils à connaître et la façon de les apprendre." },
  { name: "IA en entreprise", slug: "ia-en-entreprise", description: "Former ses équipes et déployer l'IA au travail." },
  { name: "Growth & marketing", slug: "growth-marketing", description: "L'IA et le no-code au service de l'acquisition." },
  { name: "Financement", slug: "financement", description: "CPF, OPCO, France Travail : financer sa formation." },
] as const;

export type Category = (typeof CATEGORIES)[number];

export function categoryByName(name: string | undefined | null): Category | undefined {
  return CATEGORIES.find((c) => c.name === name);
}
export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function absUrl(path: string) {
  return `${SITE_URL}${path === "/" ? "/" : path}`;
}

export function ogImageFor(categorySlug?: string) {
  return `${SITE_URL}/og/${categorySlug ?? "default"}.png`;
}

export function formatDateFr(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(d);
}

export const ORGANIZATION_LD = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
};

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
