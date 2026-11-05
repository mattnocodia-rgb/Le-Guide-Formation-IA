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
import { SITE_NAME, SITE_URL, jsonLdScript, pageHead } from "@/lib/site";

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
          Simulateur ROI : votre automatisation est-elle rentable ?
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
            <dl className="m-0 grid grid-cols-2 gap-4">
              {[
                ["Temps passé par an", `${Math.round(r.hoursPerYear)} h`],
                ["Coût manuel par an", eur(r.humanAnnualCost)],
                ["Rentable en", roiLabel],
                ["Gain sur 5 ans", eur(r.fiveYearSavings)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-rule p-4">
                  <dt className="text-[14px] text-ink-soft">{k}</dt>
                  <dd className="m-0 mt-1 font-serif text-[26px] font-bold text-accent-ink">{v}</dd>
                </div>
              ))}
            </dl>
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
        </div>
      </section>
    </PageFrame>
  );
}
