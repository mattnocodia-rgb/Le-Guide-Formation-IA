import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { track } from "@/lib/track";
import type React from "react";

import { ArticleCard } from "@/components/site/Cards";
import { PageFrame } from "@/components/site/SiteChrome";
import { getCategoryData } from "@/lib/content.functions";
import {
  CATEGORIES,
  SITE_NAME,
  absUrl,
  categoryBySlug,
  jsonLdScript,
  ogImageFor,
  pageHead,
} from "@/lib/site";

export const Route = createFileRoute("/categorie/$slug")({
  loader: async ({ params }) => {
    const category = categoryBySlug(params.slug);
    if (!category) throw notFound();
    const data = await getCategoryData({ data: { slug: category.slug } });
    return { ...data, slug: category.slug };
  },
  head: ({ loaderData }) => {
    const category = loaderData ? categoryBySlug(loaderData.slug) : undefined;
    if (!category)
      return {
        meta: [
          { title: `Page introuvable — ${SITE_NAME}` },
          { name: "robots", content: "noindex" },
        ],
      };
    const path = `/categorie/${category.slug}`;
    return {
      ...pageHead({
        title: `${category.name} : les guides — ${SITE_NAME}`,
        description: category.description,
        path,
        image: ogImageFor(category.slug),
      }),
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: absUrl("/") },
            { "@type": "ListItem", position: 2, name: category.name, item: absUrl(path) },
          ],
        }),
      ],
    };
  },
  component: CategoryPage,
});

const r = (deg: string) => ({ "--r": deg }) as React.CSSProperties;

function CategoryPage() {
  const { articles, ressources, slug } = Route.useLoaderData();
  const category = categoryBySlug(slug)!;
  const index = CATEGORIES.findIndex((c) => c.slug === slug);

  return (
    <PageFrame activeSlug={slug}>
      <section className="container-wide flex flex-col gap-4 pt-2 pb-12">
        <nav aria-label="Fil d'Ariane" className="flex gap-2 text-sm text-muted-foreground">
          <Link to="/" className="text-muted-foreground">
            Accueil
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-ink">{category.name}</span>
        </nav>
        <p className="note settle m-0 mt-5 self-start text-[28px]" style={r("-2deg")}>
          catégorie n° {index + 1}
        </p>
        <h1 className="settle delay-1 m-0 text-[clamp(40px,5.4vw,64px)] leading-[1.02] tracking-[-0.03em]">
          {category.name}
        </h1>
        <p className="settle delay-2 m-0 max-w-[680px] text-xl leading-relaxed text-ink-soft">
          {category.description}
        </p>
        <p className="m-0 text-sm text-muted-foreground">
          {articles.length === 0
            ? "Aucun guide pour l'instant"
            : `${articles.length} guide${articles.length > 1 ? "s" : ""} dans cette catégorie`}
        </p>
      </section>

      {ressources ? (
        <section aria-label="Recommandation" className="container-wide pb-12">
          <a
            href={track(ressources.url, "categorie")}
            rel="sponsored noopener"
            target="_blank"
            className="tilt flex flex-wrap items-center justify-between gap-4 bg-ink px-7 py-6 text-paper no-underline shadow-[var(--shadow-card)]"
            style={r("-0.6deg")}
          >
            <span className="flex flex-col gap-1">
              <span className="font-hand text-[26px] font-semibold text-[#f1a08f]">
                Mon conseil pour démarrer
              </span>
              <span className="font-serif text-[22px] font-extrabold">
                Les masterclass gratuites de l'École Cube
              </span>
            </span>
            <span className="flex flex-col items-end gap-1">
              <span className="btn-paper min-h-[46px] text-sm">Voir les replays ↗</span>
              <span className="text-[11px] text-[#b7af9f]">Lien partenaire</span>
            </span>
          </a>
        </section>
      ) : null}

      <section aria-label="Articles" className="container-wide pb-24">
        {articles.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {articles.map((a, i) => (
              <ArticleCard
                key={a.slug}
                article={a}
                index={i}
                showCategory={false}
                headingLevel={2}
              />
            ))}
          </div>
        ) : (
          <div className="postit tilt max-w-xl p-6" style={r("-1deg")}>
            <p className="note m-0 text-[26px] text-ink">
              Les guides de cette catégorie arrivent bientôt.
            </p>
          </div>
        )}
      </section>
    </PageFrame>
  );
}
