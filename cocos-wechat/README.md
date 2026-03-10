# SoloTowerDefense Cocos 微信小游戏版

这个目录用于承载新的 `Cocos Creator + TypeScript + 微信小游戏` 版本。

## 当前状态

当前已完成首批工程骨架与核心脚本结构，包括：

- 配置层：炮塔、敌人、波次
- 核心状态层：`GameState`、本地存档、场景导航
- 平台层：运行环境识别与存储适配
- 平台能力层：系统信息、震动、分享统一入口
- 实体层：敌人、炮塔、子弹、建造点
- 系统层：`GameManager`、刷怪、移动、战斗
- 地图层：`PathManager`、建造点管理
- 场景层：`HomeScene`、`MainScene`、`ResultScene` 接线脚本
- UI 层：`HomeUI`、`BattleUI`、`TowerPanel`、`ResultUI`

## 推荐目录

```text
cocos-wechat/
  assets/
    audio/
    prefabs/
    scenes/
    scripts/
      config/
      core/
      entities/
      map/
      scenes/
      systems/
    textures/
      ui/
```

## 建议下一步

1. 用 Cocos Creator 打开这个目录并初始化工程元文件
2. 创建 `HomeScene / MainScene / ResultScene`
3. 将各场景 Installer 挂到场景根节点
4. 按 `docs/11-18` 绑定脚本、节点和预制体
5. 创建路径点、建造点、敌人、炮塔、子弹、命中特效预制体
6. 接入微信小游戏导出配置

## 直接开工建议

如果你准备进 Cocos Creator 直接搭场景，建议按下面顺序看文档：

1. [Cocos场景搭建清单](/C:/Test/SoloTowerDefense/docs/18-Cocos场景搭建清单.md)
2. [MainScene节点结构说明](/C:/Test/SoloTowerDefense/docs/11-MainScene节点结构说明.md)
3. [预制体接入说明](/C:/Test/SoloTowerDefense/docs/12-预制体接入说明.md)
4. [预制体视觉结构规范](/C:/Test/SoloTowerDefense/docs/16-预制体视觉结构规范.md)
5. [MainScene界面布局建议](/C:/Test/SoloTowerDefense/docs/17-MainScene界面布局建议.md)
6. [微信小游戏构建配置说明](/C:/Test/SoloTowerDefense/docs/19-微信小游戏构建配置说明.md)
7. [微信小游戏发布前检查清单](/C:/Test/SoloTowerDefense/docs/20-微信小游戏发布前检查清单.md)

## 说明

旧版 `legacy-web/` 是早期 Web 原型，仅保留作逻辑参考，不再作为主开发方向。
