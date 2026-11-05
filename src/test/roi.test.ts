import { describe, expect, it } from "vitest";
import { computeRoi } from "@/lib/roi";

describe("computeRoi", () => {
  it("matches OptiBoost defaults (20/week, 15 min, 35 €/h, medium, 29 €/month)", () => {
    const r = computeRoi({
      frequency: "hebdomadaire",
      volume: 20,
      minutesPerTask: 15,
      hourlyRate: 35,
      complexity: "moyen",
      toolCostMonthly: 29,
    });
    expect(r.hoursPerYear).toBe(260);
    expect(r.humanAnnualCost).toBe(9100);
    expect(r.year1Savings).toBe(9100 - (2500 + 348));
    expect(r.roiMonths).toBeCloseTo(2500 / (9100 / 12 - 29), 5);
  });

  it("never pays back when the tool costs more than the time saved", () => {
    const r = computeRoi({
      frequency: "mensuel",
      volume: 1,
      minutesPerTask: 10,
      hourlyRate: 20,
      complexity: "simple",
      toolCostMonthly: 50,
    });
    expect(r.roiMonths).toBe(Infinity);
  });
});
