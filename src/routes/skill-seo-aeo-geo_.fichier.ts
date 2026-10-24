import { createFileRoute } from "@tanstack/react-router";

const FILE_KEY = "skill_seo_aeo_geo";

function back(request: Request, sessionId: string) {
  const to = new URL("/skill-seo-aeo-geo/merci", request.url);
  if (sessionId) to.searchParams.set("session_id", sessionId);
  return Response.redirect(to.toString(), 302);
}

/**
 * /skill-seo-aeo-geo/fichier?session_id=cs_… : streams the skill .zip, only after Stripe
 * confirms the session was paid through the skill's Payment Link. The file lives in
 * Airtable ("Fichiers vendus"), never in the public repository.
 */
export const Route = createFileRoute("/skill-seo-aeo-geo_/fichier")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
        const { getParcours, getSoldFile } = await import("@/lib/airtable.server");
        const { checkPurchase } = await import("@/lib/stripe.server");
        const parcours = await getParcours();
        const check = await checkPurchase(sessionId, parcours["skill_lien_stripe"] ?? null);
        if (!check.ok) return back(request, sessionId);

        const file = await getSoldFile(FILE_KEY);
        if (!file) return back(request, sessionId);
        const upstream = await fetch(file.url);
        if (!upstream.ok || !upstream.body) return back(request, sessionId);

        return new Response(upstream.body, {
          headers: {
            "content-type": file.type,
            "content-disposition": `attachment; filename="${file.filename.replace(/"/g, "")}"`,
            "cache-control": "private, no-store",
            "x-robots-tag": "noindex, nofollow",
          },
        });
      },
    },
  },
});
