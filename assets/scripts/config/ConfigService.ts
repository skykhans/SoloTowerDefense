import { CHAPTER_CONFIG, type ChapterDefinition } from "./ChapterConfig";
import { ENEMY_CONFIG, type EnemyDefinition, type EnemyTypeId } from "./EnemyConfig";
import { LEVEL_CONFIG, type LevelDefinition } from "./LevelConfig";
import {
  AUDIO_ASSET_MANIFEST,
  PREFAB_ASSET_MANIFEST,
  SCENE_ASSET_MANIFEST,
  type AudioAssetProfile,
  type PrefabAssetId,
  type SceneAssetId,
} from "./ResourceManifest";
import { TOWER_CONFIG, type TowerDefinition, type TowerTypeId } from "./TowerConfig";
import { createWaveDefinition, type WaveDefinition } from "./WaveConfig";
import type { PrefabAssetProfile } from "../entities/PrefabAssetProfiles";
import type { SceneAssetProfile } from "../ui/SceneAssetProfiles";

export class ConfigService {
  public static getChapterConfig(id: number): ChapterDefinition {
    return CHAPTER_CONFIG[id];
  }

  public static getTowerConfig(id: TowerTypeId): TowerDefinition {
    return TOWER_CONFIG[id];
  }

  public static getEnemyConfig(id: EnemyTypeId): EnemyDefinition {
    return ENEMY_CONFIG[id];
  }

  public static getLevelConfig(id: number): LevelDefinition {
    return LEVEL_CONFIG[id];
  }

  public static getWaveConfig(wave: number): WaveDefinition {
    return createWaveDefinition(wave);
  }

  public static getAllLevelConfigs(): LevelDefinition[] {
    return Object.values(LEVEL_CONFIG);
  }

  public static getAllChapterConfigs(): ChapterDefinition[] {
    return Object.values(CHAPTER_CONFIG);
  }

  public static getSceneAssetProfile(id: SceneAssetId): SceneAssetProfile {
    return SCENE_ASSET_MANIFEST[id];
  }

  public static getPrefabAssetProfile(id: PrefabAssetId): PrefabAssetProfile {
    return PREFAB_ASSET_MANIFEST[id];
  }

  public static getAudioAssetProfile(): AudioAssetProfile {
    return AUDIO_ASSET_MANIFEST;
  }
}
