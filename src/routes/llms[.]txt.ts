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
          "Guides écrits par un ingénieur BTP de formation, à la fois commercial et product builder certifié (École Cube, RNCP niveau 6). Chaque article indique sa date de mise à jour et ses sources. L'auteur partage de l'information et son parcours ; il ne fait pas de conseil en orientation. Site indépendant, créé à titre personnel : ce n'est pas un site officiel de l'École Cube. Les liens vers l'École Cube sont des liens partenaires signalés.",
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
        lines.push(
          "## À propos",
          "",
          `- [Qui écrit ce guide](${absUrl("/a-propos")})`,
          `- [Simulateur ROI de l'automatisation](${absUrl("/simulateur-roi")})`,
          `- [Ce que j'ai construit : études de cas no-code et IA](${absUrl("/realisations")})`,
          `- [Audit SEO, AEO et GEO de votre site, fait par l'auteur](${absUrl("/audit-seo")})`,
          `- [Skill Claude « Être trouvé sur Google et ChatGPT » (SEO / AEO / GEO), utilisé pour écrire et auditer ce guide](${absUrl("/skill-seo-aeo-geo")})`,
          "",
        );
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
