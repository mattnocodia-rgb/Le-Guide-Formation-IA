import { Link, createFileRoute } from "@tanstack/react-router";
import type { CSSProperties } from "react";

import { PageFrame } from "@/components/site/SiteChrome";
import { PRODUCTS, type Product } from "@/lib/boutique";
import { getShopOffers } from "@/lib/content.functions";
import { SITE_NAME, pageHead, tiltFor } from "@/lib/site";

const PATH = "/boutique";
const r = (deg: string) => ({ "--r": deg }) as CSSProperties;

export const Route = createFileRoute("/boutique")({
  // Skill and audit prices live in Airtable ("Mon parcours"), like on their sales pages.
  loader: () => getShopOffers(),
  head: () =>
    pageHead({
      title: `Boutique : audit, skills Claude et accompagnement — ${SITE_NAME}`,
      description:
        "Un audit de votre site pour Google et ChatGPT, les skills Claude que j'utilise pour ce guide, et un accompagnement pour automatiser ou créer votre site.",
      path: PATH,
    }),
  component: BoutiquePage,
});

function BoutiquePage() {
  const offers = Route.useLoaderData();
  return (
    <PageFrame>
      <section className="container-wide max-w-[880px] pt-12 md:pt-16">
        <p className="note m-0 -rotate-2 text-[28px]">les outils derrière ce guide</p>
        <h1 className="mt-3 mb-6 text-[clamp(36px,5vw,58px)] leading-[1.05]">Boutique</h1>
        <p className="m-0 max-w-[680px] text-xl leading-relaxed text-ink-soft">
          Faites vérifier votre site, faites-le vous-même avec les outils que j'utilise pour ce
          guide, ou confiez-moi une automatisation ou votre site web.
        </p>
      </section>

      <section aria-label="Produits" className="container-wide pt-12 pb-24">
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 p-0">
          {PRODUCTS.map((p, i) => (
            <li key={p.id}>
              <ProductCard
                product={p}
                price={
                  p.id === "skill-seo-aeo-geo"
                    ? (offers.skill.price ?? p.price)
                    : p.id === "audit-seo"
                      ? (offers.audit.price ?? p.price)
                      : p.id === "tuto-shorts"
                        ? (offers.shorts.price ?? p.price)
                        : p.price
                }
                tilt={tiltFor(i + 1)}
              />
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-[680px] text-sm text-muted-foreground">
          Produits personnels de Matthieu, product builder à Nantes, sans lien avec l'École Cube.
          Paiement sécurisé par Stripe · <Link to="/conditions-de-vente">conditions de vente</Link>
        </p>
      </section>
    </PageFrame>
  );
}

function ProductCard({
  product,
  price,
  tilt,
}: {
  product: Product;
  price: string | null | undefined;
  tilt: string;
}) {
  const available = product.status === "disponible";
  const path = available ? product.path : undefined;
  const contact = available && !path && product.contactNeed ? product.contactNeed : null;
  return (
    <article
      className={`tilt flex h-full flex-col gap-3 p-6 text-ink shadow-[var(--shadow-card)] ${available ? "sheet" : "postit opacity-90"}`}
      style={r(tilt)}
    >
      <span className="font-hand text-[22px] font-semibold opacity-85">{product.kicker}</span>
      <h2 className="m-0 font-serif text-[23px] leading-[1.15] font-extrabold">{product.title}</h2>
      <p className="m-0 text-[15px] leading-normal text-ink-soft">{product.promise}</p>
      <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-sm text-ink-soft">
        {product.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
        {path ? (
          <Link to={path} className="btn-ink text-[15px]">
            Découvrir{price ? ` — ${price}` : ""}
          </Link>
        ) : contact ? (
          <Link to="/contact" search={{ besoin: contact }} className="btn-ink text-[15px]">
            Me contacter
          </Link>
        ) : (
          <span className="text-[15px] font-bold text-accent-ink">
            Bientôt disponible{price ? ` · ${price}` : ""}
          </span>
        )}
      </div>
      {product.links?.length ? (
        <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[14.5px]">
          {product.links.map((l) => (
            <li key={l.label}>
              <Link to={l.to} {...(l.hash ? { hash: l.hash } : {})} className="font-semibold">
                {l.label} →
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
