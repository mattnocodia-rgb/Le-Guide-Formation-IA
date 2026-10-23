import { Link, rootRouteId, useLoaderData } from "@tanstack/react-router";
import type React from "react";

import type { PartnerLink } from "@/lib/content.functions";
import { CATEGORIES, NAV_CATEGORIES, SITE_NAME } from "@/lib/site";

export function SiteHeader({
  ressources,
  activeSlug,
}: {
  ressources: PartnerLink | null;
  activeSlug?: string | undefined;
}) {
  return (
    <header className="container-wide flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-5">
      <Link
        to="/"
        className="font-serif text-[22px] font-extrabold tracking-[-0.01em] text-ink no-underline"
      >
        {SITE_NAME}
      </Link>
      <nav aria-label="Catégories" className="flex flex-wrap gap-x-6 text-[15px] font-medium">
        {NAV_CATEGORIES.map((c) => {
          const active = c.slug === activeSlug;
          return (
            <Link
              key={c.slug}
              to="/categorie/$slug"
              params={{ slug: c.slug }}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "py-2.5 font-semibold text-ink underline decoration-accent decoration-[3px] underline-offset-8"
                  : "py-2.5 text-ink-soft no-underline hover:text-ink"
              }
            >
              {c.short}
            </Link>
          );
        })}
        {ressources ? (
          <a
            href={ressources.url}
            rel="sponsored noopener"
            target="_blank"
            className="py-2.5 font-semibold text-accent-ink no-underline"
          >
            Masterclass gratuites ↗
          </a>
        ) : null}
      </nav>
    </header>
  );
}

export function SiteFooter({
  ressources,
  rdv,
  communaute = null,
}: {
  ressources: PartnerLink | null;
  rdv: PartnerLink | null;
  communaute?: PartnerLink | null;
}) {
  return (
    <footer className="bg-ink text-[#d8d1c2]">
      <div className="container-wide flex flex-col gap-10 py-12 text-sm">
        <div className="flex flex-wrap justify-between gap-8">
          <div className="flex max-w-md flex-col gap-2">
            <span className="font-serif text-lg font-extrabold text-paper">{SITE_NAME}</span>
            <span className="leading-relaxed">
              Site indépendant, créé à titre personnel : ce n'est pas un site officiel de l'École
              Cube. Il contient des liens partenaires vers l'école, signalés dans chaque article.
            </span>
          </div>
          <nav aria-label="Catégories (pied de page)" className="flex flex-col gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/categorie/$slug"
                params={{ slug: c.slug }}
                className="text-[#d8d1c2] no-underline hover:text-paper"
              >
                {c.name}
              </Link>
            ))}
          </nav>
          <nav aria-label="Pied de page" className="flex flex-col gap-2">
            <Link to="/a-propos" className="text-[#d8d1c2] no-underline hover:text-paper">
              À propos
            </Link>
            <Link to="/mentions-legales" className="text-[#d8d1c2] no-underline hover:text-paper">
              Mentions légales
            </Link>
            {ressources ? (
              <a
                href={ressources.url}
                rel="sponsored noopener"
                target="_blank"
                className="text-[#f1a08f]"
              >
                Masterclass gratuites
              </a>
            ) : null}
            {rdv ? (
              <a href={rdv.url} rel="sponsored noopener" target="_blank" className="text-[#f1a08f]">
                Parler à un conseiller Cube
              </a>
            ) : null}
            {communaute ? (
              <a
                href={communaute.url}
                rel="sponsored noopener"
                target="_blank"
                className="text-[#f1a08f]"
              >
                Communauté Cube (ouverte à tous)
              </a>
            ) : null}
          </nav>
        </div>
        <p className="text-xs text-[#b7af9f]">Liens partenaires signalés · Aucun cookie de suivi</p>
      </div>
    </footer>
  );
}

/** Page frame shared by every route: header, content, footer. Partner links come from the root loader. */
export function PageFrame({
  children,
  activeSlug,
}: {
  children: React.ReactNode;
  activeSlug?: string | undefined;
}) {
  const layout = useLoaderData({ from: rootRouteId }) as
    | { ressources: PartnerLink | null; rdv: PartnerLink | null; communaute?: PartnerLink | null }
    | undefined;
  const ressources = layout?.ressources ?? null;
  const rdv = layout?.rdv ?? null;
  const communaute = layout?.communaute ?? null;
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader ressources={ressources} activeSlug={activeSlug} />
      <main className="flex-1">{children}</main>
      <SiteFooter ressources={ressources} rdv={rdv} communaute={communaute} />
    </div>
  );
}
