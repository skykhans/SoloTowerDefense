# HomeScene 节点结构说明

## 目标

本文档定义 `HomeScene` 的推荐节点结构，用于接入首页、关卡选择和本地存档展示逻辑。

## 推荐层级

```text
HomeScene
  HomeRoot
    SafeAreaRoot
    Background
    TitleArea
      GameTitle
      SubTitle
    SummaryPanel
      SummaryLabel
    LevelPanel
      LevelLabel
      LevelDetailLabel
      PrevLevelButton
      NextLevelButton
      SelectLevelButton
      StartLevelButton
        StartLevelButtonLabel
    ActionPanel
      ShareButton
        ShareButtonLabel
      ResetProgressButton
      StatusLabel
```

推荐命名常量位置：

- [`SceneNodeNames.ts`](/C:/Test/SoloTowerDefense/cocos-wechat/assets/scripts/ui/SceneNodeNames.ts)

## 节点说明

### `HomeRoot`

- 首页根节点
- 挂载 `HomeUI`
- 推荐同时挂载 `HomeSceneInstaller`
- 由 Installer 在场景加载时校验标签绑定是否完整

推荐：

- 在首页根节点下增加 `SafeAreaRoot`
- 给 `SafeAreaRoot` 挂 `SafeAreaPanel`
- 可选给 `HomeRoot` 或 `SafeAreaRoot` 挂 `UILayoutController`
- 将主要 UI 放入安全区容器

布局建议：

- 可将 `SummaryPanel / LevelPanel / ActionPanel` 作为统一内容区
- 如首页信息较多，推荐给该内容区挂 `UILayoutController`
- 推荐给 `LevelPanel` 和 `ActionPanel` 挂 `AdaptiveLayoutGroup`
- 横屏时可将关卡操作按钮横向排布，竖屏时改为纵向堆叠
- 紧凑布局下可统一缩放，减少边缘拥挤

## `HomeUI` 需要绑定

- `summaryLabel`
- `levelLabel`
- `levelDetailLabel`
- `statusLabel`
- `prevLevelButton`
- `nextLevelButton`
- `startLevelButton`
- `startLevelButtonLabel`
- `shareButton`
- `shareButtonLabel`

## 推荐按钮事件绑定

- `PrevLevelButton` -> `HomeUI.onPrevLevel`
- `NextLevelButton` -> `HomeUI.onNextLevel`
- `SelectLevelButton` -> `HomeUI.onSelectCurrentLevel`
- `StartLevelButton` -> `HomeUI.onStartSelectedLevel`
- `ResetProgressButton` -> `HomeUI.onResetProgress`
- `ShareButton` -> `HomeUI.onShareGame`

## 推荐展示内容

### `SummaryLabel`

- 最佳波次
- 金币
- 已解锁关卡数量
- 已通关关卡数量
- 历史总星级
- 推荐关卡

### `LevelLabel`

- 当前章节编号和章节名称
- 当前关卡编号
- 当前关卡名称
- 是否已解锁
- 当前历史最佳星级或通关状态

### `LevelDetailLabel`

- 当前章节说明
- 初始生命
- 初始金币
- 起始波次
- 目标波次
- 首次通关奖励结算状态

### `StatusLabel`

- 当前操作反馈
- 例如：
  - 已经是第一关
  - 下一关尚未解锁
  - 已选择当前关卡
  - 正在进入战斗
  - 当前平台信息
  - 分享回退提示
  - 结算页返回首页后的即时提示

### `StartLevelButtonLabel`

- 首次挑战时显示“开始第 X 关”
- 已通关但未满星时显示“继续挑战第 X 关”
- 已三星时显示“重刷第 X 关”
- 未解锁时显示“关卡未解锁”

### `ShareButtonLabel`

- 推荐默认显示“分享游戏”

## 当前交互反馈

- 第一关时，上一关按钮会自动置灰
- 最后一关或下一关未解锁时，下一关按钮会自动置灰
- 当前关卡未解锁时，开始按钮会自动禁用
- 通关解锁新关后，返回首页会自动选中新解锁关卡
- 挑战失败后，返回首页会保留刚才挑战的关卡

## 推荐后续扩展

- 玩家局外货币显示
- 音频开关
- 新手引导入口
- 设置按钮
- “继续游戏”按钮
