import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { certifyPlaytest } from "../scripts/playtest-certification.mjs";
import { describeTemporaryStatus, explainCombatExchange, readableCombatText } from "../app/combat-receipt.ts";

const playtestCss = readFileSync(new URL("../app/playtest.css", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const playtestSource = readFileSync(new URL("../app/playtest.tsx", import.meta.url), "utf8");
const mainSource = readFileSync(new URL("../src/main.tsx", import.meta.url), "utf8");

test("combat receipts distinguish the base comparison from final damage", () => {
  const base = { id: "test", actor: "player", target: "ai", attackCardId: "jab", defenseCardId: null, zone: "High", attackPower: 7, defensePower: 4, damage: 2, outcome: "hit" };
  assert.deepEqual(explainCombatExchange(base), { baseDamage: 3, damageAdjustment: -1, notes: [] });
  assert.deepEqual(explainCombatExchange({ ...base, attackPower: 2, defensePower: 5, damage: 0, outcome: "block" }), { baseDamage: 0, damageAdjustment: 0, notes: [] });
  assert.deepEqual(explainCombatExchange({ ...base, damage: 5 }), { baseDamage: 3, damageAdjustment: 2, notes: [] });
});

test("combat receipts hide legacy engine identifiers without changing saved logs", () => {
  const line = "Computer attacks. location-008-first-attack-minus -1. Choose a Defense.";
  assert.equal(readableCombatText(line), "Computer attacks. Scene effect applied. Choose a Defense.");
  const notes = explainCombatExchange({ attackPower: 4, defensePower: 3, damage: 1, notes: ["location-008-first-attack-minus -1", "Character runtime: character.example", "Tempo +1"] }).notes;
  assert.deepEqual(notes, ["A Scene effect applied. Inspect the Scene for its printed rules.", "A card or fighter ability affected this exchange. Inspect its printed rules for details.", "Tempo +1"]);
});

test("temporary status choices use player-facing names and timing", () => {
  assert.deepEqual(describeTemporaryStatus({ sourceEffectId: "opaque", effect: "combat.modifySpeed", target: "self", amount: -2, duration: "endOfRound" }), { name: "Speed -2", detail: "Until end of round" });
  assert.deepEqual(describeTemporaryStatus({ sourceEffectId: "opaque", effect: "unknown.internal", target: "self", amount: 0, duration: "unrecognized" }), { name: "Temporary effect", detail: "Temporary duration" });
});

test("live mode cards keep readable contrast across lighting and accent choices", () => {
  const rule = (css, selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
    assert.ok(match, `missing CSS rule: ${selector}`);
    return match[1];
  };
  const tokens = (body) => Object.fromEntries([...body.matchAll(/(--pf-[\w-]+)\s*:\s*(#[\da-f]{6})/gi)].map((match) => [match[1], match[2]]));
  const luminance = (hex) => {
    const channels = hex.slice(1).match(/../g).map((part) => parseInt(part, 16) / 255).map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
  };
  const contrast = (a, b) => { const values = [luminance(a), luminance(b)].sort((x, y) => y - x); return (values[0] + .05) / (values[1] + .05); };
  for (const [css, card, number, status, body] of [
    [playtestCss, ".play-mode-card.is-live", ".play-mode-card.is-live .play-mode-number", ".play-mode-card.is-live .play-mode-status", ".play-mode-card.is-live p"],
    [globalCss, ".home-mode-card.is-live", ".home-mode-card.is-live .home-mode-index", ".home-mode-card.is-live .home-mode-status", ".home-mode-card.is-live p"],
  ]) {
    assert.match(rule(css, card), /color:\s*#fffaf0;\s*background:\s*var\(--pf-blue-deep\)/);
    assert.match(rule(css, `${card}::after`), /background:\s*var\(--pf-blue-deep\)/);
    assert.match(rule(css, number), /color:\s*var\(--pf-brass\)/);
    assert.match(rule(css, status), /color:\s*var\(--pf-brass\)/);
    const bodyColor = rule(css, body).match(/color:\s*(#[\da-f]{6})/i)?.[1];
    assert.ok(bodyColor);
    for (const theme of ["light", "dark"]) for (const accent of ["ember", "crimson", "hot-pink", "cobalt", "brass", "plum", "guard"]) {
      const palette = { ...tokens(rule(globalCss, ":root")), ...(theme === "dark" ? tokens(rule(globalCss, ':root[data-theme="dark"]')) : {}), ...(accent === "ember" ? {} : tokens(rule(globalCss, `:root[data-accent="${accent}"]`))), ...(theme === "dark" && accent !== "ember" ? tokens(rule(globalCss, `:root[data-theme="dark"][data-accent="${accent}"]`)) : {}) };
      for (const foreground of ["#fffaf0", bodyColor, palette["--pf-brass"]]) {
        assert.ok(contrast(foreground, palette["--pf-blue-deep"]) >= 4.5, `${card}: ${theme}/${accent} ${foreground} lacks contrast`);
      }
    }
  }
});

test("Playtest certifies every catalog card through canonical structured execution", async () => {
  const report = await certifyPlaytest();
  assert.deepEqual(report.failures, []);
  assert.equal(report.catalogCards, report.registeredCards);
  assert.equal(report.catalogCards, report.fullyPlannedCards);
  assert.equal(report.structuredEffects, report.supportedEffects);
  assert.equal(report.unsupportedEffects, 0);
  assert.equal(report.emptyCanonicalEntries, report.emptyStarterEntries);
  assert.equal(report.unsupportedCombos.length, 0);
});

test("hand Inspect controls stay above the hovered card face", () => {
  assert.match(
    playtestCss,
    /\.playtest-shell--live \.play-card-inspect \{[\s\S]*?z-index: calc\(var\(--layer-floating\) \+ 1\);/,
  );
});

test("featured Combo launcher has a real accessible toggle", () => {
  assert.match(playtestSource, /data-combo-popout="ready"/);
  assert.match(playtestSource, /aria-expanded=\{comboPanelOpen\}/);
  assert.match(playtestSource, /onClick=\{toggleComboPanel\}/);
  assert.match(playtestSource, /onKeyDown=\{handleComboHeaderKeyDown\}/);
  assert.match(playtestCss, /@media \(min-width: 761px\) \{[\s\S]*?ascend-market:has\(\.ascend-featured-combo\[data-combo-popout="ready"\]\) \{ display: grid;/);
  assert.doesNotMatch(mainSource, /ascend-combo-popout/);
});
