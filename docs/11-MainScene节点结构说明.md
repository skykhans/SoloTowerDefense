# MainScene 节点结构说明

## 目标

本文档定义 `cocos-wechat` 版本中 `MainScene` 的推荐节点结构，用于将现有脚本骨架接入 Cocos Creator 场景。

## 推荐层级

```text
MainScene
  GameRoot
    Managers
      GameState
      GameManager
      PathManager
      BuildSpotManager
      WaveSpawnSystem
      EnemyMovementSystem
      TowerCombatSystem
    World
      MapLayer
      BuildSpotLayer
      TowerLayer
      EnemyLayer
      BulletLayer
      EffectLayer
    UI
      SafeAreaRoot
      TopHUD
        ResourceBar
        PhaseBar
        ActionButtons
      BuildToolbar
      TowerPanel
        TowerPanelActions
      PlatformDebugPanel
```

## 节点说明

### `MainScene`

- 场景根节点
- 不直接挂业务脚本

### `GameRoot`

- 游戏主容器
- 可用于统一缩放或适配
- 推荐挂载脚本：`MainSceneInstaller`
- 负责统一校验绑定和注入依赖

### `Managers`

集中挂载核心组件。

#### `GameState`

- 挂载脚本：`GameState`
- 负责全局运行时状态

#### `GameManager`

- 挂载脚本：`GameManager`
- 负责主流程控制

需要在 Inspector 中绑定：

- `enemyLayer`
- `towerLayer`
- `enemyPrefab`
- `towerPrefab`

#### `PathManager`

- 挂载脚本：`PathManager`
- 维护路径点

#### `BuildSpotManager`

- 挂载脚本：`BuildSpotManager`
- 负责按关卡生成建造点

需要在 Inspector 中绑定：

- `buildSpotPrefab`
- `buildSpotLayer`

#### `WaveSpawnSystem`

- 挂载脚本：`WaveSpawnSystem`
- 负责按照时间顺序逐个刷出敌人，而不是一次性全部生成

#### `EnemyMovementSystem`

- 挂载脚本：`EnemyMovementSystem`
- 负责驱动敌人沿路径移动

说明：

- `pathManager` 推荐由 `MainSceneInstaller` 注入

#### `TowerCombatSystem`

- 挂载脚本：`TowerCombatSystem`
- 负责炮塔索敌、生成子弹和命中结算

需要在 Inspector 中绑定：

- `bulletLayer`
- `bulletPrefab`

可选增强绑定：

- `effectLayer`
- `hitEffectPrefab`

### `World`

承载战斗表现对象。

#### `MapLayer`

- 地图背景
- 路线装饰

#### `BuildSpotLayer`

- 用于生成建造点实例
- 推荐建造点预制体包含 `BuildSpotView`

#### `TowerLayer`

- 放置炮塔实例
- 推荐炮塔预制体包含 `TowerView`

#### `EnemyLayer`

- 放置敌人实例
- 推荐敌人预制体包含 `EnemyView`

#### `BulletLayer`

- 放置子弹实例
- 推荐子弹预制体包含 `BulletView`

#### `EffectLayer`

- 放置击中特效、爆炸特效等
- 当前可先承载 `HitEffect` 预制体

### `UI`

承载界面元素。

推荐：

- 在 `UI` 下增加 `SafeAreaRoot`
- 给 `SafeAreaRoot` 挂 `SafeAreaPanel`
- 可选给 `SafeAreaRoot`、`TopHUD`、`BuildToolbar` 或 `TowerPanel` 挂 `UILayoutController`
- 再将 `TopHUD / TowerPanel / PlatformDebugPanel` 放到安全区容器下

#### `TopHUD`

- 挂载脚本：`BattleUI`
- 绑定生命、金币、波次、击杀、最佳波次文本
- 绑定建造模式文本
- 推荐额外绑定开始波次和暂停按钮及其文本
- 可将按钮事件绑定到 `BattleUI` 上的公开方法
- `gameManager` 与 `gameState` 推荐由 `MainSceneInstaller` 注入
- 推荐在 `ResourceBar / PhaseBar / ActionButtons` 上挂 `AdaptiveLayoutGroup`
- 横屏时优先横向排布，紧凑布局下可收缩间距

#### `TowerPanel`

- 挂载脚本：`TowerPanel`
- 展示炮塔详情
- 推荐绑定标题、详情、升级花费、出售返还、提示文案和两个操作按钮
- 推荐创建命名固定的按钮区节点：`TowerPanelActions`
- 推荐在 `TowerPanelActions` 上挂 `AdaptiveLayoutGroup`
- 竖屏时可让升级/出售按钮改为纵向堆叠

#### `PlatformDebugPanel`

- 挂载脚本：`PlatformDebugPanel`
- 用于开发阶段显示当前平台、分辨率、像素比和语言
- 推荐仅在开发期保留

## 推荐接线顺序

1. 先创建 `Managers` 和 `World`
2. 挂 `GameState`
3. 挂 `PathManager`
4. 挂 `BuildSpotManager`
5. 挂 `GameManager`
6. 挂 `WaveSpawnSystem`
7. 挂 `EnemyMovementSystem`
8. 挂 `TowerCombatSystem`
9. 创建 `UI`
10. 绑定 `BattleUI`、`TowerPanel`
11. 在 `GameRoot` 挂 `MainSceneInstaller`
12. 在 `MainSceneInstaller` 中集中绑定各组件

## 当前注意事项

- `MainSceneInstaller` 会在 `onLoad()` 校验关键绑定，缺字段会直接抛错
- `GameManager` 已在 `start()` 中按当前存档关卡加载建造点
- `TowerCombatSystem` 未绑定 `bulletLayer` 和 `bulletPrefab` 时，炮塔不会发射子弹
- 结算已切到独立 `ResultScene`，`MainScene` 不再直接持有结算面板依赖
