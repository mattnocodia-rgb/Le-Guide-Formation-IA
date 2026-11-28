import { Link, createFileRoute } from "@tanstack/react-router";
import type React from "react";

import { ShortOverlay } from "@/components/short-overlay";
import { PageFrame } from "@/components/site/SiteChrome";
import {
  type PartnerLink,
  type RealisationCard,
  getRealisationsData,
} from "@/lib/content.functions";
import { SITE_NAME, pageHead } from "@/lib/site";
import { track } from "@/lib/track";

const TITLE = `Ce que j'ai construit : projets no-code et IA — ${SITE_NAME}`;
const DESCRIPTION =
  "Applications, sites web, audits et automatisations : découvrez mes réalisations, confiez-moi votre projet ou formez-vous avec l’École Cube pour le faire vous-même.";

export const Route = createFileRoute("/realisations")({
  head: () => pageHead({ title: TITLE, description: DESCRIPTION, path: "/realisations" }),
  loader: () => getRealisationsData(),
  component: Realisations,
});

function Bloc({ label, text }: { label: string; text: string }) {
  if (!text) return null;
  return (
    <div className="mt-4">
      <p className="m-0 text-[13px] font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="m-0 mt-1 whitespace-pre-line text-[17px] leading-relaxed">{text}</p>
    </div>
  );
}

const GROUPES = [
  {
    id: "en-entreprise",
    contexte: "En entreprise",
    title: "En entreprise",
    note: "dans mon poste de responsable commercial",
    intro:
      "Des automatisations et des outils construits pour mon équipe commerciale et nos clients, utilisés au quotidien.",
  },
  {
    id: "projets-personnels",
    contexte: "Projet personnel",
    title: "Mes projets",
    note: "pour moi et mes projets",
    intro: "Les outils qui font tourner ce guide, Endo-sérénité et ma propre activité.",
  },
] as const;

