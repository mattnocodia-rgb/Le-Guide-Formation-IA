import { createFileRoute } from "@tanstack/react-router";

import { PLACES, type Place } from "@/lib/track";

const BOT_UA =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|curl|wget|python|headless/i;

/** Page of origin, taken from the Referer when it comes from this site. */
function originPage(request: Request) {
  const ref = request.headers.get("referer");
  if (!ref) return "(inconnue)";
  try {
    const from = new URL(ref);
    const self = new URL(request.url);
    return from.host === self.host ? from.pathname : `(externe) ${from.host}`;
  } catch {
    return "(inconnue)";
  }
}

function isPrefetch(request: Request) {
  const purpose = request.headers.get("sec-purpose") ?? request.headers.get("purpose") ?? "";
  return /prefetch|prerender/i.test(purpose);
}

/**
 * /go/<linkId>?e=<placement> : counts the click in Airtable, then redirects to the
 * partner URL. No cookie and no personal data: only the link, the page and the date.
 */
export const Route = createFileRoute("/go/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { getCubeLinks, isLinkValid, linkOfType, recordClick } =
          await import("@/lib/airtable.server");
        const links = await getCubeLinks();
        const id = /^rec[A-Za-z0-9]{14}$/.test(params.id) ? params.id : "";
        const wanted = links.find((l) => l.id === id);
        const target = isLinkValid(wanted) ? wanted : linkOfType(links, "ressources");
        if (!target) return Response.redirect(new URL("/", request.url).toString(), 302);

        const ua = request.headers.get("user-agent") ?? "";
        if (!BOT_UA.test(ua) && !isPrefetch(request)) {
          const e = new URL(request.url).searchParams.get("e") ?? "";
          const place = e in PLACES ? PLACES[e as Place] : "Autre";
          // Bounded wait so a slow Airtable never delays the visitor much.
          await Promise.race([
            recordClick({ linkId: target.id, page: originPage(request), place }),
            new Promise((resolve) => setTimeout(resolve, 1500)),
          ]);
        }

        return new Response(null, {
          status: 302,
          headers: {
            location: target.url,
            "cache-control": "no-store",
            "x-robots-tag": "noindex, nofollow",
          },
        });
      },
    },
  },
});
