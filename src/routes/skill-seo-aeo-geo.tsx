import { Link, createFileRoute } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";

import { PageFrame } from "@/components/site/SiteChrome";
import { getSkillOffer } from "@/lib/content.functions";
import { SITE_NAME, SITE_URL, authorLd, jsonLdScript, pageHead } from "@/lib/site";

const PATH = "/skill-seo-aeo-geo";
const r = (deg: string) => ({ "--r": deg }) as CSSProperties;

const LAYERS = [
  {
    tag: "SEO",
    title: "Être trouvé",
    text: "Par Google, Bing, et par les IA qui s'appuient sur leurs index pour répondre : structure, intention de recherche, sitemap, indexation.",
  },
  {
    tag: "AEO",
    title: "Être compris",
    text: "Par les moteurs de réponse : des paragraphes autonomes, la réponse dès la première phrase, des faits datés, des tableaux et une FAQ extractibles.",
  },
  {
    tag: "GEO",
    title: "Être choisi",
    text: "Par une IA qui doit citer une source plutôt qu'une autre : autorité, cohérence d'un article à l'autre, expérience de première main.",
  },
];

const CONTENTS = [
  {
    file: "La méthode d'audit",
    text: "Six étapes : inventaire du site, lecture des articles, contrôle, comparaison entre articles, rapport priorisé, réécriture.",
  },
  {
    file: "La grille de 32 contrôles",
    text: "8 contrôles par paragraphe, 14 par article, 10 pour le site entier. Chaque contrôle est numéroté et dit comment le vérifier.",
  },
  {
    file: "5 problèmes invisibles article par article",
    text: "Cannibalisation, chiffres contradictoires, vocabulaire périmé, articles de qualité inégale, pages mal indexées : ce qu'on ne voit qu'en comparant les pages entre elles.",
  },
  {
    file: "Un guide PDF pas à pas",
    text: "10 pages pour installer le skill, réaliser un premier audit, lire le rapport et l'adapter à votre métier. Avec des demandes prêtes à copier.",
  },
  {
    file: "Un gabarit de rédaction",
    text: "Le patron suivi par chaque article de ce guide : réponse d'abord, questions en intertitres, encadré d'expérience, FAQ, sources datées.",
  },
];

const STEPS = [
  {
    title: "Vous demandez un audit, ou un article",
    text: "« Audite le blog de monsite.fr », « vérifie cet article », « écris un article sur… ». Claude reconnaît la demande et charge le skill tout seul.",
  },
  {
    title: "Le skill fait l'inventaire",
    text: "Il lit le sitemap (ou l'export que vous lui donnez), compte les pages, et vous dit combien il en a lu en entier : pas d'audit sur un échantillon caché.",
  },
  {
    title: "Il contrôle, puis compare",
    text: "Chaque article passe les 22 contrôles paragraphe et article. Ensuite, les 10 contrôles site : c'est là qu'apparaissent les doublons et les chiffres qui se contredisent.",
  },
  {
    title: "Il livre un plan d'action",
    text: "Les problèmes à plus fort impact d'abord. Pour chaque action : ce qu'elle corrige, et ce qu'elle ne corrige pas.",
  },
  {
    title: "Il réécrit, ou vous donne le prompt",
    text: "Il réécrit l'article au gabarit. Si votre site passe par un outil comme Lovable ou WordPress, il rédige un prompt prêt à coller, avec ce qu'il ne faut surtout pas changer.",
  },
];

const BENEFITS = [
  {
    title: "Construit sur de vrais audits",
    text: "Pas une liste de bonnes pratiques recopiée : chaque contrôle vient d'un problème rencontré sur un site réel, dont celui-ci.",
  },
  {
    title: "Il regarde le site entier",
    text: "La plupart des outils notent un article à la fois. Les erreurs qui coûtent le plus cher se voient entre les articles.",
  },
  {
    title: "Il dit ce qu'une action ne règle pas",
    text: "Corriger une URL ne corrige pas un fond faible. Le skill le précise à chaque fois, pour éviter les faux « c'est réglé ».",
  },
  {
    title: "En français, pour tout type de site",
    text: "Santé, artisanat, SaaS, e-commerce, formation : il adapte ses contrôles au secteur, et n'impose pas le gabarit aux témoignages.",
  },
  {
    title: "Acheté une fois, utilisé sans limite",
    text: "Un fichier à installer, sans abonnement. Il tourne dans votre propre compte Claude.",
  },
];

