import { Link, createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { ForWho } from "@/components/for-who";
import { PageFrame } from "@/components/site/SiteChrome";
import {
  AUTHOR_REF,
  LINKEDIN_URL,
  ORGANIZATION_ID,
  SITE_URL,
  jsonLdScript,
  pageHead,
  siteEntitiesLd,
} from "@/lib/site";

const PATH = "/automatisation";

const EXEMPLES = [
  {
    title: "Devis et factures",
    text: "Relance automatique et personnalisée des devis non signés et des factures en retard.",
  },
  {
    title: "Nouveaux contacts",
    text: "Un formulaire rempli sur votre site crée la fiche dans votre tableau de suivi, vous prévient et envoie un e-mail de confirmation.",
  },
  {
    title: "Outils qui ne se parlent pas",
    text: "Fin des doubles saisies entre votre boîte mail, vos tableurs et votre CRM.",
  },
  {
    title: "Documents et rapports",
    text: "Devis, contrats ou synthèses de la semaine générés automatiquement en PDF.",
  },
];

const ETAPES = [
  {
    title: "Premier échange, offert",
    text: "On décortique votre tâche étape par étape : d'où part l'information, où elle doit arriver.",
  },
  {
    title: "Proposition et devis",
    text: "Un périmètre précis et un prix fixé à l'avance.",
  },
  {
    title: "Construction et tests",
    text: "Je crée les scénarios, avec Make ou n8n selon votre cas, et on les teste ensemble sur de vraies données.",
  },
  {
    title: "Mise en service",
    text: "Tout reste sur vos comptes et à votre nom. Vous recevez une explication du fonctionnement pour rester autonome.",
  },
];

const FAQ = [
  {
    q: "Faut-il changer tous mes outils pour automatiser ?",
    a: "Non. Le but est de connecter les outils que vous utilisez déjà (Gmail, Google Sheets, Airtable, Notion, votre CRM ou votre logiciel de facturation) plutôt que d'en ajouter de nouveaux.",
  },
  {
    q: "Que se passe-t-il si une automatisation tombe en panne ?",
    a: "Les scénarios sont construits avec des alertes d'erreur : vous êtes prévenu dès qu'une étape échoue, au lieu de le découvrir des semaines plus tard.",
  },
  {
    q: "Make ou n8n : lequel utilisez-vous ?",
    a: "Les deux, selon votre besoin, votre budget et l'endroit où vous voulez héberger vos données. Le choix est expliqué avant de commencer.",
  },
  {
    q: "Combien coûte une automatisation ?",
    a: "C'est sur devis, selon le nombre d'outils à relier et la complexité de la tâche. Le simulateur du site vous aide à estimer ce que la tâche vous coûte aujourd'hui, pour comparer.",
  },
];

export const Route = createFileRoute("/automatisation")({
  head: () => {
    const head = pageHead({
      title: "Automatiser une tâche de votre activité, sur devis",
      description:
        "Relances, saisies, e-mails, documents : j'automatise la tâche répétitive qui vous fait perdre du temps, avec les outils que vous utilisez déjà.",
      path: PATH,
    });
    return {
      ...head,
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${SITE_URL}${PATH}#service`,
          name: "Automatisation de tâches pour indépendants et PME",
          serviceType: "Automatisation no-code",
          description:
            "Identification d'une tâche répétitive et mise en place d'une automatisation connectée aux outils existants, avec Make ou n8n.",
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
  component: AutomatisationPage,
});

function Section({ id, kicker, title, children }: { id: string; kicker?: string; title: string; children: ReactNode }) {
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

function Cta() {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
      <Link to="/contact" search={{ besoin: "automatisation" }} className="btn-ink">
        Discuter de votre tâche
      </Link>
      <Link to="/simulateur-roi" className="btn-outline">
        Combien vous coûte cette tâche ?
      </Link>
    </div>
  );
}

function AutomatisationPage() {
  return (
    <PageFrame>
      <section className="container-wide max-w-[880px] pt-12 md:pt-16">
        <p className="note m-0 -rotate-2 text-[28px]">accompagnement sur mesure</p>
        <h1 className="mt-3 mb-6 text-[clamp(36px,5vw,58px)] leading-[1.05]">
          Automatiser une tâche qui vous fait perdre du temps chaque semaine
        </h1>
        <p className="m-0 max-w-[680px] text-xl leading-relaxed text-ink-soft">
          <strong className="text-ink">On repère ensemble la tâche répétitive qui freine votre activité,</strong>{" "}
          puis je construis l'automatisation qui la fait à votre place, connectée aux outils que vous
          utilisez déjà, sans empiler de nouveaux abonnements.
        </p>
        <Cta />
      </section>

      <ForWho
        id="pour-qui"
        kicker="pour qui"
        title="Est-ce fait pour vous ?"
        yes={[
          "Vous perdez du temps chaque semaine sur des tâches manuelles : copier-coller, ressaisies, relances, exports.",
          "Vous utilisez déjà des outils (Airtable, Notion, Google Sheets, Gmail, CRM, facturation) qui ne se parlent pas.",
          "Vous voulez une solution fiable et expliquée, sans apprendre à coder.",
        ]}
        no={[
          "Votre façon de travailler change encore toutes les semaines : mieux vaut d'abord la stabiliser à la main.",
          "Vous cherchez un logiciel sur mesure complet, type ERP.",
        ]}
      />

      <Section id="exemples" kicker="exemples" title="Quelles tâches peut-on automatiser ?">
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2">
          {EXEMPLES.map((e) => (
            <li key={e.title} className="sheet p-6">
              <h3 className="m-0 text-[21px]">{e.title}</h3>
              <p className="m-0 mt-2 text-[16px] leading-relaxed text-ink-soft">{e.text}</p>
            </li>
          ))}
        </ul>
        <aside className="postit relative mt-10 rotate-1 rounded-sm p-6 md:p-7">
          <span className="tape -top-3 left-8" aria-hidden="true" />
          <p className="note m-0 text-[24px]">avant de me contacter</p>
          <p className="m-0 mt-2 text-[17px] leading-relaxed text-ink">
            Curieux de savoir ce que vous coûte cette tâche sur une année ? Faites le calcul en
            quelques minutes avec le <Link to="/simulateur-roi">simulateur gratuit</Link>.
          </p>
        </aside>
      </Section>

      <Section id="deroule" kicker="déroulé" title="Comment se passe l'accompagnement ?">
        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {ETAPES.map((s, i) => (
            <li key={s.title} className="sheet flex gap-4 p-5">
              <span className="note text-[28px] text-accent-ink" aria-hidden="true">{i + 1}</span>
              <div>
                <h3 className="m-0 text-[20px]">{s.title}</h3>
                <p className="m-0 mt-1 text-[16px] leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="qui" kicker="qui suis-je" title="Pourquoi me confier votre automatisation ?">
        <div className="prose-article">
          <p>
            Je suis responsable commercial en entreprise et product builder certifié no-code et IA
            (RNCP niveau 6). Les automatisations que je propose, je les ai d'abord construites et
            utilisées au quotidien avec mon équipe.{" "}
            <Link to="/realisations" hash="en-entreprise">Voir ce que j'ai automatisé en entreprise</Link>.
          </p>
          <p>
            Vous hésitez entre deux outils ? Mon comparatif{" "}
            <Link to="/$slug" params={{ slug: "n8n-ou-make" }}>n8n ou Make</Link> détaille leurs
            différences.
          </p>
        </div>
      </Section>

      <Section id="faq" kicker="questions" title="Questions fréquentes">
        <div className="flex flex-col gap-3">
          {FAQ.map((f) => (
            <details key={f.q} className="sheet p-5">
              <summary className="cursor-pointer text-[18px] font-semibold">{f.q}</summary>
              <p className="m-0 mt-3 text-[16px] leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <section className="container-wide max-w-[880px] pt-16 pb-20">
        <p className="m-0 text-[17px] leading-relaxed">
          Écrivez-moi à <a href="mailto:contact@optimatt.fr">contact@optimatt.fr</a>, sur{" "}
          <a href={LINKEDIN_URL} target="_blank" rel="noopener">LinkedIn</a>, ou via le formulaire.
        </p>
        <Cta />
      </section>
    </PageFrame>
  );
}
