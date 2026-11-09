import { createFileRoute } from "@tanstack/react-router";

const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { getSitemapUrls } = await import("@/lib/sitemap.server");
        const urls = await getSitemapUrls();
        const body =
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls
            .map(
              (u) =>
                `  <url><loc>${xmlEscape(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`,
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
