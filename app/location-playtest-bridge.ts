import {
  isStructuredLocation,
  resolveLocationEffects,
  type LocationCardLike,
  type LocationContext,
} from "./location-effect-resolvers.ts";
import {
  locationRuntimeDelta,
  locationUsageContext,
  markLocationCommandsUsed,
  resetLocationRound,
  resetLocationScene,
  resetLocationTurn,
  usedAcrossPlayersAfter,
  type LocationRuntimeDelta,
  type LocationTrackedState,
} from "./location-runtime.ts";

export type LocationHostEventContext = Omit<LocationContext, "locationEvent">;

export type LocationHostResolution<T extends LocationTrackedState> = {
  delta: LocationRuntimeDelta;
  state: T;
  usedAcrossPlayersThisRound: string[];
};

/**
 * Thin host boundary for structured Location effects.
 *
 * The play surface emits semantic events and ordinary context facts. The
 * canonical Location registry decides which effects match; the runtime turns
 * those commands into state deltas. No Location IDs, names, or printed prose
 * belong in this bridge.
 */
export function resolveLocationHostEvent<T extends LocationTrackedState>(
  card: LocationCardLike,
  state: T,
  locationEvent: string,
  context: LocationHostEventContext = {},
  usedAcrossPlayersThisRound: readonly string[] = [],
): LocationHostResolution<T> {
  const commands = resolveLocationEffects(card, {
    ...context,
    ...locationUsageContext(state, usedAcrossPlayersThisRound),
    locationEvent,
  });
  return {
    delta: locationRuntimeDelta(commands),
    state: markLocationCommandsUsed(state, commands),
    usedAcrossPlayersThisRound: usedAcrossPlayersAfter(commands, usedAcrossPlayersThisRound),
  };
}

export type LegacyAttackHostContext = {
  zone?: string;
  firstAttack?: boolean;
  attackTags?: readonly string[];
  hasWeapon?: boolean;
  equipmentTags?: readonly string[];
};

function locationDeltaNotes(card: LocationCardLike, changes: { label: string; value: number }[]) {
  const name = card.name || "Current Scene";
  return changes.filter(({ value }) => value !== 0).map(({ label, value }) =>
    `${name}: ${value > 0 ? "+" : ""}${value} ${label}`,
  );
}

/**
 * Compatibility adapter for the current Quick Duel attack hook. It maps host
 * facts to canonical predicate names, but all gameplay semantics still come
 * from structured Location effects. A structured Location is authoritative
 * even when none of its effects match this specific attack, so the legacy
 * name/prose fallback must remain suppressed.
 */
export function structuredLocationAttackForHost(
  card: LocationCardLike,
  context: LegacyAttackHostContext,
) {
  const resolution = resolveLocationHostEvent(card, {}, "attack", {
    attackZone: context.zone,
    firstAttackThisTurn: Boolean(context.firstAttack),
    attackTagAny: [...(context.attackTags ?? [])],
    attackUsesEquipmentTagAny: [...(context.equipmentTags ?? [])],
    equipmentTagAny: [...(context.equipmentTags ?? [])],
    hasWeaponEquipped: Boolean(context.hasWeapon),
  });
  const { delta } = resolution;
  return {
    matched: isStructuredLocation(card),
    power: delta.attackPower,
    damage: delta.damage,
    notes: locationDeltaNotes(card, [
      { label: "Attack Power", value: delta.attackPower },
      { label: "damage", value: delta.damage },
    ]),
  };
}

export type LegacyDefenseHostContext = {
  zone?: string;
  defenseTags?: readonly string[];
  firstDefenseThisRound?: boolean;
};

export function structuredLocationDefenseForHost(
  card: LocationCardLike,
  context: LegacyDefenseHostContext,
) {
  const resolution = resolveLocationHostEvent(card, {}, "defense", {
    defenseZone: context.zone,
    defenseTagAny: [...(context.defenseTags ?? [])],
    firstDefenseThisRound: Boolean(context.firstDefenseThisRound),
  });
  return {
    matched: isStructuredLocation(card),
    guard: resolution.delta.guard,
    notes: locationDeltaNotes(card, [{ label: "Guard", value: resolution.delta.guard }]),
  };
}

export type LegacyKataHostContext = {
  firstKataThisTurn?: boolean;
};

export function structuredLocationKataFocusForHost(
  card: LocationCardLike,
  context: LegacyKataHostContext,
) {
  const resolution = resolveLocationHostEvent(card, {}, "kataPlay", {
    firstKataThisTurn: Boolean(context.firstKataThisTurn),
  });
  return {
    matched: isStructuredLocation(card),
    focus: resolution.delta.focus,
    notes: locationDeltaNotes(card, [{ label: "Focus", value: resolution.delta.focus }]),
  };
}

export function resetLocationHostTurn<T extends LocationTrackedState>(state: T) {
  return resetLocationTurn(state);
}

export function resetLocationHostRound<T extends LocationTrackedState>(state: T) {
  return resetLocationRound(state);
}

export function resetLocationHostScene<T extends LocationTrackedState>(state: T) {
  return resetLocationScene(state);
}
