# platform

当前目录用于存放运行平台适配层。

当前职责：

- 识别运行环境
- 统一本地存储入口
- 为后续微信小游戏能力接入预留收口

当前文件：

- `PlatformTypes.ts`
- `PlatformService.ts`
- `WeChatStorageAdapter.ts`
- `WebStorageAdapter.ts`
- `MemoryStorageAdapter.ts`
- `SystemInfoService.ts`
- `VibrationService.ts`
- `ShareService.ts`
- `UILayoutService.ts`

后续建议补入：

- 登录与云能力接入
