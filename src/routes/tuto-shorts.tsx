import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { PageFrame } from "@/components/site/SiteChrome";
import { getShortsOffer } from "@/lib/content.functions";
import { AUTHOR_REF, SITE_URL, jsonLdScript, pageHead, siteEntitiesLd } from "@/lib/site";
import { youtubeEmbed, youtubeThumb, youtubeWatch } from "@/lib/video";

const PATH = "/tuto-shorts";
const r = (deg: string) => ({ "--r": deg }) as CSSProperties;

/** A real short made with this method (Airtable « Vidéos », published 02/11/2026). */
const EXAMPLE = { id: "p-GdkfI0B_E", title: "Un chatbot explique. Un agent IA agit." };

const STEPS = [
  {
    title: "Vous donnez le sujet",
    text: "Le titre ou le lien de votre article, c'est tout.",
  },
  {
    title: "Claude écrit le script",
    text: "Une accroche dès la première seconde, une phrase par écran, les textes à afficher et la durée de chaque plan : 30 à 45 secondes au total.",
  },
  {
    title: "La voix off est générée",
    text: "Avec ElevenLabs, en français, sans micro ni enregistrement.",
  },
  {
    title: "La vidéo est animée et exportée",
    text: "Avec HyperFrames : une vidéo verticale de 1080 × 1920 en MP4, avec un dernier écran qui renvoie vers votre article.",
  },
  {
    title: "Vous publiez",
    text: "Sur YouTube Shorts, Instagram Reels ou TikTok, à la main, quand vous le voulez.",
  },
];

const NEEDS = [
  {
    what: "Un abonnement Claude qui donne accès à Claude Code",
    note: "C'est le seul coût. Le tuto explique comment l'installer, pas à pas.",
  },
  {
    what: "Un compte ElevenLabs gratuit",
    note: "Pour la voix off, dans la limite de l'offre gratuite.",
  },
  {
    what: "HyperFrames, gratuit",
    note: "Pour l'animation. Claude l'installe pour vous en suivant le tuto.",
  },
];

const FAQ = [
  {
    q: "Faut-il savoir monter une vidéo ?",
    a: "Non. Il n'y a ni tournage ni montage : Claude écrit le script, la voix off est générée et l'animation est calculée automatiquement. Vous récupérez un fichier MP4 prêt à publier.",
  },
  {
    q: "Faut-il apparaître à l'écran ?",
    a: "Non. Les shorts sont des animations de texte et de formes avec une voix off, sans visage ni avatar.",
  },
  {
    q: "Combien de temps faut-il pour créer un short ?",
    a: "Une fois l'outil installé, environ 2 minutes : vous donnez le sujet de l'article, le short se crée. La première installation prend un peu plus de temps, et le tuto la détaille étape par étape.",
  },
  {
    q: "Y a-t-il des frais en plus ?",
    a: "Il faut un abonnement Claude qui donne accès à Claude Code. ElevenLabs et HyperFrames s'utilisent en version gratuite ; au-delà du quota gratuit d'ElevenLabs, c'est à vous de voir si vous passez à une offre payante.",
  },
  {
    q: "Les shorts sont-ils publiés automatiquement ?",
    a: "Non, vous les publiez vous-même sur YouTube, Instagram ou TikTok. Vous gardez la main sur ce qui sort et quand.",
  },
];

export const Route = createFileRoute("/tuto-shorts")({
  loader: () => getShortsOffer(),
  head: () => {
    const head = pageHead({
      title: "Créer un short vidéo à partir d'un article, en 2 minutes",
      description:
        "Un skill Claude et un tuto pas à pas pour transformer un article en short vertical : script, voix off et animation, sans tournage ni montage.",
      path: PATH,
    });
    return {
      ...head,
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: `${SITE_URL}${PATH}`,
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
          author: AUTHOR_REF,
        }),
        jsonLdScript({ "@context": "https://schema.org", "@graph": siteEntitiesLd() }),
      ],
    };
  },
  component: ShortsPage,
});

