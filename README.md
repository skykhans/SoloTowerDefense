# SoloTowerDefense

当前仓库根目录就是主 Cocos 工程，技术方向为 `Cocos Creator + TypeScript + 微信小游戏`。

`legacy-web/` 仍然保留，但它只是早期的 HTML + Canvas 验证原型。由于 Cocos 主线还没有完全把场景、预制体和编辑器接线全部落完，所以现阶段不删除它，只作为玩法和数值参考。

## 当前结构

- `assets/`、`.creator/`、`settings/`、`profiles/`、`package.json`、`tsconfig.json`
  - 当前 Cocos Creator 项目本体
- `docs/`
  - 项目文档、场景结构说明、部署说明、检查清单
- `tools/`
  - 开发辅助脚本
- `legacy-web/`
  - 旧版可玩原型，仅归档保留
- `start.bat` / `start.ps1`
  - 主线一键启动脚本

## 主线启动

根目录提供了当前主线的一键启动脚本：

- `start.bat`
- `start.ps1`

脚本会优先尝试打开当前仓库根目录对应的 Cocos Creator 项目；如果本机未找到常见安装路径下的 Cocos Creator，则会改为打开项目目录和主场景接入文档。

支持两种定位方式：

- 自动扫描常见安装目录
- 手动设置环境变量 `COCOS_CREATOR_EXE` 或 `COCOS_CREATOR_PATH`

## 当前已落地的 Cocos 能力

- 首页关卡选择与本地存档
- `MainScene` 单局战斗主流程
- 建造模式选择、建塔、升级、出售
- 时序刷怪、敌人移动、炮塔自动攻击
- 通关/失败后跳转 `ResultScene`
- 无后端本地存档
- 运行时原型场景 bootstrap
- 最小可运行占位资源与资源检查脚本

详细说明见：

- [当前开发状态](/C:/Test/SoloTowerDefense/docs/05-当前开发状态.md)
- [目录结构说明](/C:/Test/SoloTowerDefense/docs/07-目录结构说明.md)
- [MainScene节点结构说明](/C:/Test/SoloTowerDefense/docs/11-MainScene节点结构说明.md)
- [场景流转与接线规范](/C:/Test/SoloTowerDefense/docs/15-场景流转与接线规范.md)
- [Cocos场景搭建清单](/C:/Test/SoloTowerDefense/docs/18-Cocos场景搭建清单.md)
- [微信小游戏构建配置说明](/C:/Test/SoloTowerDefense/docs/19-微信小游戏构建配置说明.md)
- [平台适配说明](/C:/Test/SoloTowerDefense/docs/21-平台适配说明.md)
- [资源清单校验说明](/C:/Test/SoloTowerDefense/docs/32-资源清单校验说明.md)

## legacy-web 说明

如果你要查看旧版 Web 原型，请进入 `legacy-web` 目录后运行：

```bash
cd legacy-web
python3 -m http.server 8000
```

然后访问 <http://localhost:8000>。
