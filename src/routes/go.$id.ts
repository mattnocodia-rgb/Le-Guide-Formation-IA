import { createFileRoute } from "@tanstack/react-router";

import { isRealClick, originPage } from "@/lib/click-filter";
import { isTestDevice } from "@/lib/test-mode";
import { PLACES, type Place } from "@/lib/track";

/**
 * /go/<linkId>?e=<placement> : counts the click in Airtable, then redirects to the
 * partner URL. No personal data: only the link, the page and the date. Clicks from the
 * owner's devices (test-mode cookie, see /mode-test) are flagged "Test".
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

        if (isRealClick(request)) {
          const e = new URL(request.url).searchParams.get("e") ?? "";
          const place = e in PLACES ? PLACES[e as Place] : "Autre";
          // Bounded wait so a slow Airtable never delays the visitor much.
          await Promise.race([
            recordClick({
              linkId: target.id,
              page: originPage(request),
              place,
              test: isTestDevice(request),
            }),
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
