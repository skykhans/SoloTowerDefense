import { type PlayerSaveData } from "./SaveData";
import { PlatformService } from "../platform/PlatformService";
import { SystemInfoService } from "../platform/SystemInfoService";

export class StartupLogService {
  public static buildSummary(save: PlayerSaveData): string {
    const profile = PlatformService.getProfile();
    const systemInfo = SystemInfoService.getSystemInfo();

    return [
      `平台 ${profile.name} (${profile.type})`,
      `存储 ${profile.storageName}`,
      `分辨率 ${systemInfo.screenWidth} x ${systemInfo.screenHeight}`,
      `安全区 上${systemInfo.safeAreaTop} 下${systemInfo.safeAreaBottom} 左${systemInfo.safeAreaLeft} 右${systemInfo.safeAreaRight}`,
      `像素比 ${systemInfo.pixelRatio}`,
      `语言 ${systemInfo.language}`,
      `当前关卡 ${save.selectedLevel}`,
      `最佳波次 ${save.bestWave}`,
      `已解锁关卡 ${save.unlockedLevels.join(",")}`,
    ].join(" | ");
  }

  public static log(save: PlayerSaveData): void {
    const summary = this.buildSummary(save);
    // Keep startup diagnostics in one place so Web preview and WeChat preview read the same way.
    console.info(`[Startup] ${summary}`);
  }
}
