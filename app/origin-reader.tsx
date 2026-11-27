import { useState } from "react";
import department from "./assets/art/header-backstory-v2.webp";
import expo from "./assets/art/backstory-expo-v3.webp";
import cabinet from "./assets/art/cards-archive-v3.webp";
import tournament from "./assets/art/home-expo-v3.webp";
import "./origin-reader.css";

const scenes = [
  { tab: "The Department", title: "A straightforward job", art: department },
  { tab: "The Expo", title: "The fountain incident", art: expo },
  { tab: "The Cabinet", title: "Filed under tax receipts", art: cabinet },
  { tab: "The Tournament", title: "Licensed to fight", art: tournament },
];

export default function OriginReader({ paragraphs }: { paragraphs: string[] }) {
  const [page, setPage] = useState(0);
  const scene = scenes[page];

  return <section className="origin-reader" aria-labelledby="origin-heading">
    <header className="origin-cover">
      <div><span className="eyebrow">The Backstory</span><h1 id="origin-heading">How the cabinet fell.</h1></div>
      <p>{paragraphs[0]}</p>
    </header>
    <div className="origin-sheet">
      <figure className="origin-frame">
        <img key={scene.art} src={scene.art} alt="" decoding="async" />
        <figcaption className="origin-folio">Panel {page + 1} / {scenes.length}</figcaption>
      </figure>
      <div className="origin-narration">
        <div aria-live="polite" aria-atomic="true"><h2>{scene.title}</h2><p>{paragraphs[page + 1]}</p></div>
        <div className="origin-turn" aria-label="Story controls">
          <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}>← Previous</button>
          <button type="button" onClick={() => setPage((page + 1) % scenes.length)}>{page === scenes.length - 1 ? "Read again ↺" : "Next panel →"}</button>
        </div>
      </div>
    </div>
    <nav className="origin-strip" aria-label="Choose a story panel">
      {scenes.map((item, index) => <button key={item.tab} type="button" aria-pressed={index === page} onClick={() => setPage(index)}>
        <img src={item.art} loading="lazy" alt="" /><span>{item.tab}</span>
      </button>)}
    </nav>
  </section>;
}
