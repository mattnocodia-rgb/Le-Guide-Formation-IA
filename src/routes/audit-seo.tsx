import { Link, createFileRoute } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";

import { PageFrame } from "@/components/site/SiteChrome";
import { contactHref } from "@/lib/boutique";
import { getShopOffers } from "@/lib/content.functions";
import {
  AUTHOR_REF,
  ORGANIZATION_ID,
  SITE_NAME,
  SITE_URL,
  SKILL_NAME,
  jsonLdScript,
  pageHead,
  siteEntitiesLd,
} from "@/lib/site";

const PATH = "/audit-seo";
const r = (deg: string) => ({ "--r": deg }) as CSSProperties;

/** The 7 areas of the report, as in the audit of this very site. */
const AREAS = [
  {
    title: "Technique",
    text: "Votre site peut-il être lu par Google et les IA ? Sitemap, robots, pages en erreur, redirections, sécurité.",
  },
  {
    title: "Contenu",
    text: "Vos pages répondent-elles vraiment aux questions de vos clients ? Auteur identifié, sources, expérience vécue.",
  },
  {
    title: "Titres et descriptions",
    text: "Ce que Google affiche de vous dans ses résultats : titres, descriptions, intertitres, liens entre vos pages.",
  },
  {
    title: "Données structurées",
    text: "Les informations cachées qui disent à Google et aux IA qui vous êtes, ce que vous vendez et où vous êtes.",
  },
  {
    title: "Vitesse",
    text: "Le temps d'affichage sur téléphone, mesuré avec les outils de Google.",
  },
  {
    title: "Préparation aux IA",
    text: "ChatGPT, Perplexity ou les réponses IA de Google peuvent-ils lire, comprendre et citer votre site ?",
  },
  {
    title: "Images",
    text: "Poids, descriptions, formats : ce qui ralentit le site ou le rend illisible pour les moteurs.",
  },
];

const STEPS = [
  {
    title: "Vous commandez",
    text: "Et vous m'indiquez l'adresse de votre site. Si vous le souhaitez, vous me donnez un accès en lecture à votre Search Console pour que le rapport s'appuie sur vos vrais chiffres de visites.",
  },
  {
    title: "J'audite",
    text: "Chaque page, puis le site dans son ensemble : technique, contenu, vitesse, lisibilité par les IA.",
  },
  {
    title: "Vous recevez le rapport",
    text: "Un PDF avec une note sur 100, les problèmes classés par gravité et un plan d'action en quatre étapes.",
  },
  {
    title: "On en parle en visio",
    text: "45 minutes pour passer le rapport en revue, répondre à vos questions et décider par quoi commencer.",
  },
];

/** What the audit of this site found, and what was done about it. */
const CASE = [
  "L'auteur n'était pas identifiable : nom, photo et profil ajoutés partout",
  "Le domaine principal renvoyait vers une page cassée : redirigé",
  "Les pages se chargeaient lentement sur mobile : polices allégées, images compressées",
  "Bing et ChatGPT n'étaient pas prévenus des nouveaux articles : envoi automatique mis en place",
  "Les liens entre articles se répétaient : chaque article propose désormais ses propres suggestions",
];

const FAQ = [
  {
    q: "Qu'est-ce qu'un audit SEO, AEO et GEO ?",
    a: "C'est une vérification complète de votre site sur trois niveaux : être trouvé sur Google (SEO), être compris par les moteurs de réponse comme ChatGPT (AEO), et être choisi et cité par une IA plutôt qu'un concurrent (GEO). Le rapport dit ce qui bloque et quoi corriger en premier.",
  },
  {
    q: "À qui s'adresse cet audit ?",
    a: "À tout site qui veut être trouvé : artisan, indépendant, cabinet, PME, organisme de formation, site de contenu. Il n'y a pas besoin de connaissances techniques : le rapport est écrit pour être compris, et la visio sert à l'expliquer.",
  },
  {
    q: "Quelle différence avec le skill Claude vendu dans la boutique ?",
    a: `Le skill « ${SKILL_NAME} » sert surtout à écrire vous-même, dans Claude, des articles de blog qui seront trouvés et cités. L'audit, c'est moi qui le fais sur l'ensemble de votre site : technique, vitesse, données structurées, lisibilité par les IA, avec un rapport et une visio pour vous l'expliquer.`,
  },
  {
    q: "Les corrections sont-elles comprises ?",
    a: "Non : l'audit dit quoi corriger et dans quel ordre. Vous pouvez faire les corrections vous-même, les confier à votre prestataire, ou me les confier sur devis.",
  },
  {
    q: "Garantissez-vous une première place sur Google ou une citation par ChatGPT ?",
    a: "Non, personne ne peut le garantir. L'audit vérifie que votre site remplit les conditions pour être trouvé, compris et cité, et classe les corrections par impact.",
  },
];

