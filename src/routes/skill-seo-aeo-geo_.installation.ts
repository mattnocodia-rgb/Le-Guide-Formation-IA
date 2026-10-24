import { createFileRoute } from "@tanstack/react-router";

/**
 * The step-by-step tutorial now ships as a PDF with the skill. This URL was briefly
 * public and indexed: send it permanently to the skill page.
 */
export const Route = createFileRoute("/skill-seo-aeo-geo_/installation")({
  server: {
    handlers: {
      GET: ({ request }) =>
        Response.redirect(new URL("/skill-seo-aeo-geo", request.url).toString(), 301),
    },
  },
});
