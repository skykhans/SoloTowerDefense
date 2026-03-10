import {
  AUDIO_ASSET_MANIFEST,
  PREFAB_ASSET_MANIFEST,
  SCENE_ASSET_MANIFEST,
  type PrefabAssetId,
  type SceneAssetId,
} from "./ResourceManifest";

export interface ResourceCheckResult {
  label: string;
  expectedPath: string;
  exists: boolean;
}

export interface ResourceManifestReport {
  sceneAssets: ResourceCheckResult[];
  prefabAssets: ResourceCheckResult[];
  audioAssets: ResourceCheckResult[];
  missingCount: number;
}

export class ResourceManifestValidator {
  public static buildExpectedRelativePaths(): string[] {
    const scenePaths = (Object.keys(SCENE_ASSET_MANIFEST) as SceneAssetId[]).flatMap((id) =>
      SCENE_ASSET_MANIFEST[id].suggestedAssets.map((file) => this.combinePath(SCENE_ASSET_MANIFEST[id].textureGroup, file))
    );

    const prefabPaths = (Object.keys(PREFAB_ASSET_MANIFEST) as PrefabAssetId[]).flatMap((id) =>
      PREFAB_ASSET_MANIFEST[id].suggestedSpriteNames.map((file) => this.combinePath(PREFAB_ASSET_MANIFEST[id].textureGroup, file))
    );

    const audioPaths = AUDIO_ASSET_MANIFEST.suggestedFiles.map((file) => this.combinePath(AUDIO_ASSET_MANIFEST.group, file));

    return [...new Set([...scenePaths, ...prefabPaths, ...audioPaths])];
  }

  public static createReport(existingRelativePaths: string[]): ResourceManifestReport {
    const normalizedExisting = new Set(existingRelativePaths.map((path) => this.normalizePath(path)));

    const sceneAssets = (Object.keys(SCENE_ASSET_MANIFEST) as SceneAssetId[]).flatMap((id) =>
      SCENE_ASSET_MANIFEST[id].suggestedAssets.map((file) =>
        this.createResult(`scene:${id}`, this.combinePath(SCENE_ASSET_MANIFEST[id].textureGroup, file), normalizedExisting)
      )
    );

    const prefabAssets = (Object.keys(PREFAB_ASSET_MANIFEST) as PrefabAssetId[]).flatMap((id) =>
      PREFAB_ASSET_MANIFEST[id].suggestedSpriteNames.map((file) =>
        this.createResult(`prefab:${id}`, this.combinePath(PREFAB_ASSET_MANIFEST[id].textureGroup, file), normalizedExisting)
      )
    );

    const audioAssets = AUDIO_ASSET_MANIFEST.suggestedFiles.map((file) =>
      this.createResult("audio:sfx", this.combinePath(AUDIO_ASSET_MANIFEST.group, file), normalizedExisting)
    );

    const allItems = [...sceneAssets, ...prefabAssets, ...audioAssets];

    return {
      sceneAssets,
      prefabAssets,
      audioAssets,
      missingCount: allItems.filter((item) => !item.exists).length,
    };
  }

  private static createResult(label: string, expectedPath: string, existingPaths: Set<string>): ResourceCheckResult {
    const normalized = this.normalizePath(expectedPath);
    return {
      label,
      expectedPath: normalized,
      exists: existingPaths.has(normalized),
    };
  }

  private static combinePath(group: string, file: string): string {
    return `${group}${file}`;
  }

  private static normalizePath(path: string): string {
    return path.replace(/\\/g, "/").replace(/^assets\//, "").replace(/\/{2,}/g, "/");
  }
}
