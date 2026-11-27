import { useState } from "react";
import "./table-setup.css";

const shortLabels = ["Game format", "Fighter lineup", "Player trackers", "Starter hands", "Mulligan", "Market deck", "Market row", "Location deck", "Opening referee"];

export default function TableSetup({ steps }: { steps: readonly string[] }) {
  const [selected, setSelected] = useState(0);
  const [finished, setFinished] = useState<Set<number>>(() => new Set());
  if (!steps.length) return null;
  const selectedDone = finished.has(selected);
  const allDone = finished.size === steps.length;
  const label = (index: number) => shortLabels[index] ?? `Setup step ${index + 1}`;

  function toggleCurrent() {
    const next = new Set(finished);
    if (next.has(selected)) {
      next.delete(selected);
    } else {
      next.add(selected);
      const pending = steps.findIndex((_, index) => !next.has(index));
      if (pending >= 0) setSelected(pending);
    }
    setFinished(next);
  }

  return <div className="table-setup-desk">
    <section className="table-setup-sheet" aria-label="Current setup instruction">
      <div className={`table-setup-mat${finished.has(6) ? " is-ready" : ""}`} aria-label="Diagram of seven market slots">
        <strong>Shared market · seven slots</strong>
        {Array.from({ length: 7 }, (_, index) => <i key={index} aria-hidden="true" />)}
      </div>
      <div aria-live="polite" aria-atomic="true">
        <h3>{allDone ? "The table is ready." : label(selected)}</h3>
        <p>{steps[selected]}</p>
        <p>{finished.size} of {steps.length} setup steps complete</p>
      </div>
      <div className="table-setup-controls">
        <button type="button" className="button primary" onClick={toggleCurrent}>{selectedDone ? "Mark incomplete" : "Mark complete"}</button>
        {allDone && <button type="button" className="button ghost" onClick={() => document.getElementById("quickstart-round")?.scrollIntoView({ block: "start" })}>Begin the round ↓</button>}
      </div>
    </section>
    <nav className="table-setup-checks" aria-label="Table setup checklist">
      {steps.map((step, index) => <button type="button" key={step} aria-current={selected === index ? "step" : undefined}
        aria-label={`${label(index)}, ${finished.has(index) ? "complete" : "pending"}`} onClick={() => setSelected(index)}>
        <small>{String(index + 1).padStart(2, "0")}</small><span>{label(index)}</span><b aria-hidden="true">{finished.has(index) ? "✓" : "○"}</b>
      </button>)}
    </nav>
  </div>;
}
