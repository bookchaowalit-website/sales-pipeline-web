export const STAGES = ["Listen", "Shape", "Propose", "Close"] as const;
export type Stage = (typeof STAGES)[number];
export type Deal = { id: string; company: string; contact: string; stage: Stage; value: number; next: string; blocker: string; age: string };

export const SEED: Deal[] = [
  { id: "d-01", company: "Northstar Studio", contact: "Mina / founder", stage: "Propose", value: 68000, next: "Send the two-sprint scope", blocker: "Needs a smaller first commitment", age: "3d" },
  { id: "d-02", company: "Field Notes Co.", contact: "Krit / editor", stage: "Shape", value: 42000, next: "Clarify content workflow", blocker: "Decision maker not in the room", age: "7d" },
  { id: "d-03", company: "Pale Blue Labs", contact: "Aom / product", stage: "Listen", value: 95000, next: "Map the current handoff", blocker: "Problem is still broad", age: "1d" },
  { id: "d-04", company: "Common Ground", contact: "Nate / operations", stage: "Close", value: 31000, next: "Confirm start date", blocker: "Waiting on signed scope", age: "12d" },
];

export const MAX_NOTE = 160;

/**
 * Trim, drop zero-width characters / BOM, and cut to MAX_NOTE UTF-16 units
 * without leaving half of an emoji. Returns "" when nothing visible remains.
 */
export function cleanNote(text: string): string {
  const value = text.replace(/[\u200B-\u200D\u2060\uFEFF]/g, "").trim();
  if (value.length <= MAX_NOTE) return value;
  return value.slice(0, /[\uD800-\uDBFF]/.test(value[MAX_NOTE - 1]) ? MAX_NOTE - 1 : MAX_NOTE).trimEnd();
}

export function nextStage(stage: Stage): Stage | null {
  const index = STAGES.indexOf(stage);
  return index < STAGES.length - 1 ? STAGES[index + 1] : null;
}

export function previousStage(stage: Stage): Stage | null {
  const index = STAGES.indexOf(stage);
  return index > 0 ? STAGES[index - 1] : null;
}

export function moveDeal(deals: Deal[], id: string, direction: 1 | -1): Deal[] {
  return deals.map((deal) => {
    if (deal.id !== id) return deal;
    const target = direction === 1 ? nextStage(deal.stage) : previousStage(deal.stage);
    return target ? { ...deal, stage: target } : deal;
  });
}

/** Updates the free-text next action / blocker; blank input keeps the old text. */
export function updateNotes(deals: Deal[], id: string, notes: { next?: string; blocker?: string }): Deal[] {
  return deals.map((deal) => {
    if (deal.id !== id) return deal;
    const next = notes.next === undefined ? "" : cleanNote(notes.next);
    const blocker = notes.blocker === undefined ? "" : cleanNote(notes.blocker);
    return { ...deal, next: next || deal.next, blocker: blocker || deal.blocker };
  });
}

export function pipelineTotal(deals: Deal[]): number {
  return deals.reduce((sum, deal) => sum + deal.value, 0);
}

export function countByStage(deals: Deal[]): Record<Stage, number> {
  const counts = { Listen: 0, Shape: 0, Propose: 0, Close: 0 } as Record<Stage, number>;
  for (const deal of deals) counts[deal.stage] += 1;
  return counts;
}

/** Restores stored deals by id against the seed so values and names cannot be tampered with. */
export function parseDeals(raw: string | null, seed: Deal[] = SEED): Deal[] | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return null;
    const stored = new Map<string, Record<string, unknown>>();
    for (const item of data) if (typeof item === "object" && item !== null && typeof (item as Record<string, unknown>).id === "string") stored.set((item as { id: string }).id, item as Record<string, unknown>);
    return seed.map((deal) => {
      const saved = stored.get(deal.id);
      if (!saved) return deal;
      return {
        ...deal,
        stage: (STAGES as readonly unknown[]).includes(saved.stage) ? (saved.stage as Stage) : deal.stage,
        next: (typeof saved.next === "string" && cleanNote(saved.next)) || deal.next,
        blocker: (typeof saved.blocker === "string" && cleanNote(saved.blocker)) || deal.blocker,
      };
    });
  } catch {
    return null;
  }
}
