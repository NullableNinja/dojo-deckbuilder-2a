import { useState } from "react";
import { CANONICAL_RULES, COMBAT_SEQUENCE, PHASES } from "./canonical-presentation";
import "./training-foldout.css";

const roundChapter = CANONICAL_RULES.chapters.find((chapter) => chapter.number === 6);
const combatChapter = CANONICAL_RULES.chapters.find((chapter) => chapter.number === 8);

function chapterLink(chapterId?: string, sectionId?: string) {
  return ["#rules", chapterId, sectionId].filter(Boolean).join("/");
}

const roundSteps = PHASES.map((phase) => {
  const section = roundChapter?.sections.find((item) => item.title.startsWith(phase.name));
  return {
    symbol: phase.letter,
    title: phase.name,
    detail: phase.text,
    context: phase.when,
    link: chapterLink(roundChapter?.id, section?.id),
  };
});

const combatSteps = COMBAT_SEQUENCE.map((text, index) => {
  const split = text.indexOf(". ");
  return {
    symbol: String(index + 1),
    title: split >= 0 ? text.slice(0, split) : text,
    detail: split >= 0 ? text.slice(split + 2) : "",
    context: "Attack sequence",
    link: chapterLink(combatChapter?.id, "attack-sequence"),
  };
});

export default function TrainingFoldout() {
  const [topic, setTopic] = useState<"round" | "combat">("round");
  const [cursor, setCursor] = useState({round: 0, combat: 0});
  const steps = topic === "round" ? roundSteps : combatSteps;
  const index = cursor[topic];
  const step = steps[index];
  if (!step) return null;

  function goTo(position: number) {
    setCursor((previous) => ({...previous, [topic]: position}));
  }

  return <section className="training-foldout" aria-labelledby="training-foldout-title">
    <header>
      <h2 id="training-foldout-title">Table drills</h2>
      <div className="training-topics" role="group" aria-label="Choose a drill">
        <button type="button" aria-pressed={topic === "round"} onClick={() => setTopic("round")}>Walk a round</button>
        <button type="button" aria-pressed={topic === "combat"} onClick={() => setTopic("combat")}>Resolve a strike</button>
      </div>
    </header>
    <div className="training-stage">
      <div className="training-glyph" aria-hidden="true"><b>{step.symbol}</b></div>
      <div className="training-script" aria-live="polite" aria-atomic="true">
        <small>{index + 1} / {steps.length} · {step.context}</small>
        <h3>{step.title}</h3>
        <p>{step.detail}</p>
      </div>
    </div>
    <div className="training-index" role="group" aria-label="Jump to a step">
      {steps.map((item, position) => <button key={item.title} type="button"
        aria-label={`Step ${position + 1}: ${item.title}`}
        aria-current={position === index ? "step" : undefined}
        onClick={() => goTo(position)}>{item.symbol}</button>)}
    </div>
    <footer>
      <a href={step.link} onClick={() => requestAnimationFrame(() => document.getElementById(step.link.split("/")[2] ?? "")?.scrollIntoView({block: "start"}))}>Read the full rule →</a>
      <div>
        <button type="button" disabled={index === 0} onClick={() => goTo(index - 1)}>Back</button>
        <button type="button" onClick={() => goTo(index + 1 < steps.length ? index + 1 : 0)}>
          {index + 1 < steps.length ? "Next step →" : "Start again"}
        </button>
      </div>
    </footer>
  </section>;
}
