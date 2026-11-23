import { SITE_STORAGE } from "./storage-keys.ts";
export const BOUT_HISTORY_KEY = SITE_STORAGE.bouts;
export type BoutRecord = { id: string; finishedAt: number; fighter: string; opponent: string; won: boolean; rounds: number; damage: number; purchases: number; belt: string };

export function readBoutHistory(raw: string | null): BoutRecord[] {
  try {
    const records: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(records)) return [];
    return records.filter((r): r is BoutRecord => Boolean(r && typeof r === "object" && typeof r.id === "string" && typeof r.fighter === "string" && typeof r.opponent === "string" && typeof r.won === "boolean" && typeof r.belt === "string" && [r.finishedAt, r.rounds, r.damage, r.purchases].every(n => Number.isFinite(n) && n >= 0))).slice(0, 30);
  } catch { return []; }
}

export function recordBout(records: BoutRecord[], record: BoutRecord): BoutRecord[] {
  if (records.some(r => r.id === record.id)) return records;
  return [record, ...records].slice(0, 30);
}

export function boutSummary(records: BoutRecord[]) {
  let streak = 0;
  for (const record of records) { if (!record.won) break; streak++; }
  return { wins: records.filter(r => r.won).length, bouts: records.length, streak };
}

// The inventory is a count of known cards, never the order of a hidden deck.
export function countInventory(ids: string[]): { id: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
  return [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([id, count]) => ({ id, count }));
}
