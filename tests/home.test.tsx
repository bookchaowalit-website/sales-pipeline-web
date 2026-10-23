import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { SEED, pipelineTotal } from "@/lib/deals";

const thb = new Intl.NumberFormat("en-US", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

describe("home page", () => {
  it("renders the four sample deals, their pipeline total and the demo notice", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("the thread.");
    for (const deal of SEED) expect(html).toContain(deal.company);
    expect(html).toContain(thb.format(pipelineTotal(SEED)));
    expect(html).toContain("RESET SAMPLE");
    expect(html).toContain("DEMO REGISTER · NO SYNC / NO REVENUE CLAIM");
  });
});
