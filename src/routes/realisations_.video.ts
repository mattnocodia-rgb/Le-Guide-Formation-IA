import { createFileRoute } from "@tanstack/react-router";

/**
 * /realisations/video?r=rec… : streams the Short attached to a case study (Airtable field
 * "Vidéo"). Range requests are forwarded so iPhone/Safari can play and seek the file.
 */
export const Route = createFileRoute("/realisations_/video")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const recordId = new URL(request.url).searchParams.get("r") ?? "";
        const { getRealisationVideo } = await import("@/lib/airtable.server");
        const file = await getRealisationVideo(recordId);
        if (!file) return new Response("Vidéo introuvable", { status: 404 });
        const range = request.headers.get("range");
        const upstream = await fetch(file.url, range ? { headers: { range } } : undefined);
        if (!upstream.ok || !upstream.body) {
          return new Response("Vidéo indisponible", { status: 502 });
        }
        const headers = new Headers({
          "content-type": file.type,
          "accept-ranges": "bytes",
          "cache-control": "public, max-age=3600",
          "x-robots-tag": "noindex",
        });
        for (const h of ["content-length", "content-range"]) {
          const v = upstream.headers.get(h);
          if (v) headers.set(h, v);
        }
        return new Response(upstream.body, { status: upstream.status, headers });
      },
    },
  },
});
