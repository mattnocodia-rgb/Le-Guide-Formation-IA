import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { track } from "@/lib/track";
import type React from "react";
import { useState } from "react";

import { ArticleCard, LinkedInIcon } from "@/components/site/Cards";
import { PageFrame } from "@/components/site/SiteChrome";
import { getArticle } from "@/lib/content.functions";
import { youtubeEmbed, youtubeThumb, youtubeWatch } from "@/lib/video";
import {
  LINKEDIN_URL,
  ORGANIZATION_LD,
  SITE_NAME,
  absUrl,
  authorLd,
  categoryBySlug,
  formatDateFr,
  jsonLdScript,
  ogImageFor,
  pageHead,
} from "@/lib/site";

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const article = await getArticle({ data: { slug: params.slug } });
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData: a }) => {
    if (!a)
      return {
        meta: [
          { title: `Page introuvable — ${SITE_NAME}` },
          { name: "robots", content: "noindex" },
        ],
      };
    const path = `/${a.slug}`;
    const title = a.metaTitle || `${a.title} — ${SITE_NAME}`;
    const description = a.metaDescription || a.excerpt;
    const category = a.categorySlug ? categoryBySlug(a.categorySlug) : undefined;
    const ld: unknown[] = [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.title,
        description,
        inLanguage: "fr-FR",
        mainEntityOfPage: absUrl(path),
        image: ogImageFor(a.categorySlug),
        ...(a.publishedAt ? { datePublished: a.publishedAt } : {}),
        ...(a.updatedAt ? { dateModified: a.updatedAt } : {}),
        author: authorLd(a.authorName),
        publisher: ORGANIZATION_LD,
        ...(a.category ? { articleSection: a.category } : {}),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: absUrl("/") },
          ...(category
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: category.name,
                  item: absUrl(`/categorie/${category.slug}`),
                },
              ]
            : []),
          { "@type": "ListItem", position: category ? 3 : 2, name: a.title, item: absUrl(path) },
        ],
      },
    ];
    for (const v of a.videos) {
      ld.push({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: v.title,
        description: v.description,
        thumbnailUrl: youtubeThumb(v.youtubeId),
        uploadDate: v.publishedAt ?? a.publishedAt ?? a.updatedAt ?? undefined,
        embedUrl: youtubeEmbed(v.youtubeId),
        url: youtubeWatch(v.youtubeId),
        inLanguage: "fr-FR",
      });
    }
    if (a.faq.length > 0) {
      ld.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: a.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answerText },
        })),
      });
    }
    const head = pageHead({
      title,
      description,
      path,
      image: ogImageFor(a.categorySlug),
      type: "article",
    });
    return {
      ...head,
      meta: [
        ...head.meta,
        ...(a.publishedAt ? [{ property: "article:published_time", content: a.publishedAt }] : []),
        ...(a.updatedAt ? [{ property: "article:modified_time", content: a.updatedAt }] : []),
      ],
      scripts: ld.map(jsonLdScript),
    };
  },
  component: ArticlePage,
});

const r = (deg: string) => ({ "--r": deg }) as React.CSSProperties;

