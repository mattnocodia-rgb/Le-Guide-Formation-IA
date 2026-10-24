import { createFileRoute } from "@tanstack/react-router";

import { CATEGORIES, absUrl } from "@/lib/site";

const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { getPublishedArticles } = await import("@/lib/airtable.server");
        const articles = await getPublishedArticles();
        const latest = articles[0]?.updatedAt ?? null;
        const urls: { loc: string; lastmod: string | null }[] = [
          { loc: absUrl("/"), lastmod: latest },
          ...CATEGORIES.map((c) => ({
            loc: absUrl(`/categorie/${c.slug}`),
            lastmod: articles.find((a) => a.categorySlug === c.slug)?.updatedAt ?? null,
          })),
          { loc: absUrl("/a-propos"), lastmod: null },
          { loc: absUrl("/skill-seo-aeo-geo"), lastmod: null },
          ...articles.map((a) => ({ loc: absUrl(`/${a.slug}`), lastmod: a.updatedAt })),
        ];
        const body =
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls
            .map(
              (u) =>
                `  <url><loc>${xmlEscape(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod.slice(0, 10)}</lastmod>` : ""}</url>`,
            )
            .join("\n") +
          `\n</urlset>\n`;
        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            // No edge caching: a stale copy kept new articles out of the sitemap.
            "cache-control": "no-cache, max-age=0, must-revalidate",
            "cdn-cache-control": "no-store",
          },
        });
      },
    },
  },
});
