import { PrefabAssetProfiles, type PrefabAssetProfile } from "../entities/PrefabAssetProfiles";
import { SceneAssetProfiles, type SceneAssetProfile } from "../ui/SceneAssetProfiles";

export type SceneAssetId = "home" | "battle" | "result";
export type PrefabAssetId = "enemy" | "tower" | "buildSpot" | "bullet" | "hitEffect";

export interface AudioAssetProfile {
  group: string;
  suggestedFiles: string[];
  notes: string;
}

export const SCENE_ASSET_MANIFEST: Record<SceneAssetId, SceneAssetProfile> = {
  home: SceneAssetProfiles.home,
  battle: SceneAssetProfiles.battle,
  result: SceneAssetProfiles.result,
};

export const PREFAB_ASSET_MANIFEST: Record<PrefabAssetId, PrefabAssetProfile> = {
  enemy: PrefabAssetProfiles.enemy,
  tower: PrefabAssetProfiles.tower,
  buildSpot: PrefabAssetProfiles.buildSpot,
  bullet: PrefabAssetProfiles.bullet,
  hitEffect: PrefabAssetProfiles.hitEffect,
};

export const AUDIO_ASSET_MANIFEST: AudioAssetProfile = {
  group: "audio/sfx/",
  suggestedFiles: [
    "build.wav",
    "upgrade.wav",
    "hit.wav",
    "enemy-death.wav",
    "victory.wav",
    "failure.wav",
  ],
  notes: "第一版先用占位音频跑通建造、命中、胜负反馈。",
};
