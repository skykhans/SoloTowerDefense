# ResultScene 节点结构说明

## 目标

本文档定义 `ResultScene` 的推荐节点结构，用于承载战斗结算、回首页和再来一局逻辑。

## 推荐层级

```text
ResultScene
  ResultRoot
    Background
    ResultPanel
      ResultTitle
      ResultLabel
      ActionHintLabel
      ResultActions
        NextLevelButton
          NextLevelButtonLabel
        ShareButton
          ShareButtonLabel
        RetryButton
        BackHomeButton
```

推荐命名常量位置：

- [`SceneNodeNames.ts`](/C:/Test/SoloTowerDefense/assets/scripts/ui/SceneNodeNames.ts)

## 节点说明

### `ResultRoot`

- 结算场景根节点
- 可直接挂载 `ResultUI`
- 推荐同时挂载 `ResultSceneInstaller`
- 由 Installer 在场景加载时校验必要绑定
- 可选挂 `UILayoutController`，统一处理紧凑布局缩放

### `ResultPanel`

- 结算内容容器
- 推荐绑定为 `panelRoot`
- 推荐创建命名固定的按钮区节点：`ResultActions`
- 推荐在 `ResultActions` 上挂 `AdaptiveLayoutGroup`
- 横屏时可让 `RetryButton / BackHomeButton / ShareButton` 横向排列

## `ResultUI` 需要绑定

- `panelRoot`
- `resultLabel`
- `titleLabel`
- `actionHintLabel`
- `retryButton`
- `backHomeButton`
- `nextLevelButton`
- `nextLevelButtonLabel`
- `shareButton`
- `shareButtonLabel`

## 推荐按钮事件绑定

- `RetryButton` -> `ResultUI.onRetryBattle`
- `BackHomeButton` -> `ResultUI.onBackHome`
- `NextLevelButton` -> `ResultUI.onGoToNextLevel`
- `ShareButton` -> `ResultUI.onShareResult`

## 数据来源

`ResultScene` 不直接依赖 `GameManager` 或 `GameState`。

推荐通过：

- `BattleResultSession`

读取上一场战斗的会话结果数据，再更新：

- 本地存档
- 结算文案
- 下一步按钮逻辑
- 返回首页后的默认关卡焦点

## 推荐展示内容

### 失败结算

- 到达波次
- 累计击杀
- 失败提示
- 推荐标题显示“失败”

### 胜利结算

- 完成关卡
- 达成目标波次
- 累计击杀
- 星级评价
- 结算金币
- 下一关解锁提示
- 直接进入下一关入口
- 推荐标题显示“胜利”

说明：

- 只要后续关卡配置存在，胜利后都应允许直接进入下一关

### `ActionHintLabel`

- 用于展示下一步建议
- 例如：
  - 返回首页查看解锁内容
  - 再来一局
  - 重新选择关卡
  - 首次通关奖励
  - 分享成功或回退提示

## 推荐后续扩展

- 星级评价
- 奖励金币/钻石
- 广告双倍奖励按钮
- 继续下一关按钮
