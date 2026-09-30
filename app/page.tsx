"use client";

import { useMemo, useState, type FormEvent } from "react";
import { countByStage, MAX_NOTE, moveDeal, nextStage, parseDeals, pipelineTotal, SEED as seed, STAGES as stages, updateNotes, type Stage } from "../lib/deals";
import { useStoredState } from "../lib/use-stored-state";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "THB", maximumFractionDigits: 0 });

export default function Home() {
  const [deals, setDeals] = useStoredState("sales-pipeline-deals-v1", seed, parseDeals);
  const [noteDraft, setNoteDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedId, setSelectedId] = useState("d-01");
  const [stage, setStage] = useState<"All" | Stage>("All");
  const selected = deals.find((deal) => deal.id === selectedId) ?? deals[0];
  const visible = useMemo(() => deals.filter((deal) => stage === "All" || deal.stage === stage), [deals, stage]);
  const total = pipelineTotal(deals);
  const counts = countByStage(deals);
  const upcoming = selected ? nextStage(selected.stage) : null;
  const move = (direction: 1 | -1) => { if (!selected) return; setDeals((current) => moveDeal(current, selected.id, direction)); setNotice(""); };
  const recordNext = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!selected || !noteDraft.trim()) return; setDeals((current) => updateNotes(current, selected.id, { next: noteDraft })); setNoteDraft(""); setNotice(`Next action recorded for ${selected.company}.`); };
  const reset = () => { setDeals(seed); setNotice("Sample register restored."); };

  return (
    <main className="deal-page"><div className="deal-shell">
      <header className="deal-topbar"><div className="deal-brand"><span className="deal-mark">DD</span><span>DEAL / DESK</span></div><span>LOCAL OPPORTUNITY REGISTER</span><button type="button" className="deal-date deal-reset" onClick={reset}>RESET SAMPLE</button></header>
      <section className="deal-hero"><div><p className="deal-kicker">keep the next move visible</p><h1>Don&apos;t lose<br /><em>the thread.</em></h1><p className="deal-deck">A small desk for the part between a good conversation and a clear next action. Read the deal, find the friction, move one step.</p></div><div className="deal-tally"><span>PIPELINE VALUE</span><strong>{currency.format(total)}</strong><small>{deals.length} sample opportunities<br />saved in this browser</small></div></section>
      <section className="deal-controls"><span className="control-label">VIEW THE PIPE</span><div className="stage-tabs" role="group" aria-label="Filter by stage"><button type="button" aria-pressed={stage === "All"} className={stage === "All" ? "is-active" : ""} onClick={() => setStage("All")}>All <b>{deals.length}</b></button>{stages.map((item) => <button type="button" aria-pressed={stage === item} className={stage === item ? "is-active" : ""} key={item} onClick={() => setStage(item)}>{item} <b>{counts[item]}</b></button>)}</div></section>
      <section className="deal-workspace" aria-label="Sales pipeline workspace"><div className="deal-ledger"><div className="ledger-head"><span>DEAL</span><span>STAGE</span><span>VALUE</span><span>AGE</span></div>{visible.map((deal) => <button type="button" aria-pressed={selected?.id === deal.id} className={`deal-row ${selected?.id === deal.id ? "is-active" : ""}`} key={deal.id} onClick={() => { setSelectedId(deal.id); setNoteDraft(""); setNotice(""); }}><span className="deal-name"><strong>{deal.company}</strong><small>{deal.contact}</small></span><span className="deal-stage"><i className={`dot dot-${deal.stage.toLowerCase()}`} />{deal.stage}</span><span className="deal-value">{currency.format(deal.value)}</span><span className="deal-age">{deal.age}</span></button>)}{visible.length === 0 ? <p className="deal-empty">No deal is in this cut of the pipe.</p> : null}</div>{selected ? <aside className="deal-brief" aria-live="polite"><div className="brief-head"><span>SELECTED / {selected.id}</span><strong>{selected.stage}</strong></div><h2>{selected.company}</h2><p className="brief-contact">{selected.contact} · {currency.format(selected.value)} expected value</p><div className="stage-line">{stages.map((item) => <span key={item} className={stages.indexOf(item) <= stages.indexOf(selected.stage) ? "is-done" : ""}>{item}</span>)}</div><dl className="brief-facts"><div><dt>NEXT ACTION</dt><dd>{selected.next}</dd></div><div><dt>BLOCKER</dt><dd>{selected.blocker}</dd></div></dl><form className="next-form" onSubmit={recordNext}><label htmlFor="next-action">Record the next action</label><div><input id="next-action" value={noteDraft} maxLength={MAX_NOTE} onChange={(event) => setNoteDraft(event.target.value)} placeholder={selected.next} /><button type="submit" disabled={!noteDraft.trim()}>Save</button></div></form><button className="advance-button" type="button" onClick={() => move(1)} disabled={!upcoming}>{upcoming ? `Move to ${upcoming} →` : "At the close line"}</button>{selected.stage !== "Listen" ? <button className="retreat-button" type="button" onClick={() => move(-1)}>← Step back a stage</button> : null}<p className="brief-notice" role="status">{notice}</p><p className="brief-honesty">Sample deal data only. This desk does not send email, create a forecast, or connect to a CRM.</p></aside> : null}</section>
      <footer className="deal-footer"><span>BOOKCHAOWALIT / SALES PIPELINE</span><span>DEMO REGISTER · NO SYNC / NO REVENUE CLAIM</span></footer>
    </div></main>
  );
}
