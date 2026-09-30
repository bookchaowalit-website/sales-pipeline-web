import { describe, expect, it } from "vitest";
import { countByStage, moveDeal, nextStage, parseDeals, pipelineTotal, SEED, updateNotes } from "./deals";

describe("stages", () => {
  it("advances and retreats within bounds", () => {
    expect(nextStage("Listen")).toBe("Shape");
    expect(nextStage("Close")).toBeNull();
    expect(moveDeal(SEED, "d-03", 1).find((d) => d.id === "d-03")?.stage).toBe("Shape");
    expect(moveDeal(SEED, "d-03", -1).find((d) => d.id === "d-03")?.stage).toBe("Listen");
    expect(moveDeal(SEED, "d-04", 1).find((d) => d.id === "d-04")?.stage).toBe("Close");
  });

  it("counts deals per stage and totals value", () => {
    expect(countByStage(SEED)).toEqual({ Listen: 1, Shape: 1, Propose: 1, Close: 1 });
    expect(pipelineTotal(SEED)).toBe(236000);
  });
});

describe("updateNotes", () => {
  it("records a new next action and ignores blank input", () => {
    const updated = updateNotes(SEED, "d-01", { next: "  Call Mina Friday ", blocker: "   " });
    expect(updated[0].next).toBe("Call Mina Friday");
    expect(updated[0].blocker).toBe(SEED[0].blocker);
  });
});

describe("parseDeals", () => {
  it("restores stage and notes but not values from storage", () => {
    const raw = JSON.stringify([{ id: "d-01", stage: "Close", next: "Sign", value: 1 }, { id: "d-02", stage: "Won" }]);
    const deals = parseDeals(raw);
    expect(deals?.[0]).toMatchObject({ stage: "Close", next: "Sign", value: 68000 });
    expect(deals?.[1].stage).toBe("Shape");
    expect(parseDeals("{")).toBeNull();
  });
});
