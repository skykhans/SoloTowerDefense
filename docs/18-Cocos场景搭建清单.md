# Cocos 场景搭建清单

## 目标

本文档提供一个可直接执行的搭建顺序，用于在 Cocos Creator 中把当前主线脚本真正接成可运行场景。

## 一、工程准备

- [ ] 用 Cocos Creator 3.x 打开项目根目录 [`SoloTowerDefense`](../README.md)
- [ ] 确认现有 `assets/scenes/`
- [ ] 确认现有 `assets/prefabs/`
- [ ] 确认现有 `assets/textures/`
- [ ] 确认现有 `assets/audio/`

## 二、当前最小可运行场景

- [ ] 确认 `assets/scenes/HomeScene.scene`
- [ ] 确认 `assets/scenes/MainScene.scene`
- [ ] 确认 `assets/scenes/ResultScene.scene`
- [ ] 确认 3 张场景分别挂有运行时 bootstrap
- [ ] 先验证预览不会黑屏

## 三、正式接线补完

- [ ] 将 `HomeScene` 从 runtime bootstrap 逐步替换为正式 `HomeUI + HomeSceneInstaller`
- [ ] 将 `MainScene` 从 runtime bootstrap 逐步替换为正式 `MainSceneInstaller + 预制体 Inspector 绑定`
- [ ] 将 `ResultScene` 从 runtime bootstrap 逐步替换为正式 `ResultUI + ResultSceneInstaller`
- [ ] 创建敌人、炮塔、建造点、子弹、命中特效预制体
- [ ] 完成场景结构自检和预制体结构自检
