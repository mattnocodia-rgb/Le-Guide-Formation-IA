import { Link, createFileRoute } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";

import { ForWho } from "@/components/for-who";
import { PageFrame } from "@/components/site/SiteChrome";
import {
  AUTHOR_REF,
  ORGANIZATION_ID,
  SITE_URL,
  jsonLdScript,
  pageHead,
  siteEntitiesLd,
} from "@/lib/site";

const PATH = "/creation-site-web";
const IMG = "/img/site-web";
const r = (deg: string) => ({ "--r": deg }) as CSSProperties;

/* Same sequence as the presentation deck: hook, trades, who I am, my own projects,
   what happens next, prices, SEO/AEO/GEO, bonus, timeline, next steps (+ FAQ for search). */

const DEMOS = [
  {
    img: `${IMG}/demo-batiment.webp`,
    alt: "Site de démonstration d'un plâtrier : plan d'architecte dessiné à côté du titre",
    title: "Artisan du bâtiment",
    text: "Un plâtrier fictif à Bouguenais : un plan d'architecte se dessine à côté de ses prestations.",
  },
  {
    img: `${IMG}/demo-bien-etre.webp`,
    alt: "Site de démonstration d'une sophrologue : titre apaisant et prise de rendez-vous en ligne",
    title: "Praticienne du bien-être",
    text: "Une sophrologue fictive à Rezé : un exercice de respiration guidé dès l'accueil.",
  },
];

const CASQUETTES = [
  {
    title: "L'ingénieur",
    text: "De la méthode et de la rigueur : un site solide, livré dans les temps.",
  },
  {
    title: "Le formateur",
    text: "Des années à former des artisans et des entreprises à leurs logiciels métier. Je vous apprends à vous servir de votre site sans jargon, promis.",
  },
  {
    title: "Le product builder",
    text: "Certifié no-code et IA (RNCP niveau 6). Je teste tout sur mes propres projets avant de vous le proposer.",
  },
];

const SUITE = [
  {
    title: "Il vous plaît",
    text: "On signe et je lance la finalisation.",
    tone: "bg-ink text-paper",
  },
  {
    title: "Quelques retouches",
    text: "Vous les notez directement sur la maquette, avec le bouton « Modifier mon site ». Je les fais et je vous renvoie le lien.",
    tone: "bg-paper-light text-ink",
  },
  {
    title: "Pas pour l'instant",
    text: "Aucun engagement : je supprime la maquette.",
    tone: "bg-paper-light text-ink",
  },
];

const FORMULES = [
  {
    name: "Site vitrine",
    price: "690 €",
    items: [
      "Votre site finalisé avec vos contenus",
      "En ligne sur votre nom de domaine",
      "Comptes créés à votre nom",
      "Formation d'1 heure et fiche mémo",
    ],
    note: "Suffit à la plupart des artisans et commerçants.",
  },
  {
    name: "Site + espace d'administration",
    price: "990 €",
    items: [
      "Tout le site vitrine",
      "Vous modifiez textes, tarifs et photos",
      "Un blog guidé pour Google et les IA (SEO, AEO, GEO)",
      "Bonus : rédacteur d'articles",
      "Formation de 2 heures",
    ],
    note: "Pour ceux qui veulent publier des articles : praticiens, gîtes, artisans qui montrent leur savoir-faire.",
  },
];

const PILIERS = [
  {
    tag: "SEO",
    title: "Trouvé sur Google",
    text: "Titres, descriptions, plan du site, une adresse propre par article.",
  },
  {
    tag: "AEO",
    title: "Compris par les IA",
    text: "Chaque article répond à une question, avec une FAQ que ChatGPT ou Google reprennent.",
  },
  {
    tag: "GEO",
    title: "Recommandé par les IA",
    text: "Votre nom relié à votre métier et à votre ville, partout de la même façon.",
  },
];

const ETAPES = [
  { title: "On signe", text: "Vous choisissez votre formule. Acompte de 30 %." },
  { title: "Vos contenus", text: "Photos, horaires, tarifs. Version finale sous 7 jours." },
  {
    title: "Mise en ligne",
    text: "1 heure ensemble : nom de domaine, hébergement, tout à votre nom.",
  },
  {
    title: "Formation",
    text: "1 h ou 2 h sur votre site. Je retire mes accès, vous réglez le solde.",
  },
];

