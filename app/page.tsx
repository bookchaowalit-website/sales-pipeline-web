"use client";

import { useMemo, useState } from "react";

type Deal = { id: string; company: string; contact: string; stage: "Listen" | "Shape" | "Propose" | "Close"; value: number; next: string; blocker: string; age: string };
const seed: Deal[] = [
  { id: "d-01", company: "Northstar Studio", contact: "Mina / founder", stage: "Propose", value: 68000, next: "Send the two-sprint scope", blocker: "Needs a smaller first commitment", age: "3d" },
  { id: "d-02", company: "Field Notes Co.", contact: "Krit / editor", stage: "Shape", value: 42000, next: "Clarify content workflow", blocker: "Decision maker not in the room", age: "7d" },
  { id: "d-03", company: "Pale Blue Labs", contact: "Aom / product", stage: "Listen", value: 95000, next: "Map the current handoff", blocker: "Problem is still broad", age: "1d" },
  { id: "d-04", company: "Common Ground", contact: "Nate / operations", stage: "Close", value: 31000, next: "Confirm start date", blocker: "Waiting on signed scope", age: "12d" },
];
const stages: Deal["stage"][] = ["Listen", "Shape", "Propose", "Close"];
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

export default function Home() {
  const [deals, setDeals] = useState(seed);
  const [selectedId, setSelectedId] = useState("d-01");
  const [stage, setStage] = useState<"All" | Deal["stage"]>("All");
  const selected = deals.find((deal) => deal.id === selectedId) ?? deals[0];
  const visible = useMemo(() => deals.filter((deal) => stage === "All" || deal.stage === stage), [deals, stage]);
  const total = deals.reduce((sum, deal) => sum + deal.value, 0);
  const advance = () => { if (!selected) return; const index = stages.indexOf(selected.stage); if (index === stages.length - 1) return; const nextStage = stages[index + 1]; setDeals((current) => current.map((deal) => deal.id === selected.id ? { ...deal, stage: nextStage } : deal)); };

  return (
    <main className="deal-page"><div className="deal-shell">
      <header className="deal-topbar"><div className="deal-brand"><span className="deal-mark">DD</span><span>DEAL / DESK</span></div><span>LOCAL OPPORTUNITY REGISTER</span><span className="deal-date">25 AUG 2026 / 09:40</span></header>
      <section className="deal-hero"><div><p className="deal-kicker">keep the next move visible</p><h1>Don&apos;t lose<br /><em>the thread.</em></h1><p className="deal-deck">A small desk for the part between a good conversation and a clear next action. Read the deal, find the friction, move one step.</p></div><div className="deal-tally"><span>PIPELINE VALUE</span><strong>{currency.format(total)}</strong><small>{deals.length} sample opportunities<br />local browser state</small></div></section>
      <section className="deal-controls"><span className="control-label">VIEW THE PIPE</span><div className="stage-tabs"><button type="button" className={stage === "All" ? "is-active" : ""} onClick={() => setStage("All")}>All <b>{deals.length}</b></button>{stages.map((item) => <button type="button" className={stage === item ? "is-active" : ""} key={item} onClick={() => setStage(item)}>{item} <b>{deals.filter((deal) => deal.stage === item).length}</b></button>)}</div></section>
      <section className="deal-workspace" aria-label="Sales pipeline workspace"><div className="deal-ledger"><div className="ledger-head"><span>DEAL</span><span>STAGE</span><span>VALUE</span><span>AGE</span></div>{visible.map((deal) => <button type="button" className={`deal-row ${selected?.id === deal.id ? "is-active" : ""}`} key={deal.id} onClick={() => setSelectedId(deal.id)}><span className="deal-name"><strong>{deal.company}</strong><small>{deal.contact}</small></span><span className="deal-stage"><i className={`dot dot-${deal.stage.toLowerCase()}`} />{deal.stage}</span><span className="deal-value">{currency.format(deal.value)}</span><span className="deal-age">{deal.age}</span></button>)}{visible.length === 0 ? <p className="deal-empty">No deal is in this cut of the pipe.</p> : null}</div>{selected ? <aside className="deal-brief"><div className="brief-head"><span>SELECTED / {selected.id}</span><strong>{selected.stage}</strong></div><h2>{selected.company}</h2><p className="brief-contact">{selected.contact} · {currency.format(selected.value)} expected value</p><div className="stage-line">{stages.map((item) => <span key={item} className={stages.indexOf(item) <= stages.indexOf(selected.stage) ? "is-done" : ""}>{item}</span>)}</div><dl className="brief-facts"><div><dt>NEXT ACTION</dt><dd>{selected.next}</dd></div><div><dt>BLOCKER</dt><dd>{selected.blocker}</dd></div></dl><button className="advance-button" type="button" onClick={advance} disabled={selected.stage === "Close"}>{selected.stage === "Close" ? "At the close line" : `Move to ${stages[stages.indexOf(selected.stage) + 1]} →`}</button><p className="brief-honesty">Sample deal data only. This desk does not send email, create a forecast, or connect to a CRM.</p></aside> : null}</section>
      <footer className="deal-footer"><span>BOOKCHAOWALIT / SALES PIPELINE</span><span>DEMO REGISTER · NO SYNC / NO REVENUE CLAIM</span></footer>
    </div></main>
  );
}
