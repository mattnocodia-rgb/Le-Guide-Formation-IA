import { Link, createFileRoute } from "@tanstack/react-router";

import { PageFrame } from "@/components/site/SiteChrome";
import { type RealisationCard, getRealisationsData } from "@/lib/content.functions";
import { LINKEDIN_URL, SITE_NAME, pageHead } from "@/lib/site";
import { track } from "@/lib/track";

const TITLE = `Études de cas no-code et IA — ${SITE_NAME}`;
const DESCRIPTION =
  "Sites, automatisations n8n et Make, outils internes : les projets que je construis avec le no-code et l'IA, avec pour chacun le problème, les outils et le résultat.";

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

function Carte({ r }: { r: RealisationCard }) {
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
        {(r.payant || r.lien || r.cube.length > 0) && (
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
            {r.lien && (
              <a href={r.lien} target="_blank" rel="noopener" className="btn-outline text-[15px]">
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
                {c.cta}
              </a>
            ))}
          </p>
        )}
      </div>
    </article>
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
            <strong>
              Je ne suis pas développeur : tout ce qui suit est construit avec des outils no-code et
              l'IA.
            </strong>{" "}
            Pour chaque projet, le même plan : le problème de départ, ce que j'ai construit et le
            résultat. D'abord ce que j'ai mis en place en entreprise, puis mes propres projets.
          </p>
        </div>
      </section>

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
              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {g.items.map((r) => (
                  <Carte key={r.id} r={r} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}

      <section className="container-wide max-w-[780px] pt-14 pb-4">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <aside className="lined p-6 pl-14 shadow-[var(--shadow-card)]">
            <p className="note m-0 text-[22px]">vous voulez apprendre à le faire ?</p>
            <p className="m-0 mt-2 text-[17px] leading-relaxed">
              J'ai appris tout cela pendant ma formation de product builder. Le métier est détaillé
              dans{" "}
              <Link to="/$slug" params={{ slug: "devenir-product-builder" }}>
                devenir product builder
              </Link>
              .
            </p>
            {formations && (
              <a
                href={track(formations.url, "realisations")}
                rel="sponsored noopener"
                className="btn-ink mt-4 text-[15px]"
              >
                Voir les formations de l'École Cube
              </a>
            )}
            {rdv && (
              <a
                href={track(rdv.url, "realisations")}
                rel="sponsored noopener"
                className="btn-outline mt-3 text-[15px]"
              >
                {rdv.label}
              </a>
            )}
          </aside>
          <aside className="postit relative rotate-1 rounded-sm p-6 md:p-7">
            <span className="tape -top-3 left-8" aria-hidden="true" />
            <p className="note m-0 text-[22px]">vous voulez que je le fasse ?</p>
            <p className="m-0 mt-2 text-[17px] leading-relaxed text-ink">
              Je réalise aussi des sites et des automatisations pour les entreprises. Écrivez-moi à{" "}
              <a href="mailto:contact@optimatt.fr">contact@optimatt.fr</a> ou sur{" "}
              <a href={LINKEDIN_URL} target="_blank" rel="noopener">
                LinkedIn
              </a>
              .
            </p>
          </aside>
        </div>
      </section>
    </PageFrame>
  );
}
