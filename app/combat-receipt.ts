import type { PlaytestCombatExchange } from "../src/playtest-events";
import type { RuntimeStatus } from "./family-effect-runtime";

/** Saved matches may still contain identifiers written by older builds. */
export function readableCombatText(text: string) {
  return text.replace(/\blocation-\d{3}-[\w-]+(?:\s+[+-]\d+)?/gi, "Scene effect applied")
    .replace(/Character runtime:\s*[\w.-]+/gi, "Fighter ability applied");
}

export function describeTemporaryStatus(status: RuntimeStatus | undefined) {
  if (!status) return { name: "Temporary effect", detail: "Active status" };
  const names: Record<string, string> = {
    "combat.modifySpeed": "Speed", "combat.modifyDefense": "Defense", "combat.modifyAttackPower": "Attack Power",
    "combat.modifyGuard": "Guard", "combat.modifyHealing": "Healing", "combat.dealDamage": "Damage",
    "combat.preventDamage": "Damage prevention", "combat.piercing": "Piercing", "combat.grantFlow": "Flow",
    "combat.untargetable": "Untargetable", "economy.modifyCost": "Purchase cost", "core.gainFocus": "Focus", "core.draw": "Draw",
  };
  const durations: Record<string, string> = {
    nextAttack: "Next Attack", nextDefense: "Next Defense", nextDamage: "Next damage", nextIncomingAttack: "Next incoming Attack",
    nextInitiate: "Next Initiate", nextPurchase: "Next purchase", nextKata: "Next Kata", nextRound: "Next round", nextTurn: "Next turn",
    endOfTurn: "Until end of turn", endOfRound: "Until end of round", nextHonor: "Until next Honor", whileEquipped: "While equipped",
    endOfTargetNextTurn: "Until the end of the target's next turn",
  };
  const amount = status.amount ? ` ${status.amount > 0 ? "+" : ""}${status.amount}` : "";
  return { name: `${names[status.effect] ?? "Temporary effect"}${amount}`, detail: durations[status.duration] ?? "Temporary duration" };
}

/** Presentation only: never use this to calculate or change game state. */
export function explainCombatExchange(exchange: PlaytestCombatExchange) {
  const baseDamage = Math.max(0, exchange.attackPower - exchange.defensePower);
  const damageAdjustment = exchange.damage - baseDamage;
  const notes = [...new Set((exchange.notes ?? []).map((note) => {
    if (/\blocation-\d{3}-[\w-]+/i.test(note)) return "A Scene effect applied. Inspect the Scene for its printed rules.";
    if (/\b(?:runtime|resolver|effectId)\b/i.test(note)) return "A card or fighter ability affected this exchange. Inspect its printed rules for details.";
    return readableCombatText(note).trim();
  }).filter(Boolean))];
  return { baseDamage, damageAdjustment, notes };
}
