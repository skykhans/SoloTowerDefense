export interface SceneAssetProfile {
  sceneName: string;
  textureGroup: string;
  suggestedAssets: string[];
  notes: string;
}

export class SceneAssetProfiles {
  public static readonly home: SceneAssetProfile = {
    sceneName: "HomeScene",
    textureGroup: "textures/ui/",
    suggestedAssets: [
      "home-background-placeholder.png",
      "home-title-panel-placeholder.png",
      "home-summary-panel-placeholder.png",
      "home-level-panel-placeholder.png",
      "home-action-panel-placeholder.png",
      "button-primary-placeholder.png",
      "button-secondary-placeholder.png",
    ],
    notes: "首页前期优先保证背景、面板和按钮的可辨识性。",
  };

  public static readonly battle: SceneAssetProfile = {
    sceneName: "MainScene",
    textureGroup: "textures/backgrounds/",
    suggestedAssets: [
      "battle-map-background-placeholder.png",
      "battle-path-placeholder.png",
      "battle-hud-panel-placeholder.png",
      "battle-toolbar-panel-placeholder.png",
      "battle-tower-panel-placeholder.png",
    ],
    notes: "战斗场景前期优先跑通地图、HUD 和塔面板背景。",
  };

  public static readonly result: SceneAssetProfile = {
    sceneName: "ResultScene",
    textureGroup: "textures/ui/",
    suggestedAssets: [
      "result-background-placeholder.png",
      "result-panel-placeholder.png",
      "button-primary-placeholder.png",
      "button-secondary-placeholder.png",
    ],
    notes: "结算场景前期优先保证面板和按钮层次清晰。",
  };
}
