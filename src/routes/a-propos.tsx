import { Link, createFileRoute } from "@tanstack/react-router";
import type { CSSProperties } from "react";

import { LinkedInIcon } from "@/components/site/Cards";
import { PageFrame } from "@/components/site/SiteChrome";
import { LINKEDIN_URL, SITE_NAME, SITE_URL, authorLd, jsonLdScript, pageHead } from "@/lib/site";

const BOOTCAMP_SLUG = "bootcamp-product-builder-retour-experience";
const ENDO_URL = "https://endo-serenite.fr/";
const REVIEW_URL = "https://fr.trustpilot.com/reviews/68d7a405379163b7d131d7c9";

const r = (deg: string) => ({ "--r": deg }) as CSSProperties;

type Step = { when: string; role: string; points: string[] };

/** Career path, most recent first. Employers are deliberately not named. */
const PARCOURS: Step[] = [
  {
    when: "Depuis octobre 2025",
    role: "Product builder No-Code & IA",
    points: [
      "Transformer des besoins métiers flous en sites web, applications et automatisations",
      "Automatisations complexes (certifié Make Advanced), du cadrage à la livraison",
    ],
  },
  {
    when: "Depuis 2018",
    role: "Responsable commercial",
    points: [
      "Prospection, démonstrations et négociation face à des experts métier",
      "Gestion autonome d'un secteur : portefeuille clients, suivi, fidélisation",
      "Accompagnement au changement : adoption du BIM, formation et suivi des clients",
      "Webinars : rendre un sujet technique accessible à un public professionnel",
    ],
  },
  {
    when: "2017 – 2018",
    role: "Technico-commercial, partenaires internationaux",
    points: [
      "Démonstrations sur site, vente et suivi client",
      "Formation de partenaires étrangers, en français et en anglais",
    ],
  },
  {
    when: "2011 – 2017",
    role: "Formateur et consultant technique, logiciels de topographie et de BTP",
    points: [
      "Formations et assistance à projet chez les clients, en français et en anglais",
      "Conception de contenus e-learning",
      "Formation de partenaires et de formateurs à l'étranger",
    ],
  },
];

type Module = { tool: string; learned: string; note?: string };

/** The bootcamp modules, in the order they were taught, with what each one brought. */
const MODULES: Module[] = [
  {
    tool: "Framer",
    learned: "Architecturer et publier un site web, le rendre lisible sur mobile, gérer un CMS.",
    note: "mon premier site, fait à la main sur Framer, une semaine après le bootcamp",
  },
  {
    tool: "Airtable",
    learned: "Passer du tableur à la base de données : structurer, relier, créer des interfaces.",
  },
  {
    tool: "Make",
    learned: "Automatiser : déclencheurs, conditions, gestion des erreurs, JSON, webhooks, IA.",
  },
  {
    tool: "Bubble",
    learned: "Construire une vraie application : données, workflows, utilisateurs, API.",
    note: "je ne l'utilise plus, mais il m'a appris comment se façonne une application",
  },
  {
    tool: "Sécurité",
    learned: "Repérer les failles, protéger les données personnelles, réagir à un incident.",
  },
  {
    tool: "Gestion de produit",
    learned: "Clarifier un besoin, prioriser (impact contre coût), choisir l'outil, maquetter.",
    note: "la méthode : c'est elle qui reste quand les outils changent",
  },
  {
    tool: "n8n",
    learned: "Automatiser sans limite : héberger soi-même, transformer les données, fiabiliser.",
    note: "devenu mon meilleur ami",
  },
];

type Usage = { title: string; points: string[] };

const AUJOURDHUI: Usage[] = [
  {
    title: "J'automatise avec n8n",
    points: [
      "publication sur les réseaux sociaux",
      "prospection à partir de Google Maps",
      "un moteur d'analyse nutritionnelle",
      "mises à jour groupées de bases de données",
    ],
  },
  {
    title: "Je crée avec Claude",
    points: ["des sites web, dont ce guide", "des tableaux de bord de suivi avec PostHog"],
  },
  {
    title: "Je vends autrement",
    points: [
      "leads créés et notés automatiquement",
      "relances automatiques",
      "un CRM qui se remplit seul : rendez-vous, leads, contacts",
    ],
  },
];

export const Route = createFileRoute("/a-propos")({
  head: () => {
    const head = pageHead({
      title: `À propos : commercial et product builder — ${SITE_NAME}`,
      description:
        "Ingénieur BTP de formation, commercial et product builder No-Code & IA : mon parcours, ce que l'École Cube m'a appris, ce que j'en fais aujourd'hui et comment ce guide est écrit.",
      path: "/a-propos",
    });
    return {
      ...head,
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: `${SITE_URL}/a-propos`,
          mainEntity: authorLd(),
        }),
      ],
    };
  },
  component: About,
});

