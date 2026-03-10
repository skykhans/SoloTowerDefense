export const SCENE_NAMES = {
  home: "HomeScene",
  battle: "MainScene",
  result: "ResultScene",
} as const;

export type SceneName = (typeof SCENE_NAMES)[keyof typeof SCENE_NAMES];
