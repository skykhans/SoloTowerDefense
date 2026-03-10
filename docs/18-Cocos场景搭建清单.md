# Cocos 场景搭建清单

## 目标

本文档提供一个可直接执行的搭建顺序，用于在 Cocos Creator 中把当前 `cocos-wechat` 主线脚本真正接成可运行场景。

## 使用方式

- 按顺序完成
- 每完成一项就勾掉
- 建议优先完成 `HomeScene`、`MainScene`、`ResultScene`

## 一、工程准备

- [ ] 用 Cocos Creator 3.x 打开 [`cocos-wechat`](/C:/Test/SoloTowerDefense/cocos-wechat/README.md) 目录
- [ ] 让编辑器生成工程元文件
- [ ] 确认现有 `assets/scenes/`
- [ ] 确认现有 `assets/prefabs/`
- [ ] 确认现有 `assets/textures/`
- [ ] 确认现有 `assets/audio/`

## 二、创建 HomeScene

- [ ] 创建 `assets/scenes/HomeScene.scene`
- [ ] 创建根节点 `HomeRoot`
- [ ] 给 `HomeRoot` 挂 `HomeUI`
- [ ] 给 `HomeRoot` 挂 `HomeSceneInstaller`
- [ ] 可选：给 `HomeRoot` 或首页内容区挂 `UILayoutController`
- [ ] 可选：给 `LevelPanel` 和 `ActionPanel` 挂 `AdaptiveLayoutGroup`
- [ ] 如启用布局预设，`HomeRoot` 可设置 `home-content`
- [ ] 如启用布局预设，`LevelPanel` 可设置 `home-level-actions`
- [ ] 如启用布局预设，`ActionPanel` 可设置 `home-secondary-actions`
- [ ] 创建 `SummaryLabel`
- [ ] 创建 `LevelLabel`
- [ ] 创建 `LevelDetailLabel`
- [ ] 创建 `StatusLabel`
- [ ] 创建 `PrevLevelButton`
- [ ] 创建 `NextLevelButton`
- [ ] 创建 `SelectLevelButton`
- [ ] 创建 `StartLevelButton`
- [ ] 在 `StartLevelButton` 下创建 `StartLevelButtonLabel`
- [ ] 创建 `ResetProgressButton`
- [ ] 在 Inspector 中将上述节点绑定到 `HomeUI`
- [ ] 将 `PrevLevelButton / NextLevelButton / SelectLevelButton / StartLevelButton / ResetProgressButton` 的点击事件绑定到 `HomeUI`
- [ ] 在 `HomeSceneInstaller` Inspector 中绑定 `homeUI`
- [ ] 运行后确认：
  - [ ] 第一关时上一关按钮不可点击
  - [ ] 未解锁关卡时开始按钮不可点击
  - [ ] 开始按钮文字会变化

## 三、创建 MainScene

- [ ] 创建 `assets/scenes/MainScene.scene`
- [ ] 创建根节点 `GameRoot`
- [ ] 给 `GameRoot` 挂 `MainSceneInstaller`

### Managers

- [ ] 创建 `Managers`
- [ ] 创建 `GameState` 节点并挂 `GameState`
- [ ] 创建 `GameManager` 节点并挂 `GameManager`
- [ ] 创建 `PathManager` 节点并挂 `PathManager`
- [ ] 创建 `BuildSpotManager` 节点并挂 `BuildSpotManager`
- [ ] 创建 `WaveSpawnSystem` 节点并挂 `WaveSpawnSystem`
- [ ] 创建 `EnemyMovementSystem` 节点并挂 `EnemyMovementSystem`
- [ ] 创建 `TowerCombatSystem` 节点并挂 `TowerCombatSystem`

### World

- [ ] 创建 `World`
- [ ] 创建 `MapLayer`
- [ ] 创建 `BuildSpotLayer`
- [ ] 创建 `TowerLayer`
- [ ] 创建 `EnemyLayer`
- [ ] 创建 `BulletLayer`
- [ ] 创建 `EffectLayer`

### UI

