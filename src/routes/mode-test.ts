import { createFileRoute } from "@tanstack/react-router";

import { TEST_COOKIE } from "@/lib/test-mode";

const ONE_YEAR = 60 * 60 * 24 * 365;

function page(title: string, text: string, status = 200, cookie?: string) {
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title}</title></head><body style="font-family:system-ui,sans-serif;background:#f3eee3;color:#1d1a16;max-width:32rem;margin:15vh auto;padding:0 1rem;line-height:1.5"><h1 style="font-size:1.4rem">${title}</h1><p>${text}</p><p><a href="/" style="color:#1d1a16">Retour au site</a></p></body></html>`;
  const headers = new Headers({
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
    "x-robots-tag": "noindex, nofollow",
  });
  if (cookie) headers.append("set-cookie", cookie);
  return new Response(html, { status, headers });
}

/**
 * /mode-test?cle=<TEST_KEY>       → marks this device: its clicks are flagged "Test".
 * /mode-test?cle=<TEST_KEY>&off   → unmarks it.
 * TEST_KEY is a Lovable secret; without it (or with a wrong key) the page does not exist.
 */
export const Route = createFileRoute("/mode-test")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { readToken } = await import("@/lib/airtable.server");
        const key = readToken("TEST_KEY");
        const url = new URL(request.url);
        if (!key || url.searchParams.get("cle") !== key) {
          return page("Page introuvable", "Cette page n\u2019existe pas.", 404);
        }
        const base = `${TEST_COOKIE}=1; Path=/; HttpOnly; Secure; SameSite=Lax`;
        if (url.searchParams.has("off")) {
          return page(
            "Mode test désactivé",
            "Les clics depuis cet appareil comptent de nouveau comme de vrais clics.",
            200,
            `${base}; Max-Age=0`,
          );
        }
        return page(
          "Mode test activé",
          "Pendant un an, les clics sur les liens Cube depuis cet appareil (et ce navigateur) seront marqués « Test » dans Airtable.",
          200,
          `${base}; Max-Age=${ONE_YEAR}`,
        );
      },
    },
  },
});