const FAQ = [
  {
    q: "Et si la maquette ne me plaît pas ?",
    a: "Vous ne payez rien. La maquette est gratuite et ne vous engage à rien. Vous pouvez aussi la corriger avec le bouton « Modifier mon site » jusqu'à ce qu'elle vous ressemble.",
  },
  {
    q: "Faut-il des compétences techniques ?",
    a: "Non. Vous corrigez votre maquette en cliquant sur les textes, et la mise en ligne se fait avec moi, pendant la séance de formation.",
  },
  {
    q: "Que se passe-t-il si je ne travaille plus avec vous ?",
    a: "Rien ne change pour votre site. Le nom de domaine, l'hébergement et le code sont à votre nom depuis le premier jour : vous gardez tout, sans frais de sortie.",
  },
  {
    q: "Puis-je modifier mon site moi-même après la mise en ligne ?",
    a: "Oui avec la formule à 990 € : un espace d'administration simple vous permet de changer vos textes, vos tarifs, vos photos et d'écrire des articles. Avec le site vitrine, je fais les modifications pour vous, au besoin à 45 € de l'heure.",
  },
  {
    q: "J'ai déjà une page Google et un Facebook, à quoi sert un site ?",
    a: "Votre fiche Google et vos réseaux appartiennent à ces plateformes. Un site à votre nom présente tous vos services, rassure les clients qui comparent, reçoit leurs demandes de devis et peut être cité par les assistants IA quand on leur demande un professionnel près de chez soi.",
  },
];

