import resourceManifestData from "../config/ResourceManifestData.json";

export interface SceneAssetProfile {
  sceneName: string;
  textureGroup: string;
  suggestedAssets: string[];
  notes: string;
}

const sceneManifest = resourceManifestData.scene;

export class SceneAssetProfiles {
  public static readonly home: SceneAssetProfile = sceneManifest.home;

  public static readonly battle: SceneAssetProfile = sceneManifest.battle;

  public static readonly result: SceneAssetProfile = sceneManifest.result;
}
