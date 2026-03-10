import type { AdaptiveLayoutGroupPresetId, UILayoutControllerPresetId } from "./UILayoutPresets";

export interface SceneLayoutBindingProfile {
  nodeName: string;
  component: "UILayoutController" | "AdaptiveLayoutGroup";
  presetId: UILayoutControllerPresetId | AdaptiveLayoutGroupPresetId;
  notes?: string;
}

export class SceneLayoutProfiles {
  public static readonly home: SceneLayoutBindingProfile[] = [
    {
      nodeName: "HomeRoot",
      component: "UILayoutController",
      presetId: "home-content",
      notes: "首页主内容区整体缩放建议。",
    },
    {
      nodeName: "LevelPanel",
      component: "AdaptiveLayoutGroup",
      presetId: "home-level-actions",
      notes: "关卡操作区横竖排切换建议。",
    },
    {
      nodeName: "ActionPanel",
      component: "AdaptiveLayoutGroup",
      presetId: "home-secondary-actions",
      notes: "分享、重置等次级操作区建议。",
    },
  ];

  public static readonly battle: SceneLayoutBindingProfile[] = [
    {
      nodeName: "TopHUD",
      component: "UILayoutController",
      presetId: "battle-hud",
      notes: "战斗 HUD 整体缩放建议。",
    },
    {
      nodeName: "ResourceBar",
      component: "AdaptiveLayoutGroup",
      presetId: "battle-resource-bar",
      notes: "资源栏横竖排切换建议。",
    },
    {
      nodeName: "ActionButtons",
      component: "AdaptiveLayoutGroup",
      presetId: "battle-action-buttons",
      notes: "开始、暂停、重开按钮区建议。",
    },
    {
      nodeName: "BuildToolbar",
      component: "AdaptiveLayoutGroup",
      presetId: "battle-toolbar",
      notes: "建造栏按钮区建议。",
    },
    {
      nodeName: "TowerPanelActions",
      component: "AdaptiveLayoutGroup",
      presetId: "tower-panel-actions",
      notes: "炮塔详情面板按钮区建议。",
    },
  ];

  public static readonly result: SceneLayoutBindingProfile[] = [
    {
      nodeName: "ResultRoot",
      component: "UILayoutController",
      presetId: "result-panel",
      notes: "结算主面板整体缩放建议。",
    },
    {
      nodeName: "ResultActions",
      component: "AdaptiveLayoutGroup",
      presetId: "result-actions",
      notes: "结算页按钮区横竖排切换建议。",
    },
  ];
}
