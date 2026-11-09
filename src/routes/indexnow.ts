import { createFileRoute } from "@tanstack/react-router";

import { INDEXNOW_KEY, SITE_URL, absUrl } from "@/lib/site";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const DAY = 24 * 60 * 60 * 1000;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

/**
 * Tells Bing (and the other IndexNow engines) which pages changed.
 *
 * /indexnow?cle=<INDEXNOW_SECRET>                    → pages changed in the last 2 days (Paris)
 * /indexnow?cle=<INDEXNOW_SECRET>&depuis=2026-11-01  → pages changed since that date
 * /indexnow?cle=<INDEXNOW_SECRET>&tout               → every page of the sitemap
 * /indexnow?cle=<INDEXNOW_SECRET>&pages=mon-article  → these slugs (comma-separated) + home page
 *
 * `pages` bypasses the 5-minute Airtable cache: the Airtable automation passes the slug of the
 * article it just published, which the cached list may not contain yet.
 * Meant to be called right after an article is published in Airtable.
 * INDEXNOW_SECRET is a Lovable secret; without it (or with a wrong key) the page does not exist.
 */
export const Route = createFileRoute("/indexnow")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { readToken, todayParis } = await import("@/lib/airtable.server");
        const secret = readToken("INDEXNOW_SECRET");
        const url = new URL(request.url);
        if (!secret || url.searchParams.get("cle") !== secret) {
          return json({ erreur: "Page introuvable" }, 404);
        }

        const pagesParam = url.searchParams.get("pages");
        const slugs = (pagesParam ?? "")
          .split(",")
          .map((p) => p.trim().replace(/^\/+|\/+$/g, ""))
          .filter((p) => /^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(p));
        const depuisParam = url.searchParams.get("depuis");
        const depuis = url.searchParams.has("tout")
          ? null
          : depuisParam && /^\d{4}-\d{2}-\d{2}$/.test(depuisParam)
            ? depuisParam
            : todayParis(new Date(Date.now() - 2 * DAY));

        let urlList: string[];
        if (slugs.length > 0) {
          urlList = [absUrl("/"), ...slugs.map((slug) => absUrl(`/${slug}`))];
        } else {
          const { getSitemapUrls } = await import("@/lib/sitemap.server");
          urlList = (await getSitemapUrls())
            .filter((u) => depuis === null || (u.lastmod !== null && u.lastmod >= depuis))
            .map((u) => u.loc);
        }

        if (urlList.length === 0) {
          return json({ envoye: false, depuis, message: "Aucune page modifiée sur la période." });
        }

        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            host: new URL(SITE_URL).host,
            key: INDEXNOW_KEY,
            keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
            urlList,
          }),
        });
        // 200 = accepted, 202 = accepted while the key is still being checked.
        const ok = res.status === 200 || res.status === 202;
        return json(
          {
            envoye: ok,
            statutIndexNow: res.status,
            depuis: slugs.length > 0 ? null : (depuis ?? "tout"),
            pages: urlList,
            ...(ok ? {} : { reponse: (await res.text()).slice(0, 500) }),
          },
          ok ? 200 : 502,
        );
      },
    },
  },
});
