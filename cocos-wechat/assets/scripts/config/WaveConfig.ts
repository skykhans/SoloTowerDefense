import type { EnemyTypeId } from "./EnemyConfig";

export interface WaveEntry {
  enemyType: EnemyTypeId;
  count: number;
  interval: number;
}

export interface WaveDefinition {
  wave: number;
  entries: WaveEntry[];
  totalCount: number;
}

export function createWaveDefinition(wave: number): WaveDefinition {
  const total = 7 + wave * 2;
  const entries: WaveEntry[] = [];

  if (wave % 5 === 0) {
    entries.push({ enemyType: "normal", count: Math.max(0, total - 1), interval: 0.58 });
    entries.push({ enemyType: "boss", count: 1, interval: 1.2 });
    return { wave, entries, totalCount: total };
  }

  const fastCount = wave >= 2 ? Math.max(1, Math.floor(total * 0.28)) : 0;
  const heavyCount = wave >= 4 ? Math.max(1, Math.floor(total * 0.18)) : 0;
  const shieldCount = wave >= 3 ? Math.max(1, Math.floor(total * 0.12)) : 0;
  const normalCount = Math.max(0, total - fastCount - heavyCount - shieldCount);

  if (normalCount > 0) entries.push({ enemyType: "normal", count: normalCount, interval: 0.58 });
  if (fastCount > 0) entries.push({ enemyType: "fast", count: fastCount, interval: 0.46 });
  if (shieldCount > 0) entries.push({ enemyType: "shield", count: shieldCount, interval: 0.68 });
  if (heavyCount > 0) entries.push({ enemyType: "heavy", count: heavyCount, interval: 0.78 });

  return { wave, entries, totalCount: total };
}
