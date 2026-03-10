export interface PrefabAssetProfile {
  prefabName: string;
  textureGroup: string;
  suggestedSpriteNames: string[];
  notes: string;
}

export class PrefabAssetProfiles {
  public static readonly enemy: PrefabAssetProfile = {
    prefabName: "Enemy.prefab",
    textureGroup: "textures/enemies/",
    suggestedSpriteNames: [
      "enemy-normal-placeholder.png",
      "enemy-fast-placeholder.png",
      "enemy-heavy-placeholder.png",
      "enemy-boss-placeholder.png",
      "enemy-hpbar-fill-placeholder.png",
    ],
    notes: "优先准备四类敌人占位图和一张血条填充图。",
  };

  public static readonly tower: PrefabAssetProfile = {
    prefabName: "Tower.prefab",
    textureGroup: "textures/towers/",
    suggestedSpriteNames: [
      "tower-base-placeholder.png",
      "tower-rapid-placeholder.png",
      "tower-cannon-placeholder.png",
      "tower-frost-placeholder.png",
      "tower-selection-ring-placeholder.png",
      "tower-range-indicator-placeholder.png",
    ],
    notes: "优先准备塔底座、三类塔身、选中圈和范围圈占位图。",
  };

  public static readonly buildSpot: PrefabAssetProfile = {
    prefabName: "BuildSpot.prefab",
    textureGroup: "textures/ui/",
    suggestedSpriteNames: [
      "buildspot-available-placeholder.png",
      "buildspot-occupied-placeholder.png",
      "buildspot-hint-placeholder.png",
    ],
    notes: "建造点前期可直接用纯色圆形或方形占位图。",
  };

  public static readonly bullet: PrefabAssetProfile = {
    prefabName: "Bullet.prefab",
    textureGroup: "textures/effects/",
    suggestedSpriteNames: [
      "bullet-rapid-placeholder.png",
      "bullet-cannon-placeholder.png",
      "bullet-frost-placeholder.png",
    ],
    notes: "子弹资源前期可用小型发光点或简化几何图形。",
  };

  public static readonly hitEffect: PrefabAssetProfile = {
    prefabName: "HitEffect.prefab",
    textureGroup: "textures/effects/",
    suggestedSpriteNames: [
      "hit-effect-core-placeholder.png",
    ],
    notes: "命中特效前期一张中心高亮图即可。",
  };
}
