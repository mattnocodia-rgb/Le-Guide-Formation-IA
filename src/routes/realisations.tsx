import { Link, createFileRoute } from "@tanstack/react-router";

import { PageFrame } from "@/components/site/SiteChrome";
import { getRealisationsData } from "@/lib/content.functions";
import { LINKEDIN_URL, SITE_NAME, pageHead } from "@/lib/site";

const TITLE = `Ce que j'ai construit : études de cas no-code et IA — ${SITE_NAME}`;
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

function Realisations() {
  const { items, rdv, formations } = Route.useLoaderData();

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
            Pour chaque projet, le même plan : le problème de départ, ce que j'ai construit, le
            résultat, et ce que la formation de product builder m'a apporté pour y arriver.
          </p>
        </div>
      </section>

      <section aria-label="Études de cas" className="container-wide max-w-[780px] pt-10">
        {items.length === 0 ? (
          <p className="text-[17px] text-ink-soft">Les études de cas arrivent très bientôt.</p>
        ) : (
          <div className="flex flex-col gap-8">
            {items.map((r) => (
              <article key={r.id} className="sheet p-6 md:p-8">
                <h2 className="m-0 text-[clamp(24px,2.8vw,32px)] leading-tight">{r.projet}</h2>
                {r.outils.length > 0 && (
                  <ul
                    aria-label="Outils utilisés"
                    className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0"
                  >
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
                {r.lien && (
                  <a
                    href={r.lien}
                    target="_blank"
                    rel="noopener"
                    className="btn-outline mt-5 text-[15px]"
                  >
                    Voir le projet
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

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
                href={formations.url}
                rel="sponsored noopener"
                className="btn-ink mt-4 text-[15px]"
              >
                Voir les formations de l'École Cube
              </a>
            )}
            {rdv && (
              <a href={rdv.url} rel="sponsored noopener" className="btn-outline mt-3 text-[15px]">
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