function BuyBox({ className = "" }: { className?: string }) {
  const { price, buyUrl } = Route.useLoaderData();
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${className}`}>
      {buyUrl ? (
        <a href={buyUrl} rel="noopener" target="_blank" className="btn-ink">
          Acheter le skill et le tuto{price ? ` — ${price}` : ""}
        </a>
      ) : (
        <>
          <span aria-disabled="true" className="btn-outline cursor-not-allowed opacity-70">
            Bientôt disponible{price ? ` — ${price}` : ""}
          </span>
          <Link to="/contact" search={{ besoin: "autre" }} className="py-2 font-semibold">
            Me prévenir de la sortie →
          </Link>
        </>
      )}
    </div>
  );
}

/** Loads the YouTube player only on click: no third-party request before the visitor asks. */
function ExampleShort() {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="m-0 w-full max-w-[300px]">
      <div className="sheet relative aspect-[9/16] overflow-hidden" style={r("1deg")}>
        {playing ? (
          <iframe
            src={`${youtubeEmbed(EXAMPLE.id)}?autoplay=1&rel=0&playsinline=1`}
            title={EXAMPLE.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 h-full w-full cursor-pointer border-0 bg-ink p-0"
            aria-label={`Lire le short : ${EXAMPLE.title}`}
          >
            <img
              src={youtubeThumb(EXAMPLE.id)}
              alt=""
              width={480}
              height={360}
              loading="lazy"
              className="h-full w-full object-cover opacity-90"
            />
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-[26px] text-ink"
            >
              ▶
            </span>
          </button>
        )}
      </div>
      <figcaption className="note mt-3 text-center text-[22px]">
        un vrai short, créé avec cette méthode
      </figcaption>
      <p className="m-0 mt-1 text-center text-[13.5px]">
        <a href={youtubeWatch(EXAMPLE.id)} rel="noopener" target="_blank">
          Voir sur YouTube ↗
        </a>
      </p>
    </figure>
  );
}

function Section({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="container-wide max-w-[880px] pt-16">
      {kicker ? <p className="note m-0 -rotate-1 text-[24px]">{kicker}</p> : null}
      <h2 id={id} className="m-0 mt-1 text-[clamp(28px,3.2vw,38px)] leading-[1.1]">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ShortsPage() {
  return (
    <PageFrame>
      {/* Hero */}
      <section className="container-wide flex max-w-[880px] flex-wrap items-start gap-10 pt-12 md:pt-16">
        <div className="min-w-0 flex-[999_1_420px]">
          <p className="note m-0 -rotate-2 text-[28px]">skill Claude + tuto pas à pas</p>
          <h1 className="mt-3 mb-6 text-[clamp(36px,5vw,56px)] leading-[1.05]">
            Un short vidéo par article, en 2 minutes
          </h1>
          <p className="m-0 text-xl leading-relaxed text-ink-soft">
            Vous écrivez des articles, mais personne ne les voit sur les réseaux ? Donnez le sujet
            de votre article : Claude écrit le script, génère la voix off et anime une vidéo
            verticale, prête à publier. Sans tournage, sans montage, sans apparaître à l'écran.
          </p>
          <BuyBox className="mt-8" />
        </div>
        <ExampleShort />
      </section>

      {/* Déroulé */}
      <Section id="comment" kicker="en cinq temps" title="Comment ça marche ?">
        <ol className="m-0 flex list-none flex-col gap-5 p-0">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="font-serif text-[24px] leading-none font-extrabold text-accent-ink">
                {i + 1}
              </span>
              <p className="m-0 text-[17px] leading-relaxed">
                <strong>{s.title}.</strong> {s.text}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Contenu */}
      <Section id="contenu" title="Ce que vous recevez">
        <div className="sheet relative p-6 md:p-8" style={r("0.5deg")}>
          <span aria-hidden="true" className="tape -top-2.5 left-10" style={r("-3deg")} />
          <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[16.5px] leading-relaxed text-ink-soft marker:text-accent">
            <li>
              <strong className="text-ink">Le skill Claude</strong> qui transforme un sujet
              d'article en short : script, voix off, animation, export MP4.
            </li>
            <li>
              <strong className="text-ink">Un tuto pas à pas pour débutant</strong>, même si vous
              n'avez jamais installé Claude : l'installation, puis votre premier short, étape par
              étape.
            </li>
          </ul>
        </div>
      </Section>

      {/* Prérequis */}
      <Section id="prerequis" kicker="pas de mauvaise surprise" title="De quoi avez-vous besoin ?">
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-3">
          {NEEDS.map((n) => (
            <li key={n.what} className="sheet p-5">
              <h3 className="m-0 text-[18px] leading-snug">{n.what}</h3>
              <p className="m-0 mt-1.5 text-[15px] leading-relaxed text-ink-soft">{n.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Limites */}
      <Section id="limites" title="Ce que le tuto ne fait pas">
        <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[17px] leading-relaxed marker:text-accent">
          <li>Il ne publie pas les vidéos à votre place : vous gardez la main.</li>
          <li>
            Il ne crée pas d'avatar ni de vidéo filmée : ce sont des animations avec voix off.
          </li>
          <li>Il ne garantit pas un nombre de vues.</li>
        </ul>
      </Section>

      {/* FAQ */}
      <Section id="faq" title="Questions fréquentes">
        <div className="flex flex-col gap-6">
          {FAQ.map((f) => (
            <div key={f.q}>
              <h3 className="m-0 text-[19px] leading-snug">{f.q}</h3>
              <p className="m-0 mt-1.5 text-[16.5px] leading-relaxed text-ink-soft">{f.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA final */}
      <section className="container-wide max-w-[880px] pt-16 pb-20">
        <div className="sheet relative p-6 md:p-8" style={r("-0.5deg")}>
          <span aria-hidden="true" className="tape -top-2.5 left-10" style={r("3deg")} />
          <h2 className="m-0 text-[clamp(24px,2.6vw,32px)] leading-tight">
            La méthode qui crée les shorts de ce guide
          </h2>
          <p className="m-0 mt-3 text-[16.5px] leading-relaxed text-ink-soft">
            Un produit personnel de Matthieu Audineau, product builder à Nantes, sans lien avec
            l'École Cube. Pour en savoir plus sur moi, voir la page{" "}
            <Link to="/a-propos">à propos</Link>.
          </p>
          <BuyBox className="mt-6" />
        </div>
      </section>
    </PageFrame>
  );
}
