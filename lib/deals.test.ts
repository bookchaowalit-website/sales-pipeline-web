import { describe, expect, it } from "vitest";
import { countByStage, MAX_NOTE, moveDeal, nextStage, parseDeals, pipelineTotal, SEED, updateNotes } from "./deals";

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

  it("updates only the blocker of the chosen deal and persists it", () => {
    const updated = updateNotes(SEED, "d-02", { blocker: " Budget owner joins Tuesday " });
    expect(updated[1].blocker).toBe("Budget owner joins Tuesday");
    expect(updated[1].next).toBe(SEED[1].next);
    expect(updated[0]).toEqual(SEED[0]);
    expect(parseDeals(JSON.stringify(updated))?.[1].blocker).toBe("Budget owner joins Tuesday");
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

describe("note edge cases", () => {
  const id = SEED[0].id;
  it("ignores a next action or blocker made only of zero-width characters", () => {
    const [deal] = updateNotes(SEED, id, { next: "\u200B\u200D", blocker: "\uFEFF " });
    expect(deal.next).toBe(SEED[0].next);
    expect(deal.blocker).toBe(SEED[0].blocker);
    expect(parseDeals(JSON.stringify([{ id, next: "\u200B" }]))?.[0].next).toBe(SEED[0].next);
  });

  it("never stores half an emoji at the note limit", () => {
    const text = `${"x".repeat(MAX_NOTE - 1)}🚀 later`;
    expect(updateNotes(SEED, id, { next: text })[0].next).toBe("x".repeat(MAX_NOTE - 1));
    expect(parseDeals(JSON.stringify([{ id, blocker: text }]))?.[0].blocker).toBe("x".repeat(MAX_NOTE - 1));
  });
});
