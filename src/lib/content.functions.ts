import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { CubeLink } from "./airtable.server";
import { goPath } from "./track";

export type ArticleSummary = {
  title: string;
  slug: string;
  category: string;
  categorySlug: string | null;
  excerpt: string;
  publishedAt: string | null;
  updatedAt: string | null;
  readingMinutes: number;
};

export type PartnerLink = { url: string; label: string; type: string };

export type ProgrammeCard = { url: string; title: string; description: string; theme: string };

/** Display order and one-line description of each programme theme (the "marque" link is left out on purpose). */
const PROGRAMME_THEMES: { theme: string; description: string }[] = [
  {
    theme: "ia",
    description: "IA générative, gestion de projet IA : intégrer l'IA dans son métier.",
  },
  {
    theme: "automatisation",
    description: "Make, n8n, agents IA : automatiser des tâches et des processus.",
  },
  {
    theme: "dev-ia",
    description: "Créer des applications web avec l'IA, du prototype à la mise en ligne.",
  },
  { theme: "seo-geo", description: "Être trouvé sur Google et cité par les IA." },
  { theme: "growth", description: "Piloter l'acquisition et le marketing avec l'IA." },
  { theme: "acquisition", description: "La publicité en ligne, assistée par l'IA." },
  {
    theme: "general",
    description: "Le catalogue complet, dont le parcours métier Product Builder (RNCP niveau 6).",
  },
];

export type RecoCard = PartnerLink & {
  tag: string;
  title: string;
  description: string;
  cta: string;
};

function toSummary(a: ArticleSummary): ArticleSummary {
  return {
    title: a.title,
    slug: a.slug,
    category: a.category,
    categorySlug: a.categorySlug,
    excerpt: a.excerpt,
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    readingMinutes: a.readingMinutes,
  };
}

function eventTitle(label: string) {
  return label.replace(/^(é|e)v(è|e)nement\s*:\s*/i, "").trim() || "Le prochain évènement";
}

/** Button wording for a partner link, depending on what it points to. */
function ctaFor(link: CubeLink) {
  switch (link.type) {
    case "ressources":
      return "Voir les masterclass gratuites";
    case "rdv":
      return "Parler à un conseiller";
    case "communaute":
      return "Rejoindre la communauté";
    case "evenement":
      return `S'inscrire : ${eventTitle(link.label)}`;
    case "programme":
      return `Voir le programme : ${link.label}`;
    default:
      return link.label || "En savoir plus";
  }
}

function toPartner(link: CubeLink | null): PartnerLink | null {
  return link ? { url: goPath(link.id), label: ctaFor(link), type: link.type } : null;
}

/** Shared partner links used by the header, footer and side boxes. */
async function sharedLinks() {
  const { getCubeLinks, linkOfType } = await import("./airtable.server");
  const links = await getCubeLinks();
  return {
    links,
    ressources: toPartner(linkOfType(links, "ressources")),
    rdv: toPartner(linkOfType(links, "rdv")),
    communaute: toPartner(linkOfType(links, "communaute")),
  };
}

