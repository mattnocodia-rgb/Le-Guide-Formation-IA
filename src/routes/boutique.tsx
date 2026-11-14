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
  const priceOf = (p: Product) =>
    p.id === "skill-seo-aeo-geo"
      ? (offers.skill.price ?? p.price)
      : p.id === "audit-seo"
        ? (offers.audit.price ?? p.price)
        : p.id === "tuto-shorts"
          ? (offers.shorts.price ?? p.price)
          : p.price;
  return (
    <PageFrame>
      <section className="container-wide max-w-[880px] pt-12 md:pt-16">
        <p className="note m-0 -rotate-2 text-[28px]">les outils derrière ce guide</p>
        <h1 className="mt-3 mb-6 text-[clamp(36px,5vw,58px)] leading-[1.05]">
          Outils, tutoriels et services pour votre site et vos automatisations
        </h1>
        <p className="m-0 max-w-[680px] text-xl leading-relaxed text-ink-soft">
          Faites vérifier votre site, faites-le vous-même avec les outils que j'utilise pour ce
          guide, ou confiez-moi une automatisation ou votre site web.
        </p>
      </section>

      <ProductGroup
        id="avec-moi"
        kicker="accompagnement"
        title="Je m'en occupe avec vous"
        intro="Un audit de votre site, une automatisation ou un site web : on en parle d'abord, puis je le réalise pour vous, avec un vrai échange en visio."
        products={PRODUCTS.filter((p) => p.kind === "service")}
        priceOf={priceOf}
      />
      <ProductGroup
        id="vous-meme"
        kicker="skill + tuto"
        title="À faire vous-même, tout de suite"
        intro="Un skill Claude et son tuto pas à pas, achetés une fois et téléchargés juste après le paiement, sans abonnement."
        products={PRODUCTS.filter((p) => p.kind === "diy")}
        priceOf={priceOf}
      />
      <section className="container-wide pb-24">
        <p className="mt-2 max-w-[680px] text-sm text-muted-foreground">
          Produits et services de Matthieu Audineau, product builder à Nantes, sans lien avec
          l'École Cube. Paiement sécurisé par Stripe ·{" "}
          <Link to="/conditions-de-vente">conditions de vente</Link>
        </p>
      </section>
    </PageFrame>
  );
}

function ProductGroup({
  id,
  kicker,
  title,
  intro,
  products,
  priceOf,
}: {
  id: string;
  kicker: string;
  title: string;
  intro: string;
  products: Product[];
  priceOf: (p: Product) => string | null | undefined;
}) {
  return (
    <section aria-labelledby={id} className="container-wide pt-14">
      <p className="note m-0 -rotate-1 text-[24px]">{kicker}</p>
      <h2 id={id} className="m-0 mt-1 text-[clamp(28px,3.2vw,38px)] leading-[1.1]">
        {title}
      </h2>
      <p className="m-0 mt-3 max-w-[680px] text-[17px] leading-relaxed text-ink-soft">{intro}</p>
      <ul className="m-0 mt-8 grid list-none grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 p-0">
        {products.map((p, i) => (
          <li key={p.id}>
            <ProductCard product={p} price={priceOf(p)} tilt={tiltFor(i + 1)} />
          </li>
        ))}
      </ul>
    </section>
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
  const service = product.kind === "service";
  return (
    <article
      className={`tilt relative flex h-full flex-col gap-3 p-6 text-ink shadow-[var(--shadow-card)] ${service ? "postit" : "sheet"} ${available ? "" : "opacity-90"}`}
      style={r(tilt)}
    >
      {service ? (
        <span aria-hidden="true" className="tape -top-2.5 left-8" style={r("-4deg")} />
      ) : null}
      <span
        className={`self-start rounded-full px-2.5 py-0.5 text-[12.5px] font-bold tracking-wide uppercase ${service ? "bg-ink text-paper" : "border border-ink/30 text-ink-soft"}`}
      >
        {service ? "Avec Matthieu" : "Téléchargement"}
      </span>
      <span className="font-hand text-[22px] font-semibold opacity-85">{product.kicker}</span>
      <h3 className="m-0 font-serif text-[23px] leading-[1.15] font-extrabold">{product.title}</h3>
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
        {product.secondary ? (
          <Link to={product.secondary.to} className="btn-outline text-[15px]">
            {product.secondary.label}
          </Link>
        ) : null}
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
