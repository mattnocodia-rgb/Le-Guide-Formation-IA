/**
 * Click tracking for partner (Cube) links.
 * Every partner link points to /go/<linkId>; the /go route records the click in
 * Airtable (link, page of origin, placement) and redirects to the real URL.
 */
export const PLACES = {
  article: "Article",
  encadre: "Encadré article",
  accueil: "Accueil",
  entete: "En-tête",
  pied: "Pied de page",
  apropos: "À propos",
  categorie: "Catégorie",
} as const;

export type Place = keyof typeof PLACES;

/** Internal redirect path for a partner link record. */
export function goPath(linkId: string) {
  return `/go/${linkId}`;
}

/** Adds the placement to a /go/ link so the dashboard can tell header, article, footer… apart. */
export function track(url: string, place: Place) {
  return url.startsWith("/go/") ? `${url}?e=${place}` : url;
}
