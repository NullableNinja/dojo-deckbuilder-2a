import { useMemo, useState } from "react";
import type { CardEntry } from "./search";
import "./archive-counter.css";

const drawers = [
  { family: "Item", title: "Lost property", note: "Someone filed a tactical baguette as equipment. Pull open the drawer and see what else passed inspection.", ids: ["DDB-WPN-CORE-059", "DDB-WPN-CORE-018", "DDB-WPN-CORE-051", "DDB-WPN-CORE-026"] },
  { family: "Character", title: "Fighter portraits", note: "Meet the delegation one fighter at a time. Inspect a portrait to read the ability they bring to the mat.", ids: ["DDB-CHR-CORE-001", "DDB-CHR-CORE-006", "DDB-CHR-CORE-018", "DDB-CHR-CORE-028"] },
  { family: "Location", title: "Scene permits", note: "Every venue has its own fine print. Inspect a scene before your next change of location.", ids: ["DDB-LOC-CORE-002", "DDB-LOC-CORE-003", "DDB-LOC-CORE-004", "DDB-LOC-CORE-001"] },
  { family: "Technique", title: "Technique files", note: "A guard, a strike, a kata. Thumb through the techniques and read their printed instructions.", ids: ["DDB-DEF-CORE-001", "DDB-ATK-CORE-004", "DDB-KAT-CORE-001", "DDB-ATK-CORE-002"] },
];

interface ArchiveProps {
  cards: CardEntry[];
  imageUrl: (card: CardEntry) => string;
  onInspect: (card: CardEntry) => void;
  onBrowse: (family: string) => void;
}

export default function ArchiveCounter({ cards, imageUrl, onInspect, onBrowse }: ArchiveProps) {
  const [drawerIndex, setDrawerIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const drawer = drawers[drawerIndex];
  const family = useMemo(() => cards.filter((card) => card.cardType === drawer.family), [cards, drawer]);
  const picks = useMemo(() => {
    const selection = drawer.ids.flatMap((id) => family.find((card) => card.catalogId === id) ?? []);
    return selection.length ? selection : family.slice(0, 4);
  }, [drawer, family]);
  const card = picks[position] ?? picks[0];
  const step = (direction: number) => setPosition((current) => (current + direction + picks.length) % picks.length);
  return <header className="p11-cabinet" aria-label="Card Library">
    <div className="p11-case">
      <div className="p11-case-copy">
        <span>Card Library · {cards.length} files</span>
        <h1>The card cabinet</h1>
        <p>{drawer.note}</p>
        <button className="p11-open-drawer" type="button" onClick={() => onBrowse(drawer.family)}>Browse {family.length} {drawer.family.toLowerCase()} cards →</button>
      </div>
      <div className="p11-display">
        {card && <>
          <div className="p11-spread">
            {picks.length > 2 && <>
              <div className="p11-preview is-left" aria-hidden="true"><img src={imageUrl(picks[(position + picks.length - 1) % picks.length])} alt="" /></div>
              <div className="p11-preview is-right" aria-hidden="true"><img src={imageUrl(picks[(position + 1) % picks.length])} alt="" /></div>
            </>}
            <button type="button" className="p11-feature" onClick={() => onInspect(card)} aria-label={`Inspect ${card.name}`}><img src={imageUrl(card)} alt="" /></button>
          </div>
          <div className="p11-case-caption" aria-live="polite"><small>{card.catalogId} · {position + 1}/{picks.length}</small><strong>{card.name}</strong></div>
          {picks.length > 1 && <div className="p11-stepper"><button type="button" aria-label="Previous featured card" onClick={() => step(-1)}>←</button><button type="button" aria-label="Next featured card" onClick={() => step(1)}>→</button></div>}
        </>}
      </div>
    </div>
    <div className="p11-drawers" role="group" aria-label="Exhibition drawers">
      {drawers.map((entry, index) => <button type="button" className="p11-drawer" key={entry.family} aria-pressed={index === drawerIndex} onClick={() => { setDrawerIndex(index); setPosition(0); }}>{entry.title}</button>)}
    </div>
  </header>;
}