- [ ] 创建 `UI`
- [ ] 可选：创建 `SafeAreaRoot`
- [ ] 可选：给 `SafeAreaRoot` 挂 `SafeAreaPanel`
- [ ] 如挂 `SafeAreaPanel`，确认节点上已有 `Widget`
- [ ] 可选：给 `SafeAreaRoot`、`TopHUD` 或 `BuildToolbar` 挂 `UILayoutController`
- [ ] 可选：给 `ResourceBar / PhaseBar / ActionButtons / BuildToolbar / TowerPanel按钮区` 挂 `AdaptiveLayoutGroup`
- [ ] 如启用布局预设，`TopHUD` 可设置 `battle-hud`
- [ ] 如启用布局预设，`ResourceBar` 可设置 `battle-resource-bar`
- [ ] 如启用布局预设，`ActionButtons` 可设置 `battle-action-buttons`
- [ ] 如启用布局预设，`BuildToolbar` 可设置 `battle-toolbar`
- [ ] 如启用布局预设，`TowerPanel` 按钮区可设置 `tower-panel-actions`
- [ ] 创建 `TopHUD`
- [ ] 给 `TopHUD` 挂 `BattleUI`
- [ ] 创建 `LivesLabel`
- [ ] 创建 `GoldLabel`
- [ ] 创建 `WaveLabel`
- [ ] 创建 `KillsLabel`
- [ ] 创建 `BestWaveLabel`
- [ ] 创建 `PhaseLabel`
- [ ] 创建 `BuildModeLabel`
- [ ] 创建 `StartWaveButton`
- [ ] 在 `StartWaveButton` 下创建 `StartWaveButtonLabel`
- [ ] 创建 `PauseButton`
- [ ] 在 `PauseButton` 下创建 `PauseButtonLabel`
- [ ] 创建 `RestartButton`
- [ ] 创建 `BuildToolbar`
- [ ] 创建 `RapidButton`
- [ ] 创建 `CannonButton`
- [ ] 创建 `FrostButton`
- [ ] 创建 `ClearBuildSelectionButton`
- [ ] 创建 `TowerPanel`
- [ ] 给 `TowerPanel` 挂 `TowerPanel`
- [ ] 创建 `TowerPanelActions`
- [ ] 创建 `TowerPanelTitle`
- [ ] 创建 `TowerInfoLabel`
- [ ] 创建 `UpgradeValueLabel`
- [ ] 创建 `SellValueLabel`
- [ ] 创建 `ActionHintLabel`
- [ ] 创建 `UpgradeButton`
- [ ] 创建 `SellButton`
- [ ] 可选：创建 `PlatformDebugPanel`
- [ ] 可选：给 `PlatformDebugPanel` 挂 `PlatformDebugPanel`
- [ ] 可选：创建 `DebugInfoLabel`

### MainScene 绑定

- [ ] 在 `BattleUI` 中绑定所有 Label / Button 字段
- [ ] 将建造按钮、开始波次、暂停、重开按钮点击事件绑定到 `BattleUI`
- [ ] 如启用安全区容器，将 `TopHUD / BuildToolbar / TowerPanel / PlatformDebugPanel` 放入 `SafeAreaRoot`
- [ ] 如启用安全区容器，切换分辨率后确认 `SafeAreaPanel` 会自动刷新偏移
- [ ] 如启用 `UILayoutController`，切换分辨率后确认缩放与显隐切换会自动刷新
- [ ] 在 `TowerPanel` 中绑定标题、详情、花费、提示和按钮字段
- [ ] 将升级、出售按钮点击事件绑定到 `TowerPanel`
- [ ] 如启用调试面板，在 `PlatformDebugPanel` 中绑定 `panelRoot / infoLabel`
- [ ] 如启用调试面板，切换分辨率后确认安全区和分辨率信息会自动刷新
- [ ] 在 `MainSceneInstaller` 中绑定：
  - [ ] `gameState`
  - [ ] `gameManager`
  - [ ] `pathManager`
  - [ ] `buildSpotManager`
  - [ ] `waveSpawnSystem`
  - [ ] `enemyMovementSystem`
  - [ ] `towerCombatSystem`
  - [ ] `battleUI`
  - [ ] `towerPanel`
  - [ ] `platformDebugPanel`（可选）
- [ ] 在 `GameManager` 中绑定：
  - [ ] `enemyLayer`
  - [ ] `towerLayer`
  - [ ] `enemyPrefab`
  - [ ] `towerPrefab`
- [ ] 在 `BuildSpotManager` 中绑定：
  - [ ] `buildSpotPrefab`
  - [ ] `buildSpotLayer`
- [ ] 在 `TowerCombatSystem` 中绑定：
  - [ ] `bulletLayer`
  - [ ] `bulletPrefab`
  - [ ] `effectLayer`（可选）
  - [ ] `hitEffectPrefab`（可选）

## 四、创建 ResultScene

- [ ] 创建 `assets/scenes/ResultScene.scene`
- [ ] 创建根节点 `ResultRoot`
- [ ] 给 `ResultRoot` 挂 `ResultUI`
- [ ] 给 `ResultRoot` 挂 `ResultSceneInstaller`
- [ ] 可选：给 `ResultRoot` 或 `ResultPanel` 挂 `UILayoutController`
- [ ] 可选：给结算按钮区挂 `AdaptiveLayoutGroup`
- [ ] 如启用布局预设，`ResultRoot` 或 `ResultPanel` 可设置 `result-panel`
- [ ] 如启用布局预设，结算按钮区可设置 `result-actions`
- [ ] 创建 `ResultPanel`
- [ ] 创建 `ResultActions`
- [ ] 创建 `ResultTitle`
- [ ] 创建 `ResultLabel`
- [ ] 创建 `ActionHintLabel`
- [ ] 创建 `NextLevelButton`
- [ ] 在 `NextLevelButton` 下创建 `NextLevelButtonLabel`
- [ ] 创建 `RetryButton`
- [ ] 创建 `BackHomeButton`
- [ ] 在 Inspector 中把上述节点绑定到 `ResultUI`
- [ ] 将 `NextLevelButton / RetryButton / BackHomeButton` 的点击事件绑定到 `ResultUI`
- [ ] 在 `ResultSceneInstaller` 中绑定 `resultUI`
- [ ] 运行后确认：
  - [ ] 胜利时标题显示“胜利”
  - [ ] 失败时标题显示“失败”
  - [ ] 提示文案会变化

