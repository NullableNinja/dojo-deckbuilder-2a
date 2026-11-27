import { useState } from "react";
import "./term-practice.css";

type Term = { term: string; meaning: string };

function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let end = result.length - 1; end > 0; end--) {
    const index = Math.floor(Math.random() * (end + 1));
    [result[index], result[end]] = [result[end], result[index]];
  }
  return result;
}

export default function TermPractice({ entries }: { entries: Term[] }) {
  const [queue, setQueue] = useState<Term[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(false);
  const card = queue[0];
  function deal() {
    const hand = shuffled(entries).slice(0, 5);
    setQueue(hand);
    setTotal(hand.length);
    setRevealed(false);
    setActive(true);
  }
  function grade(retry: boolean) {
    setQueue(current => retry ? [...current.slice(1), current[0]] : current.slice(1));
    setRevealed(false);
  }
  return <section className="term-practice" aria-labelledby="practice-title">
    <div><span className="eyebrow">Recall practice</span><h2 id="practice-title">Five terms on the mat.</h2>
    <p>Say each definition aloud, then turn the card. Deal a tough term back into your hand for another try.</p></div>
    <div className="practice-sheet">
      <div aria-live="polite" aria-atomic="true">
        <small>{active ? card ? `${total - queue.length} of ${total} recalled` : "Hand complete" : "Glossary flashcards"}</small>
        <h3>{active ? card?.term ?? "You cleared the hand." : "Ready to deal?"}</h3>
        {revealed && card && <p>{card.meaning}</p>}
      </div>
      <div className="practice-actions">{!active || !card ? <button type="button" onClick={deal} disabled={!entries.length}>{active ? "Deal another hand" : "Deal five terms"}</button> : revealed ? <><button type="button" onClick={() => grade(false)}>I knew it</button><button type="button" onClick={() => grade(true)}>Practice again</button></> : <button type="button" onClick={() => setRevealed(true)}>Turn card</button>}</div>
    </div>
  </section>;
}
