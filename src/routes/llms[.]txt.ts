import { createFileRoute } from "@tanstack/react-router";

import { CATEGORIES, SITE_DESCRIPTION, SITE_NAME, absUrl } from "@/lib/site";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const { getPublishedArticles } = await import("@/lib/airtable.server");
        const articles = await getPublishedArticles();
        const lines = [
          `# ${SITE_NAME}`,
          "",
          `> ${SITE_DESCRIPTION}`,
          "",
          "Guides écrits par un ingénieur BTP devenu product builder certifié (École Cube, RNCP niveau 6). Chaque article indique sa date de mise à jour et ses sources. Les liens vers l'École Cube sont des liens partenaires signalés.",
          "",
        ];
        for (const c of CATEGORIES) {
          const list = articles.filter((a) => a.categorySlug === c.slug);
          if (list.length === 0) continue;
          lines.push(`## ${c.name}`, "");
          for (const a of list)
            lines.push(
              `- [${a.title}](${absUrl(`/${a.slug}`)})${a.excerpt ? `: ${a.excerpt}` : ""}`,
            );
          lines.push("");
        }
        lines.push("## À propos", "", `- [Qui écrit ce guide](${absUrl("/a-propos")})`, "");
        return new Response(lines.join("\n"), {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=300",
          },
        });
      },
    },
  },
});
