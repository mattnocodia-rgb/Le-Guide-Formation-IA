import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageFrame } from "@/components/site/SiteChrome";
import {
  COMPLEXITIES,
  FREQUENCIES,
  computeRoi,
  type ComplexityKey,
  type FrequencyKey,
  type RoiInput,
} from "@/lib/roi";
import { LINKEDIN_URL, SITE_NAME, SITE_URL, jsonLdScript, pageHead } from "@/lib/site";

const TITLE = `Simulateur ROI de l'automatisation — ${SITE_NAME}`;
const DESCRIPTION =
  "Calculez en une minute combien une tâche répétitive vous coûte par an et en combien de mois son automatisation (n8n, Make, IA) devient rentable.";

export const Route = createFileRoute("/simulateur-roi")({
  head: () => {
    const head = pageHead({ title: TITLE, description: DESCRIPTION, path: "/simulateur-roi" });
    return {
      ...head,
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Simulateur ROI de l'automatisation",
          url: `${SITE_URL}/simulateur-roi`,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          inLanguage: "fr",
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          description: DESCRIPTION,
        }),
      ],
    };
  },
  component: SimulateurRoi,
});

const eur = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const field =
  "w-full rounded-md border border-rule bg-paper px-3 py-2 text-[16px] text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

function NumberField(props: {
  id: string;
  label: string;
  value: number;
  step?: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={props.id} className="text-[15px] font-medium">
        {props.label}
      </label>
      <input
        id={props.id}
        type="number"
        min={0}
        step={props.step ?? 1}
        inputMode="decimal"
        className={field}
        value={Number.isFinite(props.value) ? props.value : 0}
        onChange={(e) => props.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    </div>
  );
}

function SimulateurRoi() {
  const [input, setInput] = useState<RoiInput>({
    frequency: "hebdomadaire",
    volume: 20,
    minutesPerTask: 15,
    hourlyRate: 35,
    complexity: "moyen",
    toolCostMonthly: 29,
  });
  const set = <K extends keyof RoiInput>(k: K, v: RoiInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => computeRoi(input), [input]);

  const roiLabel = Number.isFinite(r.roiMonths)
    ? r.roiMonths < 1
      ? "moins d'un mois"
      : `${r.roiMonths.toFixed(1).replace(".", ",")} mois`
    : "jamais rentable";

  return (
    <PageFrame>
      <section className="container-wide max-w-[1080px] pt-12 md:pt-16">
        <p className="note m-0 -rotate-2 text-[28px]">outil gratuit</p>
        <h1 className="mt-3 mb-5 text-[clamp(34px,5vw,54px)] leading-[1.05]">
          Combien vous coûte cette tâche manuelle par an ?
        </h1>
        <p className="m-0 max-w-[68ch] text-[18px] leading-relaxed text-ink-soft">
          Renseignez une tâche répétitive : le simulateur estime ce qu'elle vous coûte par an et le
          nombre de mois avant que son automatisation soit remboursée.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <form
            className="sheet flex flex-col gap-5 p-6 md:p-7"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Paramètres de la simulation"
          >
            <h2 className="m-0 text-[22px]">Votre tâche</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="freq" className="text-[15px] font-medium">
                  Fréquence
                </label>
                <select
                  id="freq"
                  className={field}
                  value={input.frequency}
                  onChange={(e) => set("frequency", e.target.value as FrequencyKey)}
                >
                  {Object.entries(FREQUENCIES).map(([k, f]) => (
                    <option key={k} value={k}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <NumberField id="vol" label="Nombre de fois" value={input.volume} onChange={(n) => set("volume", n)} />
              <NumberField
                id="min"
                label="Minutes par tâche"
                value={input.minutesPerTask}
                onChange={(n) => set("minutesPerTask", n)}
              />
              <NumberField
                id="rate"
                label="Coût horaire (€/h)"
                value={input.hourlyRate}
                onChange={(n) => set("hourlyRate", n)}
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="cx" className="text-[15px] font-medium">
                  Complexité
                </label>
                <select
                  id="cx"
                  className={field}
                  value={input.complexity}
                  onChange={(e) => set("complexity", e.target.value as ComplexityKey)}
                >
                  {Object.entries(COMPLEXITIES).map(([k, c]) => (
                    <option key={k} value={k}>
                      {c.label} ({eur(c.buildCost)})
                    </option>
                  ))}
                </select>
              </div>
              <NumberField
                id="tool"
                label="Outil (€/mois)"
                value={input.toolCostMonthly}
                onChange={(n) => set("toolCostMonthly", n)}
              />
            </div>
          </form>

          <div className="flex flex-col gap-6" aria-live="polite">
            <div className="postit relative -rotate-1 rounded-sm p-6 md:p-7">
              <span className="tape -top-3 left-8" aria-hidden="true" />
              <p className="m-0 text-[18px] leading-relaxed text-ink">
                Cette tâche vous fait gagner{" "}
                <strong className="text-accent-ink">{Math.round(r.hoursPerYear)} heures</strong> par an
                et coûterait environ{" "}
                <strong className="text-accent-ink">{eur(r.buildCost + input.toolCostMonthly * 12)}</strong>{" "}
                la 1ère année puis{" "}
                <strong className="text-accent-ink">{eur(Math.max(0, input.toolCostMonthly) * 12)}</strong>{" "}
                les années suivantes, au lieu de{" "}
                <strong className="text-accent-ink">{eur(r.humanAnnualCost)}</strong> en restant sur un
                process manuel, soit{" "}
                <strong className="text-accent-ink">{eur(r.fiveYearSavings)}</strong> de gagnés sur 5 ans !
              </p>
              <p className="m-0 mt-4 font-serif text-[22px] font-bold text-ink">
                La rentabilité est de <span className="text-accent-ink">{roiLabel}</span>.
              </p>
            </div>
            <div className="rounded-lg border border-rule p-4">
              <h2 className="m-0 mb-3 text-[18px]">Coût cumulé sur 12 mois</h2>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={r.months}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--rule)" />
                    <XAxis dataKey="month" stroke="var(--ink-soft)" fontSize={12} />
                    <YAxis stroke="var(--ink-soft)" fontSize={12} tickFormatter={(v: number) => `${Math.round(v / 1000)}k€`} />
                    <Tooltip formatter={(v: number) => eur(v)} />
                    <Legend />
                    <Line type="monotone" dataKey="manuel" name="Manuel" stroke="var(--ink)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="automatise" name="Automatisé" stroke="var(--accent)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide max-w-[780px] pt-14 pb-6">
        <div className="prose-article">
          <h2>Comment le calcul est-il fait ?</h2>
          <p>
            Le coût manuel annuel est le nombre d'exécutions par an multiplié par la durée de la
            tâche et par le coût horaire. Une année compte ici 260 jours ouvrés, 52 semaines et 12
            mois.
          </p>
          <p>
            Le coût de l'automatisation additionne un coût de mise en place forfaitaire selon la
            complexité (800 €, 2 500 € ou 6 000 €) et l'abonnement mensuel de l'outil. Ces forfaits
            sont des hypothèses de calcul, pas des devis : un projet réel peut coûter plus ou moins.
          </p>
          <p>
            Pour savoir quelles tâches automatiser en priorité, lisez{" "}
            <Link to="/$slug" params={{ slug: "audit-ia-entreprise" }}>
              le guide de l'audit IA en entreprise
            </Link>{" "}
            ou le comparatif{" "}
            <Link to="/$slug" params={{ slug: "n8n-ou-make" }}>
              n8n ou Make
            </Link>
            .
          </p>

          <h2>Comment calculer le coût réel d'une tâche manuelle ?</h2>
          <p>
            Le coût réel d'une tâche manuelle se calcule ainsi : nombre d'exécutions par an × durée
            d'une exécution × coût horaire. Une tâche de 15 minutes faite 20 fois par semaine
            représente 260 heures par an, soit plus de 9 000 € à 35 € de l'heure.
          </p>
          <p>
            Ce montant ne compte que le temps passé. Il n'inclut pas les erreurs de saisie, les
            oublis de relance ni le temps qui n'est pas consacré aux clients.
          </p>

          <h2>Quelles tâches répétitives automatiser en priorité ?</h2>
          <p>
            Les meilleures candidates sont fréquentes, basées sur des règles claires et sans
            jugement humain à chaque fois.
          </p>
          <table>
            <thead>
              <tr>
                <th>Tâche</th>
                <th>Pourquoi l'automatiser</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Relances de devis et de factures</td>
                <td>Répétitives, datées, faciles à oublier</td>
              </tr>
              <tr>
                <td>Saisie dans le CRM ou un tableur</td>
                <td>Copier-coller sans valeur ajoutée, source d'erreurs</td>
              </tr>
              <tr>
                <td>Création de documents (devis, contrats)</td>
                <td>Même modèle, seules les données changent</td>
              </tr>
              <tr>
                <td>Tri des formulaires et e-mails entrants</td>
                <td>Volume régulier, règles de tri simples</td>
              </tr>
            </tbody>
          </table>

          <h2>Automatiser seul ou se faire accompagner ?</h2>
          <p>
            Une automatisation simple entre deux outils se monte souvent seul avec Make ou n8n.
            Dès qu'il y a plusieurs étapes, des conditions ou de l'IA, un accompagnement fait gagner
            du temps et évite les scénarios fragiles.
          </p>
        </div>

        <aside className="postit relative mt-10 rotate-1 rounded-sm p-6 md:p-7">
          <span className="tape -top-3 left-8" aria-hidden="true" />
          <p className="note m-0 text-[24px]">besoin d'un coup de main ?</p>
          <p className="m-0 mt-2 text-[17px] leading-relaxed text-ink">
            Je réalise aussi des prestations d'automatisation : j'identifie avec vous les tâches à
            automatiser, puis je mets en place les scénarios. Écrivez-moi à{" "}
            <a href="mailto:contact@optimatt.fr">contact@optimatt.fr</a> ou sur{" "}
            <a href={LINKEDIN_URL} target="_blank" rel="noopener">
              LinkedIn
            </a>
            .
          </p>
        </aside>
      </section>
    </PageFrame>
  );
}