function ArticlePage() {
  const a = Route.useLoaderData();
  const category = a.categorySlug ? categoryBySlug(a.categorySlug) : undefined;

  return (
    <PageFrame activeSlug={a.categorySlug ?? undefined}>
      <div className="container-wide pt-2">
        <nav
          aria-label="Fil d'Ariane"
          className="flex flex-wrap gap-2 text-sm text-muted-foreground"
        >
          <Link to="/" className="text-muted-foreground">
            Accueil
          </Link>
          <span aria-hidden="true">›</span>
          {category ? (
            <>
              <Link
                to="/categorie/$slug"
                params={{ slug: category.slug }}
                className="text-muted-foreground"
              >
                {category.name}
              </Link>
              <span aria-hidden="true">›</span>
            </>
          ) : null}
          <span className="text-ink">{a.title}</span>
        </nav>
      </div>

      <div className="container-wide flex flex-wrap items-start gap-14 pt-9 pb-20">
        <article className="flex max-w-[740px] min-w-0 flex-[999_1_560px] flex-col gap-8">
          <header className="flex flex-col gap-4">
            {a.category ? (
              <p className="note settle m-0 self-start text-[28px]" style={r("-2deg")}>
                {a.category}
              </p>
            ) : null}
            <h1 className="settle delay-1 m-0 text-[clamp(34px,4.6vw,56px)] leading-[1.05] tracking-[-0.025em]">
              {a.title}
            </h1>
            {a.excerpt ? (
              <p className="settle delay-2 m-0 text-xl leading-normal text-ink-soft md:text-[21px]">
                {a.excerpt}
              </p>
            ) : null}
            <p className="m-0 text-[15px] text-ink-soft">
              Par{" "}
              <Link to="/a-propos" className="font-semibold">
                Matthieu
              </Link>
              , responsable commercial et product builder
            </p>
            <p className="m-0 text-sm text-muted-foreground">
              {a.updatedAt ? (
                <strong className="font-semibold text-ink">
                  Mis à jour le <time dateTime={a.updatedAt}>{formatDateFr(a.updatedAt)}</time>
                </strong>
              ) : null}
              {a.publishedAt && a.publishedAt !== a.updatedAt
                ? ` · Publié le ${formatDateFr(a.publishedAt)}`
                : ""}
              {` · ${a.readingMinutes} min de lecture`}
            </p>
          </header>

          <aside
            aria-label="Transparence"
            className="flex gap-3.5 border border-dashed border-[#c9bfa8] bg-paper-light px-4.5 py-4 text-sm leading-normal text-ink-soft"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent-ink)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-px shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span>
              Je suis ambassadeur de l'École Cube : cet article contient des liens partenaires vers
              l'école. Si vous vous inscrivez via ces liens, je perçois une commission, sans surcoût
              pour vous.
            </span>
          </aside>

          {a.videos.length > 0 ? <Shorts videos={a.videos} /> : null}

          <div className="prose-article" dangerouslySetInnerHTML={{ __html: a.html }} />

          {a.dansMonCasHtml ? (
            <aside
              aria-label="Dans mon cas"
              className="lined tilt relative py-7 pr-7 pl-16 shadow-[var(--shadow-card)]"
              style={r("-0.5deg")}
            >
              <div
                aria-hidden="true"
                className="tape tape-yellow top-[-12px] right-10 w-24 rotate-3"
              />
              <p className="m-0 font-hand text-[34px] leading-tight font-bold">Dans mon cas</p>
              <div
                className="prose-article prose-compact mt-2 leading-[32px]"
                dangerouslySetInnerHTML={{ __html: a.dansMonCasHtml }}
              />
            </aside>
          ) : null}

          {a.principal ? (
            <div
              className="tilt flex flex-col gap-3.5 bg-ink p-6 text-paper shadow-[var(--shadow-card)] md:p-7"
              style={r("0.6deg")}
            >
              <p className="m-0 font-hand text-[26px] font-semibold text-[#f1a08f]">
                Pour aller plus loin
              </p>
              <p className="m-0 text-lg leading-normal">
                {a.masterclass
                  ? `L'École Cube propose des masterclass gratuites en replay, dont une sur ce sujet : « ${a.masterclass} ».`
                  : "L'École Cube propose des masterclass gratuites et des formations certifiantes sur ce sujet."}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={track(a.principal.url, "encadre")}
                  rel="sponsored noopener"
                  target="_blank"
                  className="btn-paper text-[15px]"
                >
                  {a.principal.label} ↗
                </a>
                {a.secondaire ? (
                  <a
                    href={track(a.secondaire.url, "encadre")}
                    rel="sponsored noopener"
                    target="_blank"
                    className="px-1.5 py-3 text-[15px] font-semibold text-paper"
                  >
                    {a.secondaire.label} ↗
                  </a>
                ) : null}
              </div>
              <p className="m-0 text-xs text-[#b7af9f]">Liens partenaires</p>
            </div>
          ) : null}

          <AuthorBox withCube={a.cubeBox} />

          {a.faq.length > 0 ? <Faq items={a.faq} /> : null}

          {a.sourcesHtml ? (
            <section
              aria-labelledby="sources"
              className="flex flex-col gap-2.5 border-t border-dashed border-[#c9bfa8] pt-6"
            >
              <h2 id="sources" className="m-0 text-xl">
                Sources
              </h2>
              <div
                className="prose-article prose-compact text-[15px] text-ink-soft"
                dangerouslySetInnerHTML={{ __html: a.sourcesHtml }}
              />
            </section>
          ) : null}

          {a.ressources || a.rdv ? (
            <section
              aria-labelledby="suite"
              className="postit tilt flex flex-wrap items-center justify-between gap-5 p-7"
              style={r("-0.5deg")}
            >
              <div className="flex flex-[1_1_280px] flex-col gap-1.5">
                <h2
                  id="suite"
                  className="m-0 font-hand text-4xl leading-none font-bold tracking-normal"
                >
                  Et maintenant ?
                </h2>
                <p className="m-0 text-[15px] leading-normal text-[#3a362f]">
                  Regardez une masterclass gratuite, ou parlez directement à un conseiller de
                  l'école.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {a.ressources ? (
                  <a
                    href={track(a.ressources.url, "encadre")}
                    rel="sponsored noopener"
                    target="_blank"
                    className="btn-ink text-[15px]"
                  >
                    Les masterclass ↗
                  </a>
                ) : null}
                {a.rdv ? (
                  <a
                    href={track(a.rdv.url, "encadre")}
                    rel="sponsored noopener"
                    target="_blank"
                    className="px-1.5 py-3 text-[15px] font-semibold text-ink"
                  >
                    Un conseiller ↗
                  </a>
                ) : null}
              </div>
              <p className="m-0 basis-full text-xs text-muted-foreground">Liens partenaires</p>
            </section>
          ) : null}
        </article>

        <aside
          aria-label="Sommaire"
          className="flex flex-[1_1_260px] flex-col gap-6 lg:sticky lg:top-6"
        >
          {a.toc.length > 1 ? (
            <div className="sheet flex flex-col gap-2.5 p-5">
              <p className="m-0 font-hand text-[26px] font-semibold">Sommaire</p>
              <nav className="flex flex-col text-[15px]">
                {a.toc.map((t, i) => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className={`py-2 text-ink no-underline hover:text-accent-ink ${i < a.toc.length - 1 ? "border-b border-dashed border-rule" : ""}`}
                  >
                    {t.text}
                  </a>
                ))}
              </nav>
            </div>
          ) : null}
          {a.rdv ? (
            <div className="postit tilt flex flex-col gap-2.5 p-5" style={r("2deg")}>
              <p className="m-0 font-hand text-[28px] leading-[1.05] font-bold">Vous hésitez ?</p>
              <p className="m-0 text-sm leading-normal text-[#3a362f]">
                Un conseiller de l'École Cube vous aide à choisir et à financer votre formation.
                C'est gratuit.
              </p>
              <a
                href={track(a.rdv.url, "encadre")}
                rel="sponsored noopener"
                target="_blank"
                className="btn-ink min-h-11 text-sm"
              >
                Prendre rendez-vous ↗
              </a>
              <p className="m-0 text-[11px] text-muted-foreground">Lien partenaire</p>
            </div>
          ) : null}
        </aside>
      </div>

      {a.related.length > 0 ? (
        <section aria-labelledby="lies" className="border-t border-rule bg-paper-light">
          <div className="container-wide flex flex-col gap-7 py-16">
            <h2 id="lies" className="m-0 text-3xl">
              À lire aussi
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {a.related.map((rel, i) => (
                <ArticleCard key={rel.slug} article={rel} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PageFrame>
  );
}

/** Why the author recommends the school, in his own words. */
const RAISONS = [
  {
    titre: "Une promo, pas une plateforme :",
    texte:
      "en bootcamp, on échange tous les jours avec ses collègues de promo dans une classe virtuelle (WorkAdventure).",
  },
  {
    titre: "Des mentors chaque jour :",
    texte: "quand on est bloqué, on n'attend pas la semaine suivante.",
  },
  {
    titre: "Une école qui écoute :",
    texte:
      "elle a fait évoluer son bootcamp à partir des retours des élèves, avec un projet fil rouge mené pendant l'acquisition des nouvelles compétences.",
  },
];

function AuthorBox({ withCube }: { withCube: boolean }) {
  if (!withCube) {
    return (
      <aside
        aria-label="L'auteur"
        className="flex flex-col gap-2.5 border-t-[3px] border-ink bg-paper-light p-6"
      >
        <p className="note m-0 text-[26px]">L'auteur</p>
        <p className="m-0 text-[17px] leading-[1.65] text-[#2b2823]">
          Je suis Matthieu, ingénieur BTP de formation, responsable commercial et product builder
          certifié (titre RNCP Product builder no-code, niveau 6) : j'allie les deux au quotidien.
          Je crée des sites web et j'améliore les process des entreprises. Je ne suis pas là pour
          vous orienter ni vous conseiller : je partage de l'information et mon parcours.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <Link to="/a-propos" className="py-1.5 text-[15px] font-semibold">
            Mon parcours →
          </Link>
          <a
            href={LINKEDIN_URL}
            rel="noopener me"
            target="_blank"
            className="inline-flex items-center gap-2 py-1.5 text-[15px] font-semibold"
          >
            <LinkedInIcon />
            Mon profil LinkedIn →
          </a>
        </div>
      </aside>
    );
  }
  return (
    <aside
      aria-label="L'auteur"
      className="flex flex-col gap-2.5 border-t-[3px] border-ink bg-paper-light p-6"
    >
      <p className="note m-0 text-[26px]">Ce que l'École Cube m'a apporté</p>
      <p className="m-0 text-[17px] leading-[1.65] text-[#2b2823]">
        Ingénieur BTP de formation, je suis responsable commercial et product builder certifié par
        l'École Cube (RNCP niveau 6) : j'allie les deux au quotidien. J'y ai appris une méthode qui
        a fait de moi un expert en automatisation et qui permet de décrypter les étapes du
        développement. Aujourd'hui, je crée des sites web et j'améliore les process des entreprises.
        Je ne suis pas là pour vous orienter ni vous conseiller : je partage de l'information et mon
        parcours.
      </p>
      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[16px] leading-[1.6] text-[#2b2823]">
        {RAISONS.map((r) => (
          <li key={r.titre} className="flex gap-2.5">
            <span aria-hidden="true" className="font-hand text-[20px] leading-none text-accent-ink">
              →
            </span>
            <span>
              <strong>{r.titre}</strong> {r.texte}
            </span>
          </li>
        ))}
      </ul>
      <a
        href={LINKEDIN_URL}
        rel="noopener me"
        target="_blank"
        className="inline-flex items-center gap-2 self-start py-1.5 text-[15px] font-semibold"
      >
        <LinkedInIcon />
        Mon profil LinkedIn →
      </a>
    </aside>
  );
}

function Faq({ items }: { items: { question: string; answerHtml: string }[] }) {
  return (
    <section aria-labelledby="faq" className="flex flex-col gap-3">
      <h2 id="faq" className="m-0 mb-2 text-[31px]">
        Questions fréquentes
      </h2>
      {/* Native <details>: every answer is in the HTML and readable without JavaScript. */}
      {items.map((f, i) => (
        <details
          key={f.question}
          open={i === 0}
          className="group bg-sheet shadow-[0_6px_16px_-12px_rgb(31_29_26/0.4)]"
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
            <h3 className="m-0 font-sans text-base font-semibold tracking-normal">{f.question}</h3>
            <span aria-hidden="true" className="font-hand text-3xl leading-none text-accent-ink">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <div
            className="prose-article prose-compact px-5 pb-5 text-ink-soft"
            dangerouslySetInnerHTML={{ __html: f.answerHtml }}
          />
        </details>
      ))}
    </section>
  );
}

type ShortItem = { youtubeId: string; title: string };

/** The article's Shorts, in its own section right after the intro. */
function Shorts({ videos }: { videos: ShortItem[] }) {
  return (
    <section aria-label="En vidéo" className="flex flex-col gap-3">
      <p className="note m-0 self-start text-[26px]" style={r("-1.5deg")}>
        {videos.length > 1 ? "L'essentiel en vidéos" : "L'essentiel en vidéo"}
      </p>
      <div className="grid max-w-[520px] grid-cols-2 gap-4">
        {videos.map((v) => (
          <ShortPlayer key={v.youtubeId} video={v} />
        ))}
      </div>
    </section>
  );
}

/**
 * Click-to-load YouTube player: only a static thumbnail until the visitor clicks, so no
 * YouTube script or cookie is loaded before that (privacy-enhanced youtube-nocookie.com).
 */
function ShortPlayer({ video }: { video: ShortItem }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-md bg-ink shadow-[var(--shadow-card)]">
      {playing ? (
        <iframe
          src={`${youtubeEmbed(video.youtubeId)}?autoplay=1&rel=0&playsinline=1`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Lire la vidéo : ${video.title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer border-0 p-0"
        >
          <img
            src={youtubeThumb(video.youtubeId)}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
            className="h-full w-full object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-paper shadow-lg transition-transform group-hover:scale-110"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pt-10 pb-3 text-left text-sm leading-snug font-semibold text-white">
            {video.title}
          </span>
        </button>
      )}
    </div>
  );
}