export const Route = createFileRoute("/creation-site-web")({
  head: () => {
    const head = pageHead({
      title: "Création de site web pour artisans et TPE, près de Nantes",
      description:
        "Je prépare gratuitement la maquette de votre site, vous la corrigez vous-même et vous ne payez que si elle vous plaît : 690 € ou 990 €, tout à votre nom, sans abonnement.",
      path: PATH,
    });
    return {
      ...head,
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${SITE_URL}${PATH}#service`,
          name: "Création de site web pour les TPE",
          serviceType: "Création de site web",
          description:
            "Site vitrine ou site avec espace d'administration et blog, pensé pour Google et les assistants IA, livré à votre nom sans abonnement. Maquette gratuite avant tout engagement.",
          provider: AUTHOR_REF,
          brand: { "@id": ORGANIZATION_ID },
          areaServed: ["Pays de Retz", "Nantes Métropole"],
          url: `${SITE_URL}${PATH}`,
          offers: FORMULES.map((f) => ({
            "@type": "Offer",
            name: f.name,
            price: f.price.replace(/\D/g, ""),
            priceCurrency: "EUR",
          })),
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
  component: CreationSiteWeb,
});

/** One full-width band, like one slide of the deck. */
function Band({
  id,
  kicker,
  title,
  tone = "",
  children,
}: {
  id: string;
  kicker?: string;
  title?: string;
  tone?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={title ? id : undefined} className={`py-16 md:py-20 ${tone}`}>
      <div className="container-wide max-w-[1080px]">
        {kicker ? (
          <p className="note m-0 -rotate-1 text-[24px] [color:inherit] opacity-90">{kicker}</p>
        ) : null}
        {title ? (
          <h2 id={id} className="m-0 mt-1 text-[clamp(28px,3.6vw,42px)] leading-[1.1]">
            {title}
          </h2>
        ) : null}
        <div className={title ? "mt-8" : ""}>{children}</div>
      </div>
    </section>
  );
}

function MaquetteButton({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/contact"
      search={{ besoin: "site" }}
      className={`btn-ink text-[16px] ${light ? "!bg-postit !text-ink" : ""}`}
    >
      Demander ma maquette
    </Link>
  );
}

function CreationSiteWeb() {
  return (
    <PageFrame>
      {/* 1. Votre site web vous attend */}
      <section className="bg-accent text-ink">
        <div className="container-wide grid max-w-[1080px] items-center gap-10 py-14 md:grid-cols-[1.05fr_0.95fr] md:py-20">
          <div className="flex flex-col gap-5">
            <p className="note m-0 -rotate-2 text-[26px] text-ink">accompagnement · site web</p>
            <h1 className="m-0 text-[clamp(40px,6vw,68px)] leading-[1.02]">
              Votre site web vous attend !
            </h1>
            <p className="m-0 max-w-[560px] text-[19px] leading-relaxed">
              Je fabrique la maquette de votre site avant même qu'on se parle, à partir de votre
              fiche Google, de vos réseaux et de vos avis clients.{" "}
              <strong>Il ne lui manque plus que vous.</strong>
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <MaquetteButton />
              <a href="#tarifs" className="font-semibold text-ink">
                Voir les tarifs ↓
              </a>
            </div>
            <p className="m-0 text-[14.5px]">
              <strong>Matthieu Audineau</strong> · création de sites pour les TPE, Pays de Retz et
              agglomération nantaise
            </p>
          </div>
          <div className="relative pb-10 md:pb-6">
            <img
              src={`${IMG}/demo-batiment.webp`}
              alt="Exemple de site d'artisan : un plâtrier fictif à Bouguenais, sur ordinateur"
              width={960}
              height={600}
              className="tilt w-[88%] rounded-lg border-4 border-ink shadow-[var(--shadow-card)]"
              style={r("2deg")}
            />
            <div
              className="absolute right-0 bottom-0 w-[30%] overflow-hidden rounded-[22px] border-[6px] border-ink bg-ink shadow-[var(--shadow-card)]"
              style={{ transform: "rotate(-3deg)" }}
            >
              <img
                src={`${IMG}/demo-batiment-mobile.webp`}
                alt="Le même site sur téléphone"
                width={390}
                height={664}
                className="block w-full rounded-[16px]"
              />
            </div>
          </div>
        </div>
      </section>

      <ForWho
        id="pour-qui"
        kicker="pour qui"
        title="Est-ce fait pour vous ?"
        yes={[
          "Vous êtes artisan, commerçant, praticien ou dirigeant de TPE.",
          "Vous travaillez dans le Pays de Retz ou l'agglomération nantaise.",
          "Vous n'avez pas de site, ou un site qui ne vous ressemble plus.",
          "Vous voulez un site à votre nom, sans abonnement, et savoir vous en servir.",
        ]}
        no={[
          "Vous cherchez une boutique en ligne avec paiement et gestion de stock.",
          "Vous préférez ne rien voir avant de vous engager : ici, la maquette vient d'abord.",
        ]}
      />

      {/* 2. Fait pour votre métier */}
      <Band id="metier" kicker="fait pour votre métier" title="Un site pensé pour chaque métier">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {DEMOS.map((d, i) => (
            <figure
              key={d.title}
              className="sheet m-0 flex flex-col gap-3 rounded-lg p-4 text-ink"
              style={{ transform: `rotate(${i % 2 ? "1deg" : "-1deg"})` }}
            >
              <img
                src={d.img}
                alt={d.alt}
                width={960}
                height={600}
                loading="lazy"
                className="w-full rounded border border-rule"
              />
              <figcaption className="flex flex-col gap-1">
                <span className="font-serif text-[20px] font-extrabold">{d.title}</span>
                <span className="text-[15px] leading-normal text-ink-soft">{d.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="m-0 mt-5 text-[14px] text-ink-soft">
          Deux sites de démonstration, avec des entreprises fictives. Le vôtre sera construit sur
          mesure, à partir de votre métier, de vos clients et de ce qui vous rend différent.
        </p>
      </Band>

      {/* 3. Qui suis-je ? */}
      <Band
        id="qui"
        kicker="qui suis-je ?"
        title="Trois casquettes, une obsession : faire simple"
        tone="bg-ink text-paper"
      >
        <div className="grid items-center gap-10 md:grid-cols-[280px_1fr]">
          <div className="relative mx-auto w-[240px] md:w-full">
            <img
              src={`${IMG}/matthieu.webp`}
              alt="Matthieu Audineau, illustré avec son ordinateur portable"
              width={480}
              height={480}
              loading="lazy"
              className="aspect-square w-full rounded-full object-cover"
            />
            <span
              className="postit absolute -right-2 bottom-2 rounded-sm px-3 py-1.5 font-hand text-[20px] text-ink"
              style={r("-6deg")}
            >
              Je parle humain, pas jargon.
            </span>
          </div>
          <ul className="m-0 flex list-none flex-col gap-6 p-0">
            {CASQUETTES.map((c) => (
              <li key={c.title}>
                <span className="inline-block rounded-full bg-accent px-3 py-0.5 text-[14px] font-bold text-ink">
                  {c.title}
                </span>
                <p className="m-0 mt-2 text-[17px] leading-relaxed text-[#d9d2c3]">{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Band>

      {/* 4. Testé d'abord sur mes projets */}
      <Band id="projets" kicker="ce que je construis" title="Testé d'abord sur mes projets">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <a
            href="https://endo-serenite.fr/"
            target="_blank"
            rel="noopener"
            className="sheet tilt flex items-center gap-5 rounded-lg p-5 text-ink no-underline"
            style={r("-0.8deg")}
          >
            <img
              src={`${IMG}/endo-serenite.webp`}
              alt="L'application Endo-sérénité sur téléphone : analyse d'un repas en photo"
              width={320}
              height={686}
              loading="lazy"
              className="w-[110px] shrink-0"
            />
            <span className="flex flex-col gap-2">
              <img
                src={`${IMG}/logo-endo-serenite.webp`}
                alt="Endo-sérénité"
                width={420}
                height={62}
                loading="lazy"
                className="h-auto w-[210px]"
              />
              <span className="text-[15px] leading-normal text-ink-soft">
                Une application pour les femmes atteintes d'endométriose : recettes
                anti-inflammatoires, analyse des repas en photo, entraide.
              </span>
              <span className="text-[15px] font-bold text-accent-ink">endo-serenite.fr ↗</span>
            </span>
          </a>
          <Link
            to="/"
            className="tilt flex flex-col gap-4 rounded-lg bg-ink p-5 text-paper no-underline shadow-[var(--shadow-card)]"
            style={r("0.8deg")}
          >
            <img
              src={`${IMG}/le-guide.webp`}
              alt="Le Guide Formation IA : se former à l'IA, sans se tromper de voie"
              width={800}
              height={420}
              loading="lazy"
              className="w-full rounded"
            />
            <span className="text-[15px] leading-normal text-[#d9d2c3]">
              Le site que vous lisez : des guides écrits pour être trouvés sur Google et cités par
              les IA, que je mets à jour sans toucher au code.
            </span>
            <span className="text-[15px] font-bold text-postit">formation-ia.optimatt.fr →</span>
          </Link>
        </div>
        <p className="m-0 mt-6 text-[16px]">
          <Link to="/realisations" className="font-semibold">
            Tout ce que j'ai construit →
          </Link>
        </p>
      </Band>

      {/* 5. Et maintenant ? */}
      <Band id="ensuite" title="Et maintenant ?" tone="bg-accent text-ink">
        <p className="m-0 -mt-4 mb-8 max-w-[640px] text-[18px]">
          Vous recevez le lien de votre maquette. Trois réponses possibles, aucune ne vous coûte
          quoi que ce soit :
        </p>
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3">
          {SUITE.map((s, i) => (
            <li
              key={s.title}
              className={`tilt rounded-lg p-6 shadow-[var(--shadow-card)] ${s.tone}`}
              style={r(i === 1 ? "1deg" : "-1deg")}
            >
              <h3 className="m-0 text-[21px]">{s.title}</h3>
              <p className="m-0 mt-2 text-[15.5px] leading-normal opacity-90">{s.text}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* 6. Formules et tarifs */}
      <section id="tarifs" className="scroll-mt-24">
        <Band
          id="tarifs-titre"
          kicker="formules et tarifs"
          title="Un seul paiement, et c'est à vous"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {FORMULES.map((f, i) => (
              <div
                key={f.name}
                className={`flex flex-col gap-3 rounded-lg p-6 shadow-[var(--shadow-card)] ${
                  i === 1 ? "bg-ink text-paper" : "sheet text-ink"
                }`}
              >
                <h3 className="m-0 text-[20px]">{f.name}</h3>
                <p
                  className={`m-0 font-serif text-[44px] leading-none font-extrabold ${
                    i === 1 ? "text-postit" : "text-accent-ink"
                  }`}
                >
                  {f.price}
                </p>
                <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-[15px] leading-normal">
                  {f.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                <p className="m-0 mt-auto border-t border-current/20 pt-3 text-[14px] opacity-80">
                  {f.note}
                </p>
              </div>
            ))}
            <div className="flex flex-col gap-3 rounded-lg bg-accent p-6 text-ink shadow-[var(--shadow-card)]">
              <h3 className="m-0 text-[20px]">Ensuite</h3>
              <p className="m-0 font-serif text-[44px] leading-none font-extrabold">≈ 1 € / mois</p>
              <p className="m-0 text-[15px] leading-normal">
                Votre nom de domaine, c'est tout. Hébergement gratuit, aucun abonnement.
              </p>
              <p className="m-0 mt-auto text-[15px]">
                <strong>Coup de main :</strong> 45 € de l'heure, si besoin.
              </p>
            </div>
          </div>
          <p className="m-0 mt-5 text-[13.5px] text-ink-soft">
            TVA non applicable, art. 293 B du CGI. Acompte de 30 % à la signature, solde à la mise
            en ligne. Garantie d'un mois après la mise en ligne.
          </p>
        </Band>
      </section>

      {/* 7. Trouvé sur Google, cité par les IA */}
      <Band id="seo" title="Trouvé sur Google, cité par les IA" tone="bg-postit text-ink">
        <span className="-mt-4 mb-6 inline-block rounded-full bg-ink px-3 py-1 text-[13px] font-bold text-paper">
          Inclus dans la formule à 990 €
        </span>
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <ul className="m-0 flex list-none flex-col gap-6 p-0">
            {PILIERS.map((p) => (
              <li key={p.tag} className="flex gap-4">
                <span className="h-fit rounded bg-accent-ink px-2.5 py-1 text-[13px] font-bold text-paper">
                  {p.tag}
                </span>
                <span>
                  <strong className="text-[18px]">{p.title}</strong>
                  <span className="mt-1 block text-[15.5px] leading-normal text-ink-soft">
                    {p.text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div aria-hidden="true" className="sheet p-6" style={{ transform: "rotate(2deg)" }}>
            <p className="m-0 text-[12px] text-ink-soft">← Retour au site</p>
            <p className="m-0 mt-3 font-serif text-[24px] leading-tight font-extrabold">
              Comment mieux dormir avec la sophrologie ?
            </p>
            <p className="m-0 mt-2 text-[12px] text-ink-soft">Publié par votre praticienne</p>
            <p className="m-0 mt-3 text-[14px] leading-normal">
              Trois rituels de sophrologie aident à préparer le sommeil…
            </p>
            <p className="m-0 mt-4 text-[15px] font-bold">Questions fréquentes</p>
            <div className="mt-2 flex flex-col gap-1.5">
              <span className="h-2 w-11/12 rounded bg-rule" />
              <span className="h-2 w-9/12 rounded bg-rule" />
              <span className="h-2 w-10/12 rounded bg-rule" />
            </div>
          </div>
        </div>
      </Band>

      {/* 8. Bonus : rédacteur d'articles */}
      <Band id="bonus" title="Un assistant qui écrit vos articles" tone="bg-ink text-paper">
        <span className="-mt-4 mb-6 inline-block rounded-full bg-postit px-3 py-1 text-[13px] font-bold text-ink">
          Bonus offert avec la formule à 990 €
        </span>
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="m-0 max-w-[560px] text-[17px] leading-relaxed text-[#d9d2c3]">
              Publier des articles fait venir des clients, encore faut-il avoir le temps de les
              écrire. Vous donnez un sujet de votre métier : l'assistant écrit l'article pour que
              Google vous trouve et que ChatGPT vous recommande. Je l'installe avec vous pendant la
              formation, aucune connaissance en intelligence artificielle n'est nécessaire.
            </p>
            <ol className="m-0 mt-6 flex list-none flex-col gap-3 p-0 text-[17px]">
              {[
                "Vous lui donnez un sujet de votre métier.",
                "Il écrit l'article avec vos mots, sans rien inventer.",
                "Vous copiez chaque partie dans votre espace : c'est publié.",
              ].map((t, i) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[14px] font-bold text-ink">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
            <p className="m-0 mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link to="/skill-seo-aeo-geo" className="font-bold text-postit">
                En savoir plus sur l'assistant →
              </Link>
              <span className="text-[14px] text-[#b7af9f]">29 € sur ce site, offert ici.</span>
            </p>
          </div>
          <div
            aria-hidden="true"
            className="flex flex-col gap-3 rounded-lg bg-paper-light p-5 text-ink"
            style={{ transform: "rotate(-1.5deg)" }}
          >
            {[
              ["Titre", "Comment mieux dormir avec la sophrologie ?"],
              ["Expression principale", "mieux dormir"],
              ["Réponse en deux phrases", "Trois rituels de sophrologie aident à préparer…"],
              ["Questions fréquentes", "4 questions et leurs réponses"],
            ].map(([k, v]) => (
              <div key={k}>
                <span className="flex items-center justify-between text-[11px] font-bold tracking-wide text-accent-ink uppercase">
                  {k}
                  <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] text-paper normal-case">
                    Copier
                  </span>
                </span>
                <span className="mt-1 block rounded border border-rule bg-white px-2.5 py-1.5 text-[13.5px]">
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Band>

      {/* 9. Comment ça se passe */}
      <Band id="deroule" kicker="comment ça se passe" title="En ligne en trois semaines environ">
        <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 md:grid-cols-4">
          {ETAPES.map((e, i) => (
            <li key={e.title} className="border-t-2 border-ink pt-3">
              <span className="font-serif text-[40px] leading-none font-extrabold text-accent-ink">
                {i + 1}
              </span>
              <h3 className="m-0 mt-2 text-[19px]">{e.title}</h3>
              <p className="m-0 mt-1 text-[15px] leading-normal text-ink-soft">{e.text}</p>
            </li>
          ))}
        </ol>
        <ul className="m-0 mt-8 flex list-none flex-wrap gap-3 p-0">
          {["Tout est à votre nom", "Aucun abonnement", "Garantie d'un mois"].map((t) => (
            <li
              key={t}
              className="rounded-full bg-ink px-4 py-2 text-[14px] font-semibold text-paper"
            >
              ✓ {t}
            </li>
          ))}
        </ul>
      </Band>

      {/* 10. C'est parti ! */}
      <Band id="parti" kicker="prochaines étapes" title="C'est parti !" tone="bg-ink text-paper">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div className="postit relative rounded-sm p-7 text-ink" style={r("-1.5deg")}>
            <span className="tape -top-3 left-8" aria-hidden="true" />
            <h3 className="m-0 text-[24px]">Recevez la maquette de votre site, gratuitement</h3>
            <p className="m-0 mt-3 text-[16px] leading-relaxed">
              Donnez-moi le nom de votre entreprise et votre ville. Je prépare votre maquette et je
              vous envoie le lien.
            </p>
            <div className="mt-5">
              <MaquetteButton />
            </div>
          </div>
          <ol className="m-0 flex list-none flex-col gap-5 p-0">
            {[
              ["Contrat et devis par e-mail", "Préremplis avec vos informations, sous 24 heures."],
              ["Signature et acompte", "Vous signez, vous versez 30 %, je lance la finalisation."],
              ["Vos contenus", "Photos, horaires, tarifs : on fixe ensemble la date d'envoi."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[14px] font-bold text-ink">
                  {i + 1}
                </span>
                <span>
                  <strong className="text-[17px]">{t}</strong>
                  <span className="mt-0.5 block text-[15px] text-[#d9d2c3]">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      {/* Questions */}
      <Band id="faq" title="Vos questions">
        <div className="flex max-w-[820px] flex-col gap-3">
          {FAQ.map((f) => (
            <details key={f.q} className="sheet group px-5 py-4">
              <summary className="cursor-pointer text-[17px] font-semibold">{f.q}</summary>
              <p className="m-0 mt-2 text-[16px] leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </Band>
    </PageFrame>
  );
}
