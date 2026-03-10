import resourceManifestData from "../config/ResourceManifestData.json";

export interface PrefabAssetProfile {
  prefabName: string;
  textureGroup: string;
  suggestedSpriteNames: string[];
  notes: string;
}

const prefabManifest = resourceManifestData.prefab;

export class PrefabAssetProfiles {
  public static readonly enemy: PrefabAssetProfile = prefabManifest.enemy;

  public static readonly tower: PrefabAssetProfile = prefabManifest.tower;

  public static readonly buildSpot: PrefabAssetProfile = prefabManifest.buildSpot;

  public static readonly bullet: PrefabAssetProfile = prefabManifest.bullet;

  public static readonly hitEffect: PrefabAssetProfile = prefabManifest.hitEffect;
}
