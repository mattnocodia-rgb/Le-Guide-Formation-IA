import { createFileRoute, Link } from "@tanstack/react-router";
import { track } from "@/lib/track";
import type React from "react";

import { ArticleCard, LinkedInIcon } from "@/components/site/Cards";
import { PageFrame } from "@/components/site/SiteChrome";
import { getHomeData } from "@/lib/content.functions";
import {
  CATEGORIES,
  LINKEDIN_URL,
  ORGANIZATION_LD,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_PROMISE,
  SITE_URL,
  formatDateShort,
  jsonLdScript,
  pageHead,
  tiltFor,
} from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: () => getHomeData(),
  head: () => ({
    ...pageHead({
      title: `${SITE_NAME} — ${SITE_PROMISE}`,
      description: SITE_DESCRIPTION,
      path: "/",
    }),
    scripts: [
      jsonLdScript({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "fr-FR",
        description: SITE_DESCRIPTION,
        publisher: ORGANIZATION_LD,
      }),
    ],
  }),
  component: Home,
});

const r = (deg: string) => ({ "--r": deg }) as React.CSSProperties;

function Home() {
  const { articles, carnet, reco, programmes, photoUrl, totalArticles, startGuide } =
    Route.useLoaderData();

  return (
    <PageFrame>
      {/* Hero */}
      <section className="container-wide flex flex-wrap items-start gap-12 pt-8 pb-16 md:pt-10 md:pb-20">
        <div className="flex min-w-0 flex-[999_1_540px] flex-col gap-7 pt-6">
          <p className="note settle m-0 self-start text-[28px] md:text-[30px]" style={r("-2deg")}>
            Écrit par un product builder certifié
          </p>
          <h1 className="settle delay-1 m-0 text-[clamp(44px,6.2vw,80px)] leading-[1.02] tracking-[-0.03em]">
            Se former à l'IA, sans{" "}
            <span className="relative inline-block whitespace-nowrap">
              se tromper
              <svg
                aria-hidden="true"
                viewBox="0 0 420 24"
                preserveAspectRatio="none"
                className="absolute bottom-[-8px] left-0 h-4 w-full"
              >
                <path
                  className="draw"
                  d="M4 14 C 90 4, 200 22, 300 10 S 400 8, 416 12"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            de voie.
          </h1>
          <p className="settle delay-2 m-0 max-w-[560px] text-xl leading-relaxed text-ink-soft">
            Métiers, outils, financement CPF : les guides que j'aurais aimé lire avant de me former.
            Chaque chiffre est sourcé et daté.
          </p>
          <div className="settle delay-3 flex flex-wrap items-center gap-5">
            {startGuide ? (
              <Link to="/$slug" params={{ slug: startGuide }} className="btn-ink">
                Lire le guide de départ
              </Link>
            ) : null}
            <a href="#sujets" className="py-3 font-semibold">
              Explorer les sujets →
            </a>
          </div>
        </div>

        <HeroVisual photoUrl={photoUrl} />
      </section>

      {/* Qui écrit */}
      <section aria-labelledby="qui" className="border-y border-rule bg-paper-light">
        <div className="container-wide flex flex-wrap items-start gap-x-16 gap-y-10 py-16 md:py-20">
          <div className="flex flex-[1_1_340px] flex-col gap-4">
            <p className="note m-0 -rotate-2 self-start text-[26px]">qui écrit ce guide ?</p>
            <h2 id="qui" className="m-0 text-[clamp(30px,3.4vw,42px)] leading-[1.08]">
              Responsable commercial et product builder, les deux à la fois.
            </h2>
            <a
              href={LINKEDIN_URL}
              rel="noopener me"
              target="_blank"
              className="btn-outline self-start text-[15px]"
            >
              <LinkedInIcon />
              Mon profil LinkedIn
            </a>
          </div>
          <div className="flex flex-[2_1_480px] flex-col gap-4 text-lg leading-[1.7] text-[#3a362f] md:text-[19px]">
            <p className="m-0">
              Ingénieur BTP de formation et commercial expérimenté, je suis certifié Product Builder
              No-Code &amp; IA par l'École Cube (titre RNCP niveau 6). L'école m'a ouvert les portes
              d'un monde que je n'aurais jamais imaginé explorer, et m'a appris une méthode qui a
              fait de moi un expert en automatisation.
            </p>
            <p className="m-0">
              Aujourd'hui, je transforme des besoins métiers en sites web, outils internes et
              automatisations, y compris pour mon propre métier de responsable commercial. Je ne
              suis pas là pour vous orienter ni vous conseiller : je partage de l'information et mon
              parcours.{" "}
              <Link to="/a-propos" className="font-semibold text-ink underline underline-offset-4">
                Mon parcours en détail
              </Link>
            </p>
            <p className="m-0 text-sm text-muted-foreground">
              En toute transparence : si vous vous inscrivez via mes liens, je perçois une
              commission, sans surcoût pour vous.
            </p>
          </div>
        </div>
      </section>

      {/* Carnet de bord */}
      {carnet.length > 0 ? (
        <section aria-labelledby="carnet" className="container-wide pt-16 md:pt-20">
          <div
            className="lined tilt relative flex flex-col gap-5 py-9 pr-7 pl-16 shadow-[var(--shadow-card)] md:pr-9"
            style={r("-0.6deg")}
          >
            <div
              aria-hidden="true"
              className="tape tape-yellow top-[-12px] left-1/2 w-28 -translate-x-1/2 rotate-2"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2
                id="carnet"
                className="m-0 font-hand text-[42px] leading-none font-bold tracking-normal"
              >
                Mon carnet de bord
              </h2>
              <p className="m-0 text-sm text-muted-foreground">Ce que je construis en ce moment</p>
            </div>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {carnet.map((c) => (
                <li key={c.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  {c.date ? (
                    <span className="note w-28 shrink-0 text-[22px]">
                      {formatDateShort(c.date)}
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-[1_1_380px] text-lg leading-relaxed">
                    {c.texte}
                  </span>
                </li>
              ))}
            </ul>
            <p className="note m-0 -rotate-2 self-end text-2xl">→ mis à jour régulièrement</p>
          </div>
        </section>
      ) : null}

      {/* Ressources Cube */}
      {reco.length > 0 ? (
        <section aria-labelledby="gratuit" className="container-wide flex flex-col gap-7 pt-20">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="gratuit" className="m-0 text-[clamp(30px,3.2vw,38px)]">
              Les ressources Cube que je recommande
            </h2>
            <p className="m-0 text-[13px] text-muted-foreground">Liens partenaires</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-6">
            {reco.map((c, i) => {
              const tone =
                i === 0
                  ? "bg-ink text-paper"
                  : c.type === "evenement"
                    ? "postit text-ink"
                    : "sheet text-ink";
              return (
                <a
                  key={c.url}
                  href={track(c.url, "accueil")}
                  rel="sponsored noopener"
                  target="_blank"
                  className={`tilt flex min-h-[200px] flex-col gap-3 p-6 no-underline shadow-[var(--shadow-card)] ${tone}`}
                  style={r(tiltFor(i + 1))}
                >
                  <span className="font-hand text-[22px] font-semibold opacity-85">{c.tag}</span>
                  <span className="font-serif text-[23px] leading-[1.15] font-extrabold">
                    {c.title}
                  </span>
                  <span className="text-sm leading-normal opacity-85">{c.description}</span>
                  <span className="mt-auto text-[15px] font-bold">{c.cta} ↗</span>
                </a>
              );
            })}
          </div>
          <p className="note m-0 -rotate-[1.5deg] self-start text-[25px]">
            ↑ la masterclass, c'est par là que j'aurais commencé
          </p>
        </section>
      ) : null}

      {/* Programmes de formation */}
      {programmes.length > 0 ? (
        <section aria-labelledby="programmes" className="container-wide flex flex-col gap-7 pt-20">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex flex-col gap-2">
              <p className="note m-0 -rotate-1 self-start text-[24px]">prêt à vous lancer ?</p>
              <h2 id="programmes" className="m-0 text-[clamp(30px,3.2vw,38px)]">
                Les formations Cube, par objectif
              </h2>
            </div>
            <p className="m-0 text-[13px] text-muted-foreground">
              Liens partenaires · programmes détaillés à télécharger
            </p>
          </div>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5 p-0">
            {programmes.map((p, i) => (
              <li key={p.url}>
                <a
                  href={track(p.url, "accueil")}
                  rel="sponsored noopener"
                  target="_blank"
                  className={`tilt flex h-full flex-col gap-2 p-5 text-ink no-underline ${p.theme === "general" ? "postit" : "sheet"}`}
                  style={r(tiltFor(i + 2))}
                >
                  <span className="font-serif text-[20px] leading-[1.2] font-extrabold">
                    {p.title}
                  </span>
                  <span className="text-sm leading-normal text-ink-soft">{p.description}</span>
                  <span className="mt-auto pt-2 text-sm font-bold text-accent-ink">
                    Voir le programme ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Catégories */}
      <section
        id="sujets"
        aria-labelledby="cat-titre"
        className="container-wide flex scroll-mt-6 flex-col gap-7 pt-20"
      >
        <h2 id="cat-titre" className="m-0 text-[clamp(30px,3.2vw,38px)]">
          Par où commencer ?
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.slug}
              to="/categorie/$slug"
              params={{ slug: c.slug }}
              className="sheet tilt flex min-h-[170px] flex-col justify-between gap-6 border-t-[6px] p-5 text-ink no-underline"
              style={{ ...r(tiltFor(i)), borderTopColor: c.color }}
            >
              <span className="font-hand text-[26px] font-semibold text-muted-foreground">
                n° {i + 1}
              </span>
              <span className="flex flex-col gap-2">
                <span className="font-serif text-xl leading-[1.15] font-extrabold">{c.name}</span>
                <span className="text-sm leading-snug text-muted-foreground">{c.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Derniers guides */}
      <section
        aria-labelledby="derniers"
        className="container-wide flex flex-col gap-7 pt-20 pb-24"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="derniers" className="m-0 text-[clamp(30px,3.2vw,38px)]">
            Derniers guides
          </h2>
          {totalArticles > articles.length ? (
            <span className="text-[15px] text-muted-foreground">
              {totalArticles} guides au total
            </span>
          ) : null}
        </div>
        {articles.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {articles.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
            ))}
          </div>
        ) : (
          <div className="postit tilt max-w-xl p-6" style={r("-1deg")}>
            <p className="note m-0 text-[26px] text-ink">
              Les premiers guides arrivent très bientôt.
            </p>
          </div>
        )}
      </section>
    </PageFrame>
  );
}

function HeroVisual({ photoUrl }: { photoUrl: string | null }) {
  return (
    <div className="relative flex min-w-0 flex-[1_1_380px] flex-col items-center gap-8 pb-4 sm:block sm:h-[600px] sm:pb-0">
      {photoUrl ? (
        <>
          <div
            className="settle delay-2 w-[300px] max-w-[86%] sm:absolute sm:top-0 sm:right-4 sm:w-[340px]"
            style={r("3deg")}
          >
            <figure className="sheet tilt m-0 px-3.5 pt-3.5 pb-12" style={r("0deg")}>
              <img
                src={photoUrl}
                alt="L'auteur du guide au travail"
                width={312}
                height={360}
                className="block h-[340px] w-full object-cover sm:h-[360px]"
              />
              <figcaption className="note mt-3.5 text-center text-[26px] text-ink">
                moi, avec un vrai projet
              </figcaption>
            </figure>
          </div>
          <div
            aria-hidden="true"
            className="tape settle delay-3 top-[-14px] right-[150px] hidden h-[30px] w-[110px] -rotate-6 bg-[rgb(226_88_62/0.5)] sm:block"
          />
        </>
      ) : (
        <div
          className="settle delay-2 w-[320px] max-w-[92%] sm:absolute sm:top-6 sm:right-4"
          style={r("3deg")}
        >
          <div className="lined sheet px-6 pt-8 pb-10 pl-14">
            <p className="note m-0 text-[28px] text-ink">Au programme :</p>
            <ul className="m-0 mt-2 list-none p-0 text-[17px] leading-[34px]">
              <li>les métiers de l'IA, expliqués</li>
              <li>les outils à apprendre (ou pas)</li>
              <li>le financement CPF, chiffré</li>
              <li>mes vrais retours de terrain</li>
            </ul>
          </div>
        </div>
      )}
      <div
        className="settle delay-4 w-[250px] sm:absolute sm:bottom-10 sm:left-0"
        style={r("-4deg")}
      >
        <div
          className="postit tilt p-5 font-hand text-[25px] leading-[1.25] font-semibold"
          style={r("0deg")}
        >
          Ingénieur BTP de formation.
          <br />
          Responsable commercial et product builder.
          <br />
          <span className="text-accent-ink">Les deux à la fois.</span>
        </div>
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 120 80"
        className="absolute bottom-[190px] left-[210px] hidden w-[100px] sm:block"
      >
        <path
          className="draw"
          d="M8 70 C 40 70, 70 50, 100 14"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M88 14 L101 12 L99 26"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
