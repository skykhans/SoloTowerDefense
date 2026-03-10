# CocosCreator安装与首次打开说明

## 目标

本文档用于在本机尚未安装 `Cocos Creator` 的情况下，快速完成：

- 安装编辑器
- 首次打开当前项目目录
- 确认主线目录和启动方式

## 一、需要安装什么

当前主线建议安装：

- `Cocos Creator 3.8.x`
- 微信开发者工具

说明：

- 当前项目主线基于 `Cocos Creator + TypeScript + 微信小游戏`
- 建议优先安装稳定版 `3.8.x`

## 二、安装 Cocos Creator

推荐方式：

1. 下载安装 `Cocos Dashboard`
2. 在 Dashboard 中安装 `Cocos Creator 3.8.x`

也可以直接安装独立版 `Cocos Creator`，但后续版本管理通常不如 Dashboard 方便。

## 三、安装后如何启动当前项目

安装完成后可直接运行：

- [`start.ps1`](/C:/Test/SoloTowerDefense/start.ps1)
- [`start.bat`](/C:/Test/SoloTowerDefense/start.bat)

脚本当前支持：

- 自动扫描常见安装目录
- 手动读取环境变量 `COCOS_CREATOR_EXE`
- 手动读取环境变量 `COCOS_CREATOR_PATH`

如果你的安装目录很特殊，也可以手动设置：

```powershell
$env:COCOS_CREATOR_EXE="C:\你的路径\CocosCreator.exe"
.\start.ps1
```

## 四、首次打开项目

当前主线项目目录：

- [`cocos-wechat`](/C:/Test/SoloTowerDefense/cocos-wechat/README.md)

首次打开时请注意：

- 当前仓库已经有脚本骨架和资源目录占位
- 但还没有完整的 `.scene`、`.prefab` 和工程元文件
- 需要在 Cocos Creator 中手动创建场景、预制体和资源元文件

## 五、首次进入后建议先做什么

1. 打开 `cocos-wechat/`
2. 让编辑器生成工程元文件
3. 按 [18-Cocos场景搭建清单](/C:/Test/SoloTowerDefense/docs/18-Cocos场景搭建清单.md) 创建三张主场景
4. 按 [12-预制体接入说明.md](/C:/Test/SoloTowerDefense/docs/12-预制体接入说明.md) 创建五类预制体
5. 挂上 Installer、UI、View 和系统脚本
6. 先通过结构自检，再修 Inspector 绑定问题

## 六、首次打开后优先阅读

- [18-Cocos场景搭建清单.md](/C:/Test/SoloTowerDefense/docs/18-Cocos场景搭建清单.md)
- [27-场景结构自检说明.md](/C:/Test/SoloTowerDefense/docs/27-场景结构自检说明.md)
- [12-预制体接入说明.md](/C:/Test/SoloTowerDefense/docs/12-预制体接入说明.md)
- [16-预制体视觉结构规范.md](/C:/Test/SoloTowerDefense/docs/16-预制体视觉结构规范.md)
- [31-最小可运行资源清单.md](/C:/Test/SoloTowerDefense/docs/31-最小可运行资源清单.md)

## 七、当前阶段的现实情况

当前仓库已经把主体结构、命名约定、布局模板、结构自检和战斗主流程骨架搭好了。

但在你本机没有安装 `Cocos Creator` 之前：

- 无法真正打开场景
- 无法创建 `.scene / .prefab`
- 无法在编辑器里运行和可视化检查

所以现在最关键的前置条件，还是先把编辑器装好。
