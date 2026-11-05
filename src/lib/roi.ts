/** ROI simulator logic, ported from the OptiBoost project. Pure functions, no I/O. */

export const FREQUENCIES = {
  quotidien: { label: "Chaque jour ouvré", perYear: 260 },
  hebdomadaire: { label: "Chaque semaine", perYear: 52 },
  mensuel: { label: "Chaque mois", perYear: 12 },
} as const;

export const COMPLEXITIES = {
  simple: { label: "Simple", buildCost: 800 },
  moyen: { label: "Moyenne", buildCost: 2500 },
  complexe: { label: "Complexe", buildCost: 6000 },
} as const;

export type FrequencyKey = keyof typeof FREQUENCIES;
export type ComplexityKey = keyof typeof COMPLEXITIES;

export type RoiInput = {
  frequency: FrequencyKey;
  volume: number;
  minutesPerTask: number;
  hourlyRate: number;
  complexity: ComplexityKey;
  toolCostMonthly: number;
};

export type RoiResult = {
  hoursPerYear: number;
  humanAnnualCost: number;
  buildCost: number;
  monthlySavings: number;
  roiMonths: number;
  year1Savings: number;
  fiveYearSavings: number;
  months: { month: string; manuel: number; automatise: number }[];
};

export function computeRoi(i: RoiInput): RoiResult {
  const occurrences = Math.max(0, i.volume) * FREQUENCIES[i.frequency].perYear;
  const hoursPerYear = (occurrences * Math.max(0, i.minutesPerTask)) / 60;
  const humanAnnualCost = hoursPerYear * Math.max(0, i.hourlyRate);
  const buildCost = COMPLEXITIES[i.complexity].buildCost;
  const tool = Math.max(0, i.toolCostMonthly);
  const monthlyHuman = humanAnnualCost / 12;
  const monthlySavings = monthlyHuman - tool;
  const roiMonths = monthlySavings > 0 ? buildCost / monthlySavings : Infinity;
  const months = Array.from({ length: 12 }, (_, k) => ({
    month: `M${k + 1}`,
    manuel: Math.round(monthlyHuman * (k + 1)),
    automatise: Math.round(buildCost + tool * (k + 1)),
  }));
  return {
    hoursPerYear,
    humanAnnualCost,
    buildCost,
    monthlySavings,
    roiMonths,
    year1Savings: humanAnnualCost - (buildCost + tool * 12),
    fiveYearSavings: humanAnnualCost * 5 - (buildCost + tool * 60),
    months,
  };
}