type Support = "oui" | "compatible" | "partiel";
const COMPAT: { where: string; support: Support; how: string }[] = [
  {
    where: "Claude (web, ordinateur, mobile)",
    support: "oui",
    how: "Toutes les offres, gratuite comprise. Installation en quelques clics, détaillée dans le guide PDF.",
  },
  {
    where: "Claude Code",
    support: "oui",
    how: "Installation automatique ou manuelle, détaillée dans le guide PDF.",
  },
  {
    where: "Codex CLI, Gemini CLI, GitHub Copilot, Cursor…",
    support: "compatible",
    how: "Ces outils lisent le même format SKILL.md. Non testé par mes soins : la méthode s'applique, l'installation dépend de chaque outil.",
  },
  {
    where: "ChatGPT, Mistral et autres assistants",
    support: "partiel",
    how: "Pas de prise en charge native connue de ce format.",
  },
];
const SUPPORT_LABEL: Record<Support, string> = {
  oui: "Oui",
  compatible: "Format compatible",
  partiel: "À adapter",
};

const SECTORS = [
  {
    who: "Santé et bien-être",
    example: "une application sur l'endométriose, un cabinet de sophrologie",
    what: "Le skill renforce l'exigence sur les sources, la qualification de l'auteur et les promesses de résultat, sur lesquelles Google et les IA sont plus sévères. Il ne remplace pas la relecture par un professionnel de santé, et le dit.",
  },
  {
    who: "Artisans et activités locales",
    example: "un charpentier, un praticien en cabinet, un commerce",
    what: "Il vérifie la zone d'intervention, les pages par service, les réalisations datées et localisées. Il rappelle que la fiche Google de l'établissement et les avis pèsent souvent plus lourd que le blog : ces points-là, il vous les liste, sans pouvoir les auditer.",
  },
  {
    who: "SaaS, formation, conseil, médias",
    example: "un logiciel, un organisme de formation, un blog expert",
    what: "Le terrain naturel de la grille : guides, comparatifs, articles de fond, et la cohérence entre des dizaines de pages.",
  },
  {
    who: "Boutiques en ligne",
    example: "un e-commerce, une marque",
    what: "Les guides d'achat suivent le gabarit ; les fiches produit ont leurs propres contrôles (caractéristiques, avis, données structurées produit).",
  },
];

const FAQ = [
  {
    q: "Quelle différence entre SEO, AEO et GEO ?",
    a: "Le SEO sert à être trouvé par les moteurs de recherche. L'AEO (Answer Engine Optimization) sert à être compris et extrait par les moteurs de réponse comme ChatGPT ou Perplexity. Le GEO (Generative Engine Optimization) sert à être choisi et cité par une IA plutôt qu'un concurrent. Les trois s'empilent : sans SEO, pas d'AEO ; sans AEO, pas de GEO.",
  },
  {
    q: "Le skill fonctionne-t-il pour un artisan ou un thérapeute ?",
    a: "Oui. Il audite le contenu de n'importe quel site. Pour une activité locale, il ajoute les contrôles propres au local et liste ce qui se joue hors du site, comme la fiche Google et les avis. Pour la santé et le bien-être, il renforce l'exigence sur les sources et les promesses de résultat.",
  },
  {
    q: "Faut-il savoir coder pour utiliser le skill ?",
    a: "Non. Sur Claude, l'installation consiste à importer un fichier .zip dans les réglages, puis à poser sa question en français.",
  },
  {
    q: "Le skill fonctionne-t-il avec la version gratuite de Claude ?",
    a: "Oui : les skills sont disponibles sur toutes les offres Claude, gratuite comprise, à condition d'activer la création de fichiers. Les limites d'usage de l'offre gratuite peuvent en revanche écourter l'audit d'un gros site.",
  },
  {
    q: "Garantit-il d'être premier sur Google ou cité par ChatGPT ?",
    a: "Non. Aucun outil ne peut le garantir. Le skill vérifie que votre contenu remplit les conditions pour être trouvé, compris et cité, et vous dit quoi corriger en priorité.",
  },
  {
    q: "Le skill accède-t-il à mes données Search Console ?",
    a: "Non. Il travaille sur le contenu : vos pages en ligne, ou les textes et exports que vous lui donnez. Il ne mesure ni le trafic ni les positions.",
  },
];

export const Route = createFileRoute("/skill-seo-aeo-geo")({
  loader: () => getSkillOffer(),
  head: () => {
    const head = pageHead({
      title: `Skill Claude SEO, AEO et GEO : auditer et écrire pour Google et les IA — ${SITE_NAME}`,
      description:
        "Le skill Claude avec lequel ce guide a été écrit et audité : 32 contrôles SEO, AEO et GEO, une méthode d'audit de site entier et un gabarit de rédaction. Ce qu'il contient, comment il marche, où il fonctionne.",
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
          author: authorLd(),
        }),
      ],
    };
  },
  component: SkillPage,
});