## 五、创建预制体

### Enemy.prefab

- [ ] 创建 `Enemy.prefab`
- [ ] 挂 `Enemy`
- [ ] 挂 `EnemyView`
- [ ] 创建 `NormalVisual`
- [ ] 创建 `FastVisual`
- [ ] 创建 `HeavyVisual`
- [ ] 创建 `BossVisual`
- [ ] 创建 `HpBarFill`
- [ ] 绑定 `EnemyView` 字段

### Tower.prefab

- [ ] 创建 `Tower.prefab`
- [ ] 挂 `Tower`
- [ ] 挂 `TowerView`
- [ ] 创建 `RapidVisual`
- [ ] 创建 `CannonVisual`
- [ ] 创建 `FrostVisual`
- [ ] 创建 `SelectionRing`
- [ ] 创建 `RangeIndicator`
- [ ] 绑定 `TowerView` 字段

### BuildSpot.prefab

- [ ] 创建 `BuildSpot.prefab`
- [ ] 挂 `BuildSpot`
- [ ] 挂 `BuildSpotClickHandler`
- [ ] 挂 `BuildSpotView`
- [ ] 创建 `AvailableVisual`
- [ ] 创建 `OccupiedVisual`
- [ ] 创建 `BuildModeHintVisual`
- [ ] 绑定 `BuildSpotView` 字段

### Bullet.prefab

- [ ] 创建 `Bullet.prefab`
- [ ] 挂 `Bullet`
- [ ] 挂 `BulletView`
- [ ] 创建 `RapidVisual`
- [ ] 创建 `CannonVisual`
- [ ] 创建 `FrostVisual`
- [ ] 绑定 `BulletView` 字段

### HitEffect.prefab

- [ ] 创建 `HitEffect.prefab`
- [ ] 挂 `HitEffect`
- [ ] 创建 `CoreVisual`
- [ ] 绑定 `HitEffect.coreVisual`

## 六、运行前检查

- [ ] 三个场景名与 `SceneNames.ts` 一致
- [ ] 三个场景根节点名与 `SceneNodeNames.ts` 一致
- [ ] 所有 Installer 无缺字段报错
- [ ] 所有 Installer 无结构节点缺失报错
- [ ] `MainSceneInstaller` 校验通过
- [ ] `HomeSceneInstaller` 校验通过
- [ ] `ResultSceneInstaller` 校验通过
- [ ] 首页可以进入战斗
- [ ] 战斗结束可以进入结算
- [ ] 结算页可以返回首页、重开或进入下一关

## 七、推荐联动阅读

- [MainScene节点结构说明](/C:/Test/SoloTowerDefense/docs/11-MainScene节点结构说明.md)
- [预制体接入说明](/C:/Test/SoloTowerDefense/docs/12-预制体接入说明.md)
- [HomeScene节点结构说明](/C:/Test/SoloTowerDefense/docs/13-HomeScene节点结构说明.md)
- [ResultScene节点结构说明](/C:/Test/SoloTowerDefense/docs/14-ResultScene节点结构说明.md)
- [场景流转与接线规范](/C:/Test/SoloTowerDefense/docs/15-场景流转与接线规范.md)
- [预制体视觉结构规范](/C:/Test/SoloTowerDefense/docs/16-预制体视觉结构规范.md)
- [MainScene界面布局建议](/C:/Test/SoloTowerDefense/docs/17-MainScene界面布局建议.md)
- [界面适配实践说明](/C:/Test/SoloTowerDefense/docs/23-界面适配实践说明.md)
- [布局预设说明](/C:/Test/SoloTowerDefense/docs/24-布局预设说明.md)
- [场景布局模板说明](/C:/Test/SoloTowerDefense/docs/25-场景布局模板说明.md)
- [场景节点命名约定](/C:/Test/SoloTowerDefense/docs/26-场景节点命名约定.md)
- [场景结构自检说明](/C:/Test/SoloTowerDefense/docs/27-场景结构自检说明.md)
- [CocosCreator安装与首次打开说明](/C:/Test/SoloTowerDefense/docs/28-CocosCreator安装与首次打开说明.md)
- [预制体结构自检说明](/C:/Test/SoloTowerDefense/docs/29-预制体结构自检说明.md)
- [最小可运行资源清单](/C:/Test/SoloTowerDefense/docs/31-最小可运行资源清单.md)