function About() {
  return (
    <PageFrame>
      {/* Intro */}
      <section className="container-wide max-w-[780px] pt-12 md:pt-16">
        <p className="note m-0 -rotate-2 text-[28px]">à propos</p>
        <h1 className="mt-3 mb-8 text-[clamp(36px,5vw,56px)] leading-[1.05]">
          Un guide écrit depuis le terrain
        </h1>
        <div className="prose-article">
          <p>
            Je m'appelle Matthieu. Ingénieur BTP de formation et commercial expérimenté, j'ai
            développé une passion pour les technologies qui permettent de construire, d'innover et
            d'optimiser.
          </p>
          <p>
            L'École Cube m'a ouvert les portes d'un monde que je n'aurais jamais imaginé explorer.
            Je suis aujourd'hui certifié <strong>Product Builder No-Code &amp; IA</strong> (titre
            RNCP niveau 6) : je transforme des besoins métiers en sites web, outils internes et
            automatisations.
          </p>
          <p>
            Ma valeur ajoutée, c'est un profil hybride. Commercial, je sais comprendre les enjeux
            business et transformer un besoin en solution concrète. Product builder, je sais
            construire cette solution moi-même. Ce guide rassemble ce que j'aurais aimé lire avant
            de me lancer. Je ne vends pas de formation.
          </p>
        </div>
      </section>

      {/* Parcours */}
      <section aria-labelledby="parcours" className="container-wide max-w-[780px] pt-14">
        <h2 id="parcours" className="m-0 text-[clamp(28px,3.2vw,38px)] leading-[1.1]">
          Mon parcours
        </h2>
        <ol className="m-0 mt-8 list-none border-l-2 border-accent/40 p-0 pl-6 md:pl-8">
          {PARCOURS.map((s) => (
            <li key={s.role} className="relative pb-9 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute top-2 -left-[33px] h-4 w-4 rounded-full border-2 border-accent bg-paper md:-left-[41px]"
              />
              <p className="note m-0 text-[22px]">{s.when}</p>
              <h3 className="m-0 mt-1 text-[21px] leading-snug md:text-[23px]">{s.role}</h3>
              <ul className="m-0 mt-3 flex list-disc flex-col gap-1.5 pl-5 text-[17px] leading-relaxed text-ink-soft marker:text-accent">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </li>
          ))}
          <li className="relative">
            <span
              aria-hidden="true"
              className="absolute top-2 -left-[33px] h-4 w-4 rounded-full bg-accent md:-left-[41px]"
            />
            <p className="note m-0 text-[22px]">formation</p>
            <h3 className="m-0 mt-1 text-[21px] leading-snug md:text-[23px]">
              Ingénieur BTP, puis certifié Product Builder No-Code &amp; IA
            </h3>
            <p className="m-0 mt-2 text-[17px] text-ink-soft">
              École Cube, titre RNCP niveau 6. Certifié Make Advanced.
            </p>
          </li>
        </ol>
      </section>

      {/* Frise Cube */}
      <section aria-labelledby="ecole" className="mt-16 border-y border-rule bg-paper-light">
        <div className="container-wide py-14 md:py-16">
          <div className="max-w-[780px]">
            <p className="note m-0 -rotate-1 text-[26px]">
              été 2025 : 9 semaines, 7 modules, 1 méthode
            </p>
            <h2 id="ecole" className="m-0 mt-2 text-[clamp(28px,3.2vw,38px)] leading-[1.1]">
              Ce que l'École Cube m'a appris
            </h2>
            <p className="m-0 mt-4 text-lg leading-relaxed text-ink-soft">
              Mon bootcamp, en juillet-août 2025 : 9 semaines à temps complet, des cas concrets à
              chaque module, puis un projet professionnel construit de bout en bout. Beaucoup de
              choses ont changé depuis dans l'approche, et je n'utilise plus certains outils. Mais
              chacun m'a appris quelque chose qui reste : l'école forme à la méthode, les outils
              font le reste.
            </p>
          </div>
          <ol className="m-0 mt-10 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((m, i) => (
              <li
                key={m.tool}
                className="sheet tilt relative flex flex-col gap-2 p-5 pt-6"
                style={r(i % 2 ? "0.8deg" : "-0.8deg")}
              >
                <span aria-hidden="true" className="tape -top-2.5 left-6" style={r("-4deg")} />
                <span className="font-serif text-sm font-extrabold text-accent-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="m-0 text-[22px] leading-tight">{m.tool}</h3>
                <p className="m-0 text-[15.5px] leading-relaxed text-ink-soft">{m.learned}</p>
                {m.note ? <p className="note m-0 mt-auto pt-2 text-[20px]">→ {m.note}</p> : null}
              </li>
            ))}
            <li className="postit tilt flex flex-col justify-center gap-3 p-6" style={r("1.5deg")}>
              <p className="m-0 font-serif text-[19px] leading-snug">
                « Le bagage technique est une chose, mais le bagage autour, sur la sécurité et le
                product management, était très juste également. »
              </p>
              <a
                href={REVIEW_URL}
                rel="noopener"
                target="_blank"
                className="text-sm font-semibold text-ink underline underline-offset-4"
              >
                Mon avis complet sur Trustpilot
              </a>
            </li>
          </ol>
          <p className="m-0 mt-10">
            <Link to="/$slug" params={{ slug: BOOTCAMP_SLUG }} className="btn-ink">
              Lire mon retour sur le bootcamp
            </Link>
          </p>
        </div>
      </section>

      {/* Aujourd'hui */}
      <section aria-labelledby="aujourdhui" className="container-wide pt-14 md:pt-16">
        <h2
          id="aujourdhui"
          className="m-0 max-w-[780px] text-[clamp(28px,3.2vw,38px)] leading-[1.1]"
        >
          Ce que j'en fais aujourd'hui
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {AUJOURDHUI.map((u) => (
            <div key={u.title} className="lined p-6 pl-14 shadow-[var(--shadow-card)]">
              <h3 className="m-0 text-[21px] leading-tight">{u.title}</h3>
              <ul className="m-0 mt-3 flex list-none flex-col gap-1 p-0 text-[16.5px] leading-[34px]">
                {u.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="m-0 mt-6 max-w-[780px] text-[17px] leading-relaxed text-ink-soft">
          C'est tout l'intérêt d'un profil hybride : ces automatisations, je les applique aussi à
          mon métier de commercial.
        </p>
      </section>

      {/* Projet personnel */}
      <section aria-labelledby="endo" className="container-wide max-w-[780px] pt-14 md:pt-16">
        <div className="sheet relative p-6 md:p-8" style={r("-0.5deg")}>
          <span
            aria-hidden="true"
            className="tape tape-yellow -top-2.5 right-10"
            style={r("3deg")}
          />
          <p className="note m-0 text-[22px]">mon projet personnel</p>
          <h2 id="endo" className="m-0 mt-1 text-[clamp(24px,2.8vw,32px)] leading-tight">
            Endo-sérénité
          </h2>
          <p className="m-0 mt-3 text-[17px] leading-relaxed text-ink-soft">
            J'ai mis ce nouveau savoir au service d'un projet qui me tient à cœur, né d'un besoin
            réel observé dans mon entourage. Endo-sérénité est une application web qui analyse
            chaque repas selon 5 indicateurs nutritionnels : inflammation, confort digestif,
            énergie, microbiote et stress métabolique. Elle aide les femmes atteintes d'endométriose
            à comprendre l'impact de leur assiette sur leurs symptômes.
          </p>
          <a
            href={ENDO_URL}
            rel="noopener"
            target="_blank"
            className="btn-outline mt-5 text-[15px]"
          >
            Découvrir Endo-sérénité
          </a>
        </div>
      </section>

      {/* Ligne éditoriale & transparence */}
      <article className="container-wide max-w-[780px] py-14 md:py-16">
        <div className="prose-article">
          <h2 id="ligne-editoriale">Ma ligne éditoriale</h2>
          <ul>
            <li>Des guides pratiques, écrits pour des personnes qui ne sont pas développeuses.</li>
            <li>Chaque chiffre est sourcé, et chaque article affiche sa date de mise à jour.</li>
            <li>
              Quand je parle de mon expérience, ce sont mes vrais chiffres, jamais des témoignages
              inventés.
            </li>
          </ul>
          <h2 id="independance">Un site indépendant</h2>
          <p>
            J'ai créé ce site de ma propre initiative. Il est totalement indépendant de l'École Cube
            : ce n'est pas un site officiel de l'école, qui n'intervient ni dans le choix des sujets
            ni dans la rédaction des articles. Les avis exprimés ici sont les miens.
          </p>
          <h2 id="liens-partenaires">Les liens partenaires</h2>
          <p>
            Je suis ambassadeur de l'École Cube. Certains liens de ce site sont des liens
            partenaires : si vous vous inscrivez à une formation via l'un d'eux, je perçois une
            commission, sans surcoût pour vous. Ils sont signalés comme tels dans chaque article. Je
            ne vends pas de formation moi-même.
          </p>
        </div>
        <a
          href={LINKEDIN_URL}
          rel="noopener me"
          target="_blank"
          className="btn-outline mt-10 text-[15px]"
        >
          <LinkedInIcon />
          Mon profil LinkedIn
        </a>
      </article>
    </PageFrame>
  );
}
