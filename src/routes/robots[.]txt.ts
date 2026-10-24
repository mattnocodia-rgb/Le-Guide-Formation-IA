import { createFileRoute } from "@tanstack/react-router";

import { absUrl } from "@/lib/site";

const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
];

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const body = [
          "User-agent: *",
          "Allow: /",
          // Partner-link redirects: nothing to index, and bots must not inflate click counts.
          "Disallow: /go/",
          "Disallow: /mode-test",
          "Disallow: /skill-seo-aeo-geo/merci",
          "Disallow: /skill-seo-aeo-geo/fichier",
          "",
          // Explicitly welcome AI crawlers: being cited by answer engines is a goal of this site.
          ...AI_BOTS.flatMap((bot) => [
            `User-agent: ${bot}`,
            "Allow: /",
            "Disallow: /go/",
            "Disallow: /mode-test",
            "Disallow: /skill-seo-aeo-geo/merci",
            "Disallow: /skill-seo-aeo-geo/fichier",
            "",
          ]),
          `Sitemap: ${absUrl("/sitemap.xml")}`,
          "",
        ].join("\n");
        return new Response(body, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
