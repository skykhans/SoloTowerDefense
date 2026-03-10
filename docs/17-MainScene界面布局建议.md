# MainScene 界面布局建议

## 目标

本文档给出 `MainScene` 中战斗 HUD 与炮塔详情面板的推荐布局，便于在 Cocos Creator 中直接照着搭建节点。

## 推荐布局

```text
UI
  SafeAreaRoot
  TopHUD
    ResourceBar
      LivesLabel
      GoldLabel
      WaveLabel
      KillsLabel
      BestWaveLabel
    PhaseBar
      PhaseLabel
      BuildModeLabel
    ActionButtons
      StartWaveButton
        StartWaveButtonLabel
      PauseButton
        PauseButtonLabel
      RestartButton
  BuildToolbar
    RapidButton
    CannonButton
    FrostButton
    ClearBuildSelectionButton
  TowerPanel
    TowerPanelTitle
    TowerInfoLabel
    UpgradeValueLabel
    SellValueLabel
    ActionHintLabel
    UpgradeButton
    SellButton
  PlatformDebugPanel
    DebugInfoLabel
```

## TopHUD

适合放在屏幕顶部，承载全局战斗信息。

推荐内容：

- `LivesLabel`
- `GoldLabel`
- `WaveLabel`
- `KillsLabel`
- `BestWaveLabel`
- `PhaseLabel`
- `BuildModeLabel`

说明：

- 推荐将 `TopHUD / BuildToolbar / TowerPanel / PlatformDebugPanel` 放在 `SafeAreaRoot` 下
- 后续如果接入刘海屏或异形屏，可优先通过 `SafeAreaPanel` 调整
- `SafeAreaPanel` 会在画布尺寸变化时自动刷新安全区偏移

## ActionButtons

适合放在顶部右侧或底部右侧。

推荐内容：

- `StartWaveButton`
- `PauseButton`
- `RestartButton`

说明：

- `StartWaveButtonLabel`
  - 根据阶段显示“开始波次 / 出兵中 / 清场中 / 战斗结束”
- `PauseButtonLabel`
  - 根据状态显示“暂停 / 继续”
- 推荐给 `ActionButtons` 挂 `AdaptiveLayoutGroup`
- 横屏时横向排列，竖屏或紧凑布局下可减小间距或改为纵向

## BuildToolbar

适合放在屏幕底部或左下角。

推荐按钮：

- `RapidButton`
- `CannonButton`
- `FrostButton`
- `ClearBuildSelectionButton`

说明：

- 切换建造模式后，场景中的空闲建造位会自动显示提示
- 切换建造模式时，当前选中的炮塔会自动取消选中
- 推荐给 `BuildToolbar` 挂 `AdaptiveLayoutGroup`
- 小屏设备下可压缩按钮间距，必要时改为双列或纵向布局

## TowerPanel

适合放在屏幕右侧或底部浮层。

推荐内容：

- `TowerPanelTitle`
- `TowerInfoLabel`
- `UpgradeValueLabel`
- `SellValueLabel`
- `ActionHintLabel`
- `UpgradeButton`
- `SellButton`

说明：

- 未选中炮塔时，面板显示占位文案并禁用按钮
- 选中炮塔后，自动展示等级、伤害、射程、攻速、减速效果
- 金币不足时，升级按钮自动禁用

## PlatformDebugPanel

适合放在左上角或右下角，不干扰主玩法区域。

推荐内容：

- `DebugInfoLabel`

说明：

- 用于显示当前平台、分辨率、像素比、语言与安全区边距
- 推荐只在开发阶段保留
- 画布尺寸变化时会自动刷新显示

## 当前收益

- `BattleUI` 与 `TowerPanel` 的 Inspector 字段更容易一一对应
- 方便后续做横屏和竖屏适配
- 资源层和逻辑层的对齐更直接
- 适配逻辑有统一收口，不需要各 UI 脚本自己算安全边距
- 可在 `TopHUD / BuildToolbar / TowerPanel` 或其父节点上挂 `UILayoutController`，统一处理紧凑布局缩放
- 可在具体按钮组和信息栏上挂 `AdaptiveLayoutGroup`，统一切换横竖排与间距
