import { _decorator, Component } from "cc";
import type { EnemyTypeId } from "../config/EnemyConfig";
import type { WaveDefinition, WaveEntry } from "../config/WaveConfig";

const { ccclass } = _decorator;

interface SpawnCursor {
  entryIndex: number;
  spawnedInEntry: number;
  timer: number;
  active: boolean;
}

@ccclass("WaveSpawnSystem")
export class WaveSpawnSystem extends Component {
  private wave: WaveDefinition | null = null;
  private cursor: SpawnCursor = {
    entryIndex: 0,
    spawnedInEntry: 0,
    timer: 0,
    active: false,
  };

  public startWave(wave: WaveDefinition): void {
    this.wave = wave;
    this.cursor = {
      entryIndex: 0,
      spawnedInEntry: 0,
      timer: 0,
      active: true,
    };
  }

  public stop(): void {
    this.wave = null;
    this.cursor.active = false;
  }

  public isActive(): boolean {
    return this.cursor.active;
  }

  public tick(dt: number): EnemyTypeId[] {
    if (!this.wave || !this.cursor.active) return [];

    const spawned: EnemyTypeId[] = [];
    this.cursor.timer -= dt;

    while (this.wave && this.cursor.active && this.cursor.timer <= 0) {
      const entry = this.wave.entries[this.cursor.entryIndex];
      if (!entry) {
        this.cursor.active = false;
        break;
      }

      spawned.push(entry.enemyType);
      this.cursor.spawnedInEntry += 1;

      if (this.cursor.spawnedInEntry >= entry.count) {
        this.cursor.entryIndex += 1;
        this.cursor.spawnedInEntry = 0;
      }

      const nextDelay = this.resolveNextDelay(entry);
      this.cursor.timer += nextDelay;
    }

    return spawned;
  }

  private resolveNextDelay(entry: WaveEntry): number {
    if (!this.wave) return entry.interval;
    const nextEntry = this.wave.entries[this.cursor.entryIndex];
    if (!nextEntry || nextEntry === entry) {
      return entry.interval;
    }

    // A slightly longer pause between enemy groups reads better than a uniform stream.
    return Math.max(entry.interval, 0.85);
  }
}