export const Route = createFileRoute("/audit-seo")({
  // Audit and skill offers: the page also sells the do-it-yourself option (skill + PDF tutorial).
  loader: () => getShopOffers(),
  head: () => {
    const head = pageHead({
      title: "Audit SEO de votre site pour Google et ChatGPT",
      description:
        "Je vérifie votre site pour Google et les IA comme ChatGPT : rapport noté sur 100, problèmes classés par gravité, plan d'action, et 45 minutes de visio.",
      path: PATH,
    });
    return {
      ...head,
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${SITE_URL}${PATH}#service`,
          name: "Audit SEO, AEO et GEO de site web",
          serviceType: "Audit SEO",
          description:
            "Audit d'un site web pour Google et les moteurs de réponse IA : rapport noté sur 100, constats par gravité, plan d'action et visio de restitution.",
          provider: AUTHOR_REF,
          brand: { "@id": ORGANIZATION_ID },
          areaServed: "FR",
          url: `${SITE_URL}${PATH}`,
        }),
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: `${SITE_URL}${PATH}`,
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
        jsonLdScript({ "@context": "https://schema.org", "@graph": siteEntitiesLd() }),
      ],
    };
  },
  component: AuditPage,
});

function OrderBox({ className = "" }: { className?: string }) {
  const { price, buyUrl } = Route.useLoaderData().audit;
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${className}`}>
      {buyUrl ? (
        <a href={buyUrl} rel="noopener" target="_blank" className="btn-ink">
          Commander l'audit{price ? ` — ${price}` : ""}
        </a>
      ) : (
        <a href={contactHref("Demande d'audit de mon site")} className="btn-ink">
          Demander un audit{price ? ` — ${price}` : ""}
        </a>
      )}
      <span className="text-[15px] text-ink-soft">
        Rapport PDF + 45 min de visio
        {buyUrl ? " · paiement sécurisé par Stripe" : ""} ·{" "}
        <Link to="/conditions-de-vente">conditions de vente</Link>
      </span>
    </div>
  );
}

/** « Do it yourself » box: buy the skill and its step-by-step PDF tutorial directly. */
function DiyBox() {
  const { price, buyUrl } = Route.useLoaderData().skill;
  return (
    <aside
      aria-labelledby="seul"
      className="postit tilt relative mt-12 max-w-[760px] p-6 md:p-8"
      style={r("-0.6deg")}
    >
      <p className="note m-0 text-[24px]">vous préférez le faire vous-même ?</p>
      <h2 id="seul" className="m-0 mt-1 text-[clamp(22px,2.4vw,28px)] leading-tight">
        Faites l'audit seul, avec le skill et son tuto pas à pas
      </h2>
      <p className="m-0 mt-3 text-[16.5px] leading-relaxed">
        Si vous utilisez déjà Claude et que vous avez quelques bases, vous pouvez lancer l'audit
        vous-même. Vous recevez le skill d'audit et de rédaction que j'ai construit, avec un
        tutoriel PDF qui détaille chaque étape, écran par écran : l'installation dans Claude, votre
        premier audit, puis la lecture du rapport et la rédaction de vos articles.
      </p>
      <ul className="m-0 mt-3 flex list-disc flex-col gap-1 pl-5 text-[15.5px] leading-relaxed marker:text-accent">
        <li>Le skill, à installer en quelques minutes, sans code</li>
        <li>Le tutoriel pas à pas de 12 pages, avec des demandes prêtes à copier</li>
        <li>Acheté une fois, sans abonnement</li>
      </ul>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        {buyUrl ? (
          <a href={buyUrl} rel="noopener" target="_blank" className="btn-ink">
            Acheter le skill et le tuto{price ? ` — ${price}` : ""}
          </a>
        ) : null}
        <Link to="/skill-seo-aeo-geo" className="py-2 font-semibold">
          Voir le détail du skill →
        </Link>
      </div>
      <p className="m-0 mt-3 text-[13.5px] text-ink-soft">
        Ce que l'audit fait pour vous en plus : la vitesse, le code, les données structurées, et une
        visio pour vous expliquer quoi faire en premier.
      </p>
    </aside>
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

function AuditPage() {
  return (
    <PageFrame>
      {/* Hero */}
      <section className="container-wide max-w-[880px] pt-12 md:pt-16">
        <p className="note m-0 -rotate-2 text-[28px]">audit fait pour vous</p>
        <h1 className="mt-3 mb-6 text-[clamp(36px,5vw,58px)] leading-[1.05]">
          Je vérifie votre site pour Google et ChatGPT
        </h1>
        <p className="m-0 max-w-[680px] text-xl leading-relaxed text-ink-soft">
          Vos clients vous cherchent sur Google, et de plus en plus en posant la question à ChatGPT.
          Cet audit SEO, AEO et GEO vous dit si votre site peut y apparaître, ce qui bloque, et quoi
          corriger en premier. Vous recevez un rapport écrit, puis on le passe en revue ensemble en
          visio.
        </p>
        <OrderBox className="mt-8" />
        <DiyBox />
      </section>

      {/* Ce qui est vérifié */}
      <Section id="verifie" kicker="7 domaines" title="Qu'est-ce que je vérifie ?">
        <p className="m-0 max-w-[720px] text-[17px] leading-relaxed">
          <strong>Tout ce qui décide si votre site est trouvé, compris et cité.</strong> Chaque
          domaine reçoit une note, et l'ensemble donne une note sur 100.
        </p>
        <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2">
          {AREAS.map((a, i) => (
            <li key={a.title} className="sheet p-5">
              <span className="font-serif text-sm font-extrabold text-accent-ink">{i + 1}</span>
              <h3 className="m-0 text-[19px] leading-snug">{a.title}</h3>
              <p className="m-0 mt-1.5 text-[15.5px] leading-relaxed text-ink-soft">{a.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Déroulé */}
      <Section id="deroule" kicker="en quatre temps" title="Comment se passe l'audit ?">
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

      {/* Ce que vous recevez */}
      <Section id="livrable" title="Que contient le rapport ?">
        <div className="sheet relative p-6 md:p-8" style={r("0.5deg")}>
          <span aria-hidden="true" className="tape -top-2.5 left-10" style={r("-3deg")} />
          <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[16.5px] leading-relaxed text-ink-soft marker:text-accent">
            <li>
              <strong className="text-ink">Une note sur 100</strong>, et une note par domaine ;
            </li>
            <li>
              <strong className="text-ink">les problèmes les plus urgents</strong>, et les
              corrections rapides à faire tout de suite ;
            </li>
            <li>
              <strong className="text-ink">chaque constat classé par gravité</strong>, avec ce qu'il
              faut faire pour le corriger ;
            </li>
            <li>
              <strong className="text-ink">un plan d'action en quatre étapes</strong> : les
              corrections urgentes, les améliorations à fort impact, le contenu, puis le suivi ;
            </li>
            <li>
              <strong className="text-ink">les sources des mesures</strong> : outils de Google
              (PageSpeed Insights, données réelles des visiteurs Chrome) et, si vous m'y donnez
              accès, votre Search Console.
            </li>
          </ul>
        </div>
      </Section>

      {/* Cas réel */}
      <section aria-labelledby="exemple" className="mt-16 border-y border-rule bg-paper-light">
        <div className="container-wide max-w-[880px] py-14">
          <p className="note m-0 -rotate-1 text-[24px]">exemple réel</p>
          <h2 id="exemple" className="m-0 mt-1 text-[clamp(28px,3.2vw,38px)] leading-[1.1]">
            Ce site est passé par le même audit
          </h2>
          <p className="m-0 mt-4 max-w-[720px] text-[17px] leading-relaxed">
            En novembre 2026, ce guide a obtenu <strong>79 sur 100</strong>. Voici une partie de ce
            que le rapport a relevé, et ce qui a été corrigé dans la foulée :
          </p>
          <ul className="m-0 mt-6 flex list-disc flex-col gap-1.5 pl-5 text-[16.5px] leading-relaxed marker:text-accent">
            {CASE.map((c) => (
              <li key={c}>{c}.</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pour qui */}
      <Section id="pour-qui" title="Pour qui est cet audit ?">
        <p className="m-0 max-w-[720px] text-[17px] leading-relaxed">
          <strong>
            Pour tout site qui doit être trouvé, sans besoin de connaissances techniques.
          </strong>{" "}
          Artisan, indépendant, cabinet, PME, organisme de formation, site de contenu : le rapport
          adapte ses contrôles à votre activité. Pour une activité locale, il liste aussi ce qui se
          joue hors du site, comme votre fiche Google et vos avis.
        </p>
      </Section>

      {/* Limites */}
      <Section id="limites" title="Ce que l'audit ne fait pas">
        <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[17px] leading-relaxed marker:text-accent">
          <li>Il ne garantit ni une position sur Google, ni une citation par une IA.</li>
          <li>
            Il ne comprend pas les corrections : vous les faites, votre prestataire les fait, ou je
            les fais sur devis.
          </li>
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
            Savoir enfin ce qui bloque votre site
          </h2>
          <p className="m-0 mt-3 text-[16.5px] leading-relaxed text-ink-soft">
            Un service de Matthieu Audineau, product builder à Nantes, sans lien avec l'École Cube.
            Pour en savoir plus sur moi, voir la page <Link to="/a-propos">à propos</Link>.
          </p>
          <OrderBox className="mt-6" />
        </div>
      </section>
    </PageFrame>
  );
}
