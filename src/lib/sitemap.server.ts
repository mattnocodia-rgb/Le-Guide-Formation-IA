import { getPublishedArticles } from "@/lib/airtable.server";
import { CATEGORIES, STATIC_PAGES_UPDATED, absUrl } from "@/lib/site";

export type SitemapUrl = { loc: string; lastmod: string | null };

const latestOf = (...dates: (string | null | undefined)[]) =>
  dates
    .filter((d): d is string => !!d)
    .sort()
    .at(-1) ?? null;

/** Every indexable URL with the date of its last real change (YYYY-MM-DD). */
export async function getSitemapUrls(): Promise<SitemapUrl[]> {
  const articles = await getPublishedArticles();
  const day = (d: string | null | undefined) => (d ? d.slice(0, 10) : null);
  const staticPages = Object.entries(STATIC_PAGES_UPDATED);
  return [
    {
      loc: absUrl("/"),
      lastmod: day(latestOf(articles[0]?.updatedAt, ...staticPages.map(([, d]) => d))),
    },
    ...CATEGORIES.map((c) => ({
      loc: absUrl(`/categorie/${c.slug}`),
      lastmod: day(articles.find((a) => a.categorySlug === c.slug)?.updatedAt),
    })),
    ...staticPages.map(([path, date]) => ({ loc: absUrl(path), lastmod: date })),
    ...articles.map((a) => ({ loc: absUrl(`/${a.slug}`), lastmod: day(a.updatedAt) })),
  ];
}
