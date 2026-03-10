import type { PrefabAssetProfile } from "../entities/PrefabAssetProfiles";
import type { SceneAssetProfile } from "../ui/SceneAssetProfiles";
import resourceManifestData from "./ResourceManifestData.json";

export type SceneAssetId = "home" | "battle" | "result";
export type PrefabAssetId = "enemy" | "tower" | "buildSpot" | "bullet" | "hitEffect";

export interface AudioAssetProfile {
  group: string;
  suggestedFiles: string[];
  notes: string;
}

export const SCENE_ASSET_MANIFEST: Record<SceneAssetId, SceneAssetProfile> = resourceManifestData.scene;

export const PREFAB_ASSET_MANIFEST: Record<PrefabAssetId, PrefabAssetProfile> = resourceManifestData.prefab;

export const AUDIO_ASSET_MANIFEST: AudioAssetProfile = resourceManifestData.audio;