function Carte({ r, lienSurImage = false }: { r: RealisationCard; lienSurImage?: boolean }) {
  // When the illustration beside the card is clickable, it replaces the "Voir le projet" button.
  const lien = lienSurImage ? null : r.lien;
  return (
    <article className="sheet relative isolate flex flex-col overflow-hidden">
      {r.image && (
        <img
          src={`/img/realisations/${r.image}`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute -right-6 -bottom-6 -z-10 h-[78%] w-[58%] object-contain object-right-bottom opacity-[0.13] select-none"
        />
      )}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="m-0 text-[clamp(22px,2.4vw,27px)] leading-tight">{r.projet}</h3>
        {r.outils.length > 0 && (
          <ul aria-label="Outils utilisés" className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
            {r.outils.map((o) => (
              <li
                key={o}
                className="rounded-full border border-rule px-3 py-0.5 text-[14px] text-ink-soft"
              >
                {o}
              </li>
            ))}
          </ul>
        )}
        <Bloc label="Le problème" text={r.probleme} />
        <Bloc label="Ce que j'ai construit" text={r.construit} />
        <Bloc label="Le résultat" text={r.resultat} />
        <Bloc label="Ce que la formation m'a apporté" text={r.formation} />
        <p className="m-0 mt-auto flex flex-wrap gap-3 pt-5">
          {r.payant && (
            <a
              href={r.payant.url}
              rel={r.payant.url.startsWith("/") ? undefined : "noopener"}
              className="btn-ink text-[15px]"
            >
              {r.payant.label}
            </a>
          )}
          {!r.payant && (
            <Link to="/contact" className="btn-ink text-[15px]">
              Un besoin similaire ? En discuter
            </Link>
          )}
          {lien && (
            <a href={lien} target="_blank" rel="noopener" className="btn-outline text-[15px]">
              Voir le projet
            </a>
          )}
          {r.cube.map((c) => (
            <a
              key={c.url}
              href={track(c.url, "realisations")}
              rel="sponsored noopener"
              title={`École Cube : ${c.label}`}
              className="btn-outline text-[15px]"
            >
              {c.cta.startsWith("La masterclass") ? c.cta : "Apprendre à le faire avec Cube ↗"}
            </a>
          ))}
        </p>
      </div>
    </article>
  );
}

function Illustration({ r }: { r: RealisationCard }) {
  return (
    <img
      src={`/img/realisations/${r.illustration}`}
      alt={`Capture d'écran du projet « ${r.projet} »`}
      loading="lazy"
      decoding="async"
      className="block max-h-[520px] w-full bg-paper object-contain"
    />
  );
}

/** Silent square animation shown beside a card that has no screenshot (attachment "Vidéo"). */
function VideoCarree({ r, imageFirst }: { r: RealisationCard; imageFirst: boolean }) {
  return (
    <figure
      className={`tilt mx-1 my-0 sm:mx-0 ${imageFirst ? "lg:order-1" : ""}`}
      style={{ "--r": imageFirst ? "-1deg" : "1deg" } as React.CSSProperties}
    >
      <div className="sheet relative mx-auto max-w-[520px] p-2.5">
        <div
          aria-hidden="true"
          className={`tape tape-yellow top-[-10px] ${imageFirst ? "right-8 rotate-3" : "left-8 -rotate-3"}`}
        />
        <video
          src={r.video ?? undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={`Animation du projet « ${r.projet} »`}
          className="block aspect-square w-full bg-paper object-contain"
        />
      </div>
    </figure>
  );
}

/** One project per row: the card on one side, its screenshot or video on the other, alternating. */
function LigneProjet({ r, index }: { r: RealisationCard; index: number }) {
  const imageFirst = index % 2 === 1;
  if (!r.illustration) {
    if (!r.video) return <Carte r={r} />;
    return (
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">
        <div className={imageFirst ? "lg:order-2" : undefined}>
          <Carte r={r} />
        </div>
        <VideoCarree r={r} imageFirst={imageFirst} />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">
      <div className={imageFirst ? "lg:order-2" : undefined}>
        <Carte r={r} lienSurImage={!!r.lien} />
      </div>
      <figure
        className={`tilt mx-1 my-0 sm:mx-0 ${imageFirst ? "lg:order-1" : ""}`}
        style={{ "--r": imageFirst ? "-1deg" : "1deg" } as React.CSSProperties}
      >
        <div className="sheet relative p-2.5">
          <div
            aria-hidden="true"
            className={`tape tape-yellow top-[-10px] ${imageFirst ? "right-8 rotate-3" : "left-8 -rotate-3"}`}
          />
          {r.lien ? (
            <a
              href={r.lien}
              target="_blank"
              rel="noopener"
              title={`Voir le projet « ${r.projet} »`}
              className="group block"
            >
              <Illustration r={r} />
              <span className="absolute right-4 bottom-4 rounded-full bg-ink px-3 py-1 text-[14px] font-semibold text-paper shadow-[var(--shadow-card)] transition-transform group-hover:-translate-y-0.5">
                Voir le projet →
              </span>
            </a>
          ) : (
            <Illustration r={r} />
          )}
          {r.video && <ShortOverlay src={r.video} projet={r.projet} left={imageFirst} />}
        </div>
      </figure>
    </div>
  );
}

/** Same two choices before and after the project evidence; partner destinations stay in Airtable. */
function ProjectChoices({
  formations,
  rdv,
  closing = false,
}: {
  formations: Pick<PartnerLink, "url" | "label"> | null;
  rdv: PartnerLink | null;
  closing?: boolean;
}) {
  return (
    <section
      aria-label={closing ? "Votre prochaine étape" : "Choisir votre parcours"}
      className={`container-wide ${closing ? "pt-16 pb-10" : "pt-8"}`}
    >
      {closing && <h2 className="m-0 mb-6 text-[30px]">Et pour votre projet ?</h2>}
      <div className="grid grid-cols-1 gap-8 border-y border-rule py-7 md:grid-cols-2 md:gap-12">
        <div>
          <p className="note m-0 text-[24px]">je le réalise pour vous</p>
          <h2 className="m-0 mt-2 text-[27px] leading-tight">Me confier votre projet</h2>
          <p className="m-0 mt-3 text-[17px] leading-relaxed text-ink-soft">
            Une application pour votre activité, un site web, un audit ou une automatisation :
            parlons de votre besoin et de ce que je peux construire pour vous.
          </p>
          <ul className="m-0 mt-4 grid list-none gap-2 p-0 text-[16px] font-semibold">
            <li>
              <Link to="/automatisation">Automatisation Make / n8n →</Link>
            </li>
            <li>
              <Link to="/creation-site-web">Création de site web →</Link>
            </li>
            <li>
              <Link to="/audit-seo">Audit SEO et visibilité IA →</Link>
            </li>
            <li>
              <Link to="/contact" search={{ besoin: "autre" }}>
                Application ou outil sur mesure →
              </Link>
            </li>
          </ul>
          <Link to="/contact" className="btn-ink mt-5 text-[15px]">
            Me parler de votre projet
          </Link>
        </div>
        <div className="border-t border-rule pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-10">
          <p className="note m-0 text-[24px]">vous apprenez à le faire</p>
          <h2 className="m-0 mt-2 text-[27px] leading-tight">Le faire vous-même</h2>
          <p className="m-0 mt-3 text-[17px] leading-relaxed text-ink-soft">
            Vous voulez apprendre à créer vos applications, sites ou automatisations ? Découvrez les
            formations no-code et IA de l'École Cube, puis échangez avec l'école pour trouver le
            parcours qui vous correspond.
          </p>
          <ul className="m-0 mt-4 grid list-none gap-2 p-0 text-[16px] font-semibold">
            <li>
              <Link to="/$slug" params={{ slug: "bootcamp-product-builder-retour-experience" }}>
                Mon avis sur l'École Cube →
              </Link>
            </li>
          </ul>
          <div className="mt-5 flex flex-col items-start gap-3">
            {formations && (
              <a
                href={track(formations.url, "realisations")}
                rel="sponsored noopener"
                className="btn-ink text-[15px]"
              >
                Découvrir les formations de l'École Cube ↗
              </a>
            )}
            {rdv && (
              <a
                href={track(rdv.url, "realisations")}
                rel="sponsored noopener"
                className="btn-outline text-[15px]"
              >
                Parler à un conseiller Cube ↗
              </a>
            )}
          </div>
          <p className="m-0 mt-4 text-sm leading-relaxed text-ink-soft">
            Liens partenaires : je peux percevoir une commission si vous vous inscrivez via ces
            liens. Mes prestations sont indépendantes de l'École Cube.
          </p>
        </div>
      </div>
    </section>
  );
}

function Realisations() {
  const { items, rdv, formations } = Route.useLoaderData();
  const groups = GROUPES.map((g) => ({
    ...g,
    items: items.filter((r) => r.contexte === g.contexte),
  })).filter((g) => g.items.length > 0);

  return (
    <PageFrame>
      <section className="container-wide max-w-[780px] pt-12 md:pt-16">
        <p className="note m-0 -rotate-2 text-[28px]">mes projets</p>
        <h1 className="mt-3 mb-6 text-[clamp(36px,5vw,56px)] leading-[1.05]">
          Ce que j'ai construit
        </h1>
        <div className="prose-article">
          <p>
            Applications sur mesure, automatisations métier et sites web : découvrez mes projets
            récents conçus avec le no-code et l'IA.
          </p>
        </div>
      </section>

      <ProjectChoices formations={formations} rdv={rdv} />

      {items.length === 0 ? (
        <section className="container-wide max-w-[780px] pt-10">
          <p className="text-[17px] text-ink-soft">Les études de cas arrivent très bientôt.</p>
        </section>
      ) : (
        <>
          <nav
            aria-label="Types de projets"
            className="container-wide max-w-[780px] pt-6 text-[15px] font-medium"
          >
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {groups.map((g) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    className="inline-block rounded-full border border-ink/20 px-4 py-1.5 text-ink no-underline hover:border-ink"
                  >
                    {g.title} <span className="text-ink-soft">({g.items.length})</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {groups.map((g) => (
            <section
              key={g.id}
              id={g.id}
              aria-labelledby={`${g.id}-titre`}
              className="container-wide scroll-mt-24 pt-14"
            >
              <div className="max-w-[780px]">
                <p className="note m-0 -rotate-1 text-[24px]">{g.note}</p>
                <h2 id={`${g.id}-titre`} className="m-0 mt-1 text-[clamp(28px,3.2vw,38px)]">
                  {g.title}
                </h2>
                <p className="m-0 mt-2 text-[17px] leading-relaxed text-ink-soft">{g.intro}</p>
              </div>
              <div className="mt-8 flex flex-col gap-12 lg:gap-16">
                {g.items.map((r, i) => (
                  <LigneProjet key={r.id} r={r} index={i} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}

      <ProjectChoices formations={formations} rdv={rdv} closing />
      <section aria-labelledby="outils-disponibles" className="container-wide pb-16">
        <p className="note m-0 text-[23px]">mes outils à télécharger</p>
        <h2 id="outils-disponibles" className="m-0 mt-2 text-[27px]">
          Un besoin précis, sans suivre une formation ?
        </h2>
        <p className="m-0 mt-3 text-[17px] text-ink-soft">
          Mes skills et tutoriels restent disponibles séparément des formations Cube.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link to="/skill-seo-aeo-geo" className="btn-outline text-[15px]">
            Skill Claude : articles et audit SEO / AEO / GEO →
          </Link>
          <Link to="/tuto-shorts" className="btn-outline text-[15px]">
            Skill et tutoriel : créer des shorts →
          </Link>
          <Link to="/simulateur-roi" className="py-3 font-semibold">
            Estimer mes gains d'automatisation →
          </Link>
        </div>
      </section>
    </PageFrame>
  );
}
