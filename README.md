# SoloTowerDefense

当前仓库包含两部分：

- [legacy-web](/C:/Test/SoloTowerDefense/legacy-web)：早期 **HTML + Canvas + 原生 JavaScript** 验证原型
- [cocos-wechat](/C:/Test/SoloTowerDefense/cocos-wechat/README.md)：新的 **Cocos Creator + TypeScript + 微信小游戏** 主开发方向

如果目标是微信小游戏，请优先使用 `cocos-wechat` 目录。

## 当前主线

当前主开发方向是：

- `Cocos Creator + TypeScript + 微信小游戏`

主线代码、文档和启动方式都围绕 [`cocos-wechat/README.md`](/C:/Test/SoloTowerDefense/cocos-wechat/README.md) 对齐。

`legacy-web/` 仅保留为早期玩法验证原型，不再继续扩展，也不代表当前技术方案。

## 主线启动

根目录提供了当前主线的一键启动脚本：

- `start.bat`
- `start.ps1`

脚本会优先尝试打开 `cocos-wechat/` 对应的 Cocos Creator 项目；如果本机未找到常见安装路径下的 Cocos Creator，则会改为打开项目目录和主场景接入文档。

现在脚本支持两种定位方式：

- 自动扫描常见安装目录
- 手动设置环境变量 `COCOS_CREATOR_EXE` 或 `COCOS_CREATOR_PATH`

## 当前已落地的 Cocos 能力

- 首页关卡选择与本地存档
- `MainScene` 单局战斗主流程
- 建造模式选择、建塔、升级、出售
- 时序刷怪、敌人移动、炮塔自动攻击
- 通关/失败后跳转 `ResultScene`
- 无后端本地存档
- 场景接线脚本与节点文档
- 最小可运行占位资源与资源检查脚本

详细说明见：

- [当前开发状态](/C:/Test/SoloTowerDefense/docs/05-当前开发状态.md)
- [MainScene节点结构说明](/C:/Test/SoloTowerDefense/docs/11-MainScene节点结构说明.md)
- [场景流转与接线规范](/C:/Test/SoloTowerDefense/docs/15-场景流转与接线规范.md)
- [Cocos场景搭建清单](/C:/Test/SoloTowerDefense/docs/18-Cocos场景搭建清单.md)
- [微信小游戏构建配置说明](/C:/Test/SoloTowerDefense/docs/19-微信小游戏构建配置说明.md)
- [微信小游戏发布前检查清单](/C:/Test/SoloTowerDefense/docs/20-微信小游戏发布前检查清单.md)
- [平台适配说明](/C:/Test/SoloTowerDefense/docs/21-平台适配说明.md)
- [资源清单校验说明](/C:/Test/SoloTowerDefense/docs/32-资源清单校验说明.md)

## 本地运行

如果你要查看旧版 Web 原型，请进入 `legacy-web` 目录后运行：

```bash
cd legacy-web
python3 -m http.server 8000
```

然后访问 <http://localhost:8000>。

Windows 下也可以直接双击：

- `legacy-web/start.bat`
- 或在 PowerShell 中运行 `legacy-web/start.ps1`

脚本会自动启动本地静态服务器，并尝试打开浏览器访问 <http://localhost:8000>。
