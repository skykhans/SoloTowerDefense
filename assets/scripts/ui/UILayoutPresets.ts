import { Layout } from "cc";

export type UILayoutControllerPresetId = "custom" | "home-content" | "battle-hud" | "result-panel";
export type AdaptiveLayoutGroupPresetId =
  | "custom"
  | "home-level-actions"
  | "home-secondary-actions"
  | "battle-resource-bar"
  | "battle-action-buttons"
  | "battle-toolbar"
  | "tower-panel-actions"
  | "result-actions";

export interface UILayoutControllerPreset {
  compactScale: number;
  standardScale: number;
  portraitScale: number;
  landscapeScale: number;
}

export interface AdaptiveLayoutGroupPreset {
  portraitType: Layout.Type;
  landscapeType: Layout.Type;
  portraitResizeMode: Layout.ResizeMode;
  landscapeResizeMode: Layout.ResizeMode;
  compactSpacingX: number;
  compactSpacingY: number;
  standardSpacingX: number;
  standardSpacingY: number;
  portraitPaddingLeft: number;
  portraitPaddingRight: number;
  portraitPaddingTop: number;
  portraitPaddingBottom: number;
  landscapePaddingLeft: number;
  landscapePaddingRight: number;
  landscapePaddingTop: number;
  landscapePaddingBottom: number;
}

const controllerPresets: Record<Exclude<UILayoutControllerPresetId, "custom">, UILayoutControllerPreset> = {
  "home-content": {
    compactScale: 0.92,
    standardScale: 1,
    portraitScale: 1,
    landscapeScale: 0.96,
  },
  "battle-hud": {
    compactScale: 0.9,
    standardScale: 1,
    portraitScale: 0.96,
    landscapeScale: 1,
  },
  "result-panel": {
    compactScale: 0.94,
    standardScale: 1,
    portraitScale: 1,
    landscapeScale: 0.98,
  },
};

const adaptivePresets: Record<Exclude<AdaptiveLayoutGroupPresetId, "custom">, AdaptiveLayoutGroupPreset> = {
  "home-level-actions": {
    portraitType: Layout.Type.VERTICAL,
    landscapeType: Layout.Type.HORIZONTAL,
    portraitResizeMode: Layout.ResizeMode.CONTAINER,
    landscapeResizeMode: Layout.ResizeMode.CONTAINER,
    compactSpacingX: 10,
    compactSpacingY: 10,
    standardSpacingX: 18,
    standardSpacingY: 18,
    portraitPaddingLeft: 0,
    portraitPaddingRight: 0,
    portraitPaddingTop: 0,
    portraitPaddingBottom: 0,
    landscapePaddingLeft: 0,
    landscapePaddingRight: 0,
    landscapePaddingTop: 0,
    landscapePaddingBottom: 0,
  },
  "home-secondary-actions": {
    portraitType: Layout.Type.VERTICAL,
    landscapeType: Layout.Type.HORIZONTAL,
    portraitResizeMode: Layout.ResizeMode.CONTAINER,
    landscapeResizeMode: Layout.ResizeMode.CONTAINER,
    compactSpacingX: 8,
    compactSpacingY: 8,
    standardSpacingX: 16,
    standardSpacingY: 16,
    portraitPaddingLeft: 0,
    portraitPaddingRight: 0,
    portraitPaddingTop: 0,
    portraitPaddingBottom: 0,
    landscapePaddingLeft: 0,
    landscapePaddingRight: 0,
    landscapePaddingTop: 0,
    landscapePaddingBottom: 0,
  },
  "battle-resource-bar": {
    portraitType: Layout.Type.VERTICAL,
    landscapeType: Layout.Type.HORIZONTAL,
    portraitResizeMode: Layout.ResizeMode.CONTAINER,
    landscapeResizeMode: Layout.ResizeMode.CONTAINER,
    compactSpacingX: 8,
    compactSpacingY: 8,
    standardSpacingX: 16,
    standardSpacingY: 12,
    portraitPaddingLeft: 0,
    portraitPaddingRight: 0,
    portraitPaddingTop: 0,
    portraitPaddingBottom: 0,
    landscapePaddingLeft: 0,
    landscapePaddingRight: 0,
    landscapePaddingTop: 0,
    landscapePaddingBottom: 0,
  },
  "battle-action-buttons": {
    portraitType: Layout.Type.VERTICAL,
    landscapeType: Layout.Type.HORIZONTAL,
    portraitResizeMode: Layout.ResizeMode.CONTAINER,
    landscapeResizeMode: Layout.ResizeMode.CONTAINER,
    compactSpacingX: 8,
    compactSpacingY: 8,
    standardSpacingX: 14,
    standardSpacingY: 14,
    portraitPaddingLeft: 0,
    portraitPaddingRight: 0,
    portraitPaddingTop: 0,
    portraitPaddingBottom: 0,
    landscapePaddingLeft: 0,
    landscapePaddingRight: 0,
    landscapePaddingTop: 0,
    landscapePaddingBottom: 0,
  },
  "battle-toolbar": {
    portraitType: Layout.Type.HORIZONTAL,
    landscapeType: Layout.Type.HORIZONTAL,
    portraitResizeMode: Layout.ResizeMode.CONTAINER,
    landscapeResizeMode: Layout.ResizeMode.CONTAINER,
    compactSpacingX: 6,
    compactSpacingY: 6,
    standardSpacingX: 14,
    standardSpacingY: 10,
    portraitPaddingLeft: 0,
    portraitPaddingRight: 0,
    portraitPaddingTop: 0,
    portraitPaddingBottom: 0,
    landscapePaddingLeft: 0,
    landscapePaddingRight: 0,
    landscapePaddingTop: 0,
    landscapePaddingBottom: 0,
  },
  "tower-panel-actions": {
    portraitType: Layout.Type.VERTICAL,
    landscapeType: Layout.Type.VERTICAL,
    portraitResizeMode: Layout.ResizeMode.CONTAINER,
    landscapeResizeMode: Layout.ResizeMode.CONTAINER,
    compactSpacingX: 8,
    compactSpacingY: 8,
    standardSpacingX: 10,
    standardSpacingY: 12,
    portraitPaddingLeft: 0,
    portraitPaddingRight: 0,
    portraitPaddingTop: 0,
    portraitPaddingBottom: 0,
    landscapePaddingLeft: 0,
    landscapePaddingRight: 0,
    landscapePaddingTop: 0,
    landscapePaddingBottom: 0,
  },
  "result-actions": {
    portraitType: Layout.Type.VERTICAL,
    landscapeType: Layout.Type.HORIZONTAL,
    portraitResizeMode: Layout.ResizeMode.CONTAINER,
    landscapeResizeMode: Layout.ResizeMode.CONTAINER,
    compactSpacingX: 10,
    compactSpacingY: 10,
    standardSpacingX: 18,
    standardSpacingY: 18,
    portraitPaddingLeft: 0,
    portraitPaddingRight: 0,
    portraitPaddingTop: 0,
    portraitPaddingBottom: 0,
    landscapePaddingLeft: 0,
    landscapePaddingRight: 0,
    landscapePaddingTop: 0,
    landscapePaddingBottom: 0,
  },
};

export class UILayoutPresets {
  public static getControllerPreset(id: UILayoutControllerPresetId): UILayoutControllerPreset | null {
    if (id === "custom") {
      return null;
    }

    return controllerPresets[id];
  }

  public static getAdaptivePreset(id: AdaptiveLayoutGroupPresetId): AdaptiveLayoutGroupPreset | null {
    if (id === "custom") {
      return null;
    }

    return adaptivePresets[id];
  }
}