export const getLayoutData = createServerFn({ method: "GET" }).handler(async () => {
  const { ressources, rdv, communaute } = await sharedLinks();
  return { ressources, rdv, communaute };
});

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublishedArticles, getCarnet, getParcours, linkOfType } =
    await import("./airtable.server");
  const { formatDateFr, START_GUIDE_SLUG } = await import("./site");
  const [{ links }, articles, carnet, parcours] = await Promise.all([
    sharedLinks(),
    getPublishedArticles(),
    getCarnet(3),
    getParcours(),
  ]);

  const reco: RecoCard[] = [];
  const ressources = linkOfType(links, "ressources");
  if (ressources)
    reco.push({
      ...toPartner(ressources)!,
      tag: "gratuit · en replay",
      title: "Les masterclass Cube",
      description: "Vibe coding, audit IA, AI Act, Claude Code… en replay.",
      cta: "Voir les masterclass",
    });
  const evenement = linkOfType(links, "evenement");
  if (evenement)
    reco.push({
      ...toPartner(evenement)!,
      tag: evenement.expires ? `en direct · ${formatDateFr(evenement.expires)}` : "en direct",
      title: eventTitle(evenement.label),
      description: "Le prochain évènement en ligne de l'école.",
      cta: "S'inscrire",
    });
  const rdv = linkOfType(links, "rdv");
  if (rdv)
    reco.push({
      ...toPartner(rdv)!,
      tag: "gratuit · 30 min",
      title: "Parler à un conseiller",
      description: "Pour savoir quelle formation correspond à votre projet et comment la financer.",
      cta: "Prendre rendez-vous",
    });
  const communaute = linkOfType(links, "communaute");
  if (communaute)
    reco.push({
      ...toPartner(communaute)!,
      tag: "ouverte à tous",
      title: "Rejoindre la communauté",
      description:
        "Pas besoin d'avoir suivi une formation : échangez avec des apprenants et des alumni.",
      cta: "Rejoindre",
    });

  const { isLinkValid } = await import("./airtable.server");
  const programmes: ProgrammeCard[] = PROGRAMME_THEMES.flatMap(({ theme, description }) => {
    const l = links.find((x) => x.type === "programme" && x.theme === theme && isLinkValid(x));
    return l ? [{ url: goPath(l.id), title: l.label, description, theme }] : [];
  });

  const startGuide =
    articles.find((a) => a.slug === START_GUIDE_SLUG)?.slug ?? articles[0]?.slug ?? null;

  return {
    programmes,
    startGuide,
    articles: articles.slice(0, 6).map(toSummary),
    totalArticles: articles.length,
    carnet,
    reco,
    photoUrl: parcours["photo_url"] ?? null,
  };
});

export const getCategoryData = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ slug: z.string().min(1).max(100) }).parse(d))
  .handler(async ({ data }) => {
    const { getPublishedArticles } = await import("./airtable.server");
    const [{ ressources }, all] = await Promise.all([sharedLinks(), getPublishedArticles()]);
    return {
      articles: all.filter((a) => a.categorySlug === data.slug).map(toSummary),
      ressources,
    };
  });

export const getArticle = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { getPublishedArticles, getParcours, resolveArticleLinks } =
      await import("./airtable.server");
    const { renderMarkdown, parseFaq, applyParcours } = await import("./markdown.server");
    const [{ links, ressources, rdv }, all, parcours] = await Promise.all([
      sharedLinks(),
      getPublishedArticles(),
      getParcours(),
    ]);
    const article = all.find((a) => a.slug === data.slug);
    if (!article) return null;

    const resolved = resolveArticleLinks(article, links);
    const cube = {
      principal: resolved.principal ? `${goPath(resolved.principal.id)}?e=article` : null,
      secondaire: resolved.secondaire ? `${goPath(resolved.secondaire.id)}?e=article` : null,
    };
    const body = renderMarkdown(applyParcours(article.content, parcours), cube);
    const dansMonCas = applyParcours(article.dansMonCas, parcours);
    const sameCategory = all.filter(
      (a) => a.slug !== article.slug && a.category === article.category,
    );
    const others = all.filter((a) => a.slug !== article.slug && a.category !== article.category);

    return {
      ...toSummary(article),
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      masterclass: article.masterclass,
      html: body.html,
      toc: body.toc,
      faq: parseFaq(applyParcours(article.faq, parcours), cube),
      sourcesHtml: article.sources ? renderMarkdown(article.sources, cube).html : "",
      dansMonCasHtml: dansMonCas ? renderMarkdown(dansMonCas, cube).html : "",
      principal: toPartner(resolved.principal),
      secondaire:
        resolved.secondaire && resolved.secondaire.id !== resolved.principal?.id
          ? toPartner(resolved.secondaire)
          : null,
      ressources,
      rdv,
      authorName: parcours["auteur_nom"] ?? null,
      related: [...sameCategory, ...others].slice(0, 3).map(toSummary),
    };
  });