function BuyBox({ className = "" }: { className?: string }) {
  const { price, buyUrl } = Route.useLoaderData();
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${className}`}>
      {buyUrl ? (
        <a href={buyUrl} rel="noopener" target="_blank" className="btn-ink">
          Acheter le skill{price ? ` — ${price}` : ""}
        </a>
      ) : (
        <span aria-disabled="true" className="btn-outline cursor-not-allowed opacity-70">
          Bientôt disponible
        </span>
      )}
      <span className="text-[15px] text-ink-soft">
        Paiement sécurisé par Stripe · fichier .zip · sans abonnement ·{" "}
        <Link to="/conditions-de-vente">conditions de vente</Link>
      </span>
    </div>
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

function SkillPage() {
  return (
    <PageFrame>
      {/* Hero */}
      <section className="container-wide max-w-[880px] pt-12 md:pt-16">
        <p className="note m-0 -rotate-2 text-[28px]">l'outil derrière ce guide</p>
        <h1 className="mt-3 mb-6 text-[clamp(36px,5vw,58px)] leading-[1.05]">
          Le skill Claude qui a écrit et audité ce site
        </h1>
        <p className="m-0 max-w-[680px] text-xl leading-relaxed text-ink-soft">
          Si vous êtes tombé sur ce site, vous avez déjà vu ce skill à l'œuvre : chaque article a
          été rédigé puis vérifié avec lui, pour être trouvé par Google, compris par les IA et cité
          par elles. Je l'ai construit pour mes propres sites. Le voici, prêt à installer dans
          Claude.
        </p>
        <BuyBox className="mt-8" />
      </section>

      {/* SEO / AEO / GEO */}
      <Section id="quoi" kicker="en une phrase" title="Qu'est-ce que ce skill ?">
        <p className="m-0 max-w-[720px] text-[17px] leading-relaxed">
          Un <strong>skill</strong> est un dossier d'instructions que Claude charge de lui-même
          quand votre demande le concerne. Celui-ci apprend à Claude à auditer et à rédiger du
          contenu web selon trois couches, qui dépendent l'une de l'autre :
        </p>
        <ol className="m-0 mt-8 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3">
          {LAYERS.map((l, i) => (
            <li
              key={l.tag}
              className="sheet tilt relative flex flex-col gap-2 p-6 pt-7"
              style={r(i % 2 ? "0.8deg" : "-0.8deg")}
            >
              <span aria-hidden="true" className="tape -top-2.5 left-6" style={r("-4deg")} />
              <span className="font-serif text-sm font-extrabold text-accent-ink">
                {i + 1} · {l.tag}
              </span>
              <h3 className="m-0 text-[23px] leading-tight">{l.title}</h3>
              <p className="m-0 text-[15.5px] leading-relaxed text-ink-soft">{l.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Contenu */}
      <Section id="contenu" title="Ce qu'il y a dans le skill">
        <ul className="m-0 grid list-none grid-cols-1 gap-x-10 gap-y-6 p-0 sm:grid-cols-2">
          {CONTENTS.map((c) => (
            <li key={c.file} className="border-l-2 border-accent/50 pl-5">
              <h3 className="m-0 text-[20px] leading-snug">{c.file}</h3>
              <p className="m-0 mt-1.5 text-[16px] leading-relaxed text-ink-soft">{c.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Fonctionnement */}
      <Section id="fonctionnement" kicker="pas à pas" title="Comment il fonctionne">
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

      {/* Avantages */}
      <section aria-labelledby="pourquoi" className="mt-16 border-y border-rule bg-paper-light">
        <div className="container-wide max-w-[880px] py-14">
          <p className="note m-0 -rotate-1 text-[24px]">pourquoi celui-ci</p>
          <h2 id="pourquoi" className="m-0 mt-1 text-[clamp(28px,3.2vw,38px)] leading-[1.1]">
            Ses avantages
          </h2>
          <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <li key={b.title} className="sheet p-5">
                <h3 className="m-0 text-[19px] leading-snug">{b.title}</h3>
                <p className="m-0 mt-1.5 text-[15.5px] leading-relaxed text-ink-soft">{b.text}</p>
              </li>
            ))}
            <li className="postit tilt flex flex-col justify-center p-6" style={r("1.2deg")}>
              <p className="m-0 font-serif text-[19px] leading-snug">
                Exemple réel : sur ce site, le sitemap ne listait que 6 pages sur 22. Aucun article
                n'était en faute, c'était le site. C'est devenu le contrôle S1 de la grille.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Utilisation */}
      <Section id="utiliser" title="Comment l'utiliser">
        <p className="m-0 max-w-[720px] text-[17px] leading-relaxed">
          <strong>Cinq minutes d'installation, aucune ligne de code.</strong> Ensuite, vous posez
          votre question en français, comme à un collègue : Claude reconnaît la demande et applique
          la méthode du skill de lui-même.
        </p>
        <div className="sheet relative mt-8 p-6 md:p-8" style={r("0.5deg")}>
          <span aria-hidden="true" className="tape -top-2.5 left-10" style={r("-3deg")} />
          <p className="note m-0 text-[24px]">livré avec le skill</p>
          <h3 className="m-0 mt-1 text-[22px] leading-tight">
            Un guide PDF de 10 pages, pas à pas
          </h3>
          <ul className="m-0 mt-4 flex list-disc flex-col gap-1.5 pl-5 text-[16.5px] leading-relaxed text-ink-soft marker:text-accent">
            <li>l'installation, écran par écran, dans Claude et dans Claude Code ;</li>
            <li>votre premier audit et la lecture du rapport ;</li>
            <li>cinq usages, avec des demandes prêtes à copier ;</li>
            <li>les réglages selon votre métier, la grille complète, le dépannage.</li>
          </ul>
        </div>
      </Section>

      {/* Compatibilité */}
      <Section
        id="secteurs"
        kicker="la vraie question"
        title="Fonctionne-t-il pour tous les métiers ?"
      >
        <p className="m-0 max-w-[720px] text-[17px] leading-relaxed">
          <strong>
            Oui : il audite du contenu, et tout site qui publie du contenu peut s'en servir.
          </strong>{" "}
          Au début de chaque audit, il identifie le secteur et ajoute les contrôles qui comptent
          pour lui.
        </p>
        <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2">
          {SECTORS.map((x) => (
            <li key={x.who} className="sheet p-5">
              <h3 className="m-0 text-[19px] leading-snug">{x.who}</h3>
              <p className="note m-0 mt-1 text-[19px]">ex. : {x.example}</p>
              <p className="m-0 mt-2 text-[15.5px] leading-relaxed text-ink-soft">{x.what}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="compatibilite" title="Avec quels outils fonctionne-t-il ?">
        <p className="m-0 max-w-[720px] text-[17px] leading-relaxed">
          <strong>
            Oui dans tout l'univers Claude, et le format est lu par la plupart des outils de code
            IA.
          </strong>{" "}
          Les assistants grand public hors Claude demandent une adaptation.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[15.5px]">
            <thead>
              <tr className="border-b-2 border-ink">
                <th className="py-2 pr-4 font-semibold">Outil</th>
                <th className="py-2 pr-4 font-semibold">Pris en charge</th>
                <th className="py-2 font-semibold">Comment</th>
              </tr>
            </thead>
            <tbody>
              {COMPAT.map((c) => (
                <tr key={c.where} className="border-b border-rule align-top">
                  <td className="py-3 pr-4 font-semibold">{c.where}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">{SUPPORT_LABEL[c.support]}</td>
                  <td className="py-3 text-ink-soft">{c.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="m-0 mt-3 text-[13.5px] text-ink-soft">
          Sources : centre d'aide Claude, « Use skills » ; recensement des outils compatibles
          SKILL.md, avril 2026. Vérifié en octobre 2026.
        </p>
      </Section>

      {/* Ce qu'il ne fait pas */}
      <Section id="limites" title="Ce que le skill ne fait pas">
        <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[17px] leading-relaxed marker:text-accent">
          <li>Il ne garantit ni une position sur Google, ni une citation par une IA.</li>
          <li>Il ne mesure pas votre trafic et n'accède pas à Search Console.</li>
          <li>Il ne publie rien sur votre site sans que vous le fassiez.</li>
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
            Le même outil que pour ce guide, dans votre Claude
          </h2>
          <p className="m-0 mt-3 text-[16.5px] leading-relaxed text-ink-soft">
            Un produit personnel de Matthieu, product builder à Nantes, sans lien avec l'École Cube.
            Pour en savoir plus sur moi, voir la page <Link to="/a-propos">à propos</Link>.
          </p>
          <BuyBox className="mt-6" />
        </div>
      </section>
    </PageFrame>
  );
}
