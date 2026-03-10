import { SystemInfoService } from "./SystemInfoService";

export type UILayoutMode = "compact" | "standard";

export interface UILayoutProfile {
  mode: UILayoutMode;
  isLandscape: boolean;
  safePaddingTop: number;
  safePaddingBottom: number;
  safePaddingLeft: number;
  safePaddingRight: number;
}

export class UILayoutService {
  public static getLayoutProfile(): UILayoutProfile {
    const info = SystemInfoService.getSystemInfo();
    const isLandscape = info.screenWidth >= info.screenHeight;
    const shortSide = Math.min(info.screenWidth, info.screenHeight);

    return {
      mode: shortSide > 0 && shortSide < 420 ? "compact" : "standard",
      isLandscape,
      safePaddingTop: Math.max(0, info.safeAreaTop),
      safePaddingBottom: Math.max(0, info.safeAreaBottom),
      safePaddingLeft: Math.max(0, info.safeAreaLeft),
      safePaddingRight: Math.max(0, info.safeAreaRight),
    };
  }
}
