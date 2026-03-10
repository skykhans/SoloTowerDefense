import { PlatformService } from "./PlatformService";
import type { PlatformSystemInfo } from "./PlatformTypes";

type WeChatSystemInfo = {
  screenWidth?: number;
  screenHeight?: number;
  pixelRatio?: number;
  language?: string;
  safeArea?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    width?: number;
    height?: number;
  };
};

type WeChatLike = {
  getSystemInfoSync?: () => WeChatSystemInfo;
};

declare const wx: WeChatLike | undefined;

export class SystemInfoService {
  private static readWebSafeAreaInsets(): {
    top: number;
    bottom: number;
    left: number;
    right: number;
  } {
    if (typeof document === "undefined" || !document.body) {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    const probe = document.createElement("div");
    probe.style.position = "fixed";
    probe.style.left = "0";
    probe.style.top = "0";
    probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none";
    probe.style.paddingTop = "env(safe-area-inset-top, 0px)";
    probe.style.paddingBottom = "env(safe-area-inset-bottom, 0px)";
    probe.style.paddingLeft = "env(safe-area-inset-left, 0px)";
    probe.style.paddingRight = "env(safe-area-inset-right, 0px)";
    document.body.appendChild(probe);

    const styles = getComputedStyle(probe);
    const parseInset = (value: string): number => {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const insets = {
      top: parseInset(styles.paddingTop),
      bottom: parseInset(styles.paddingBottom),
      left: parseInset(styles.paddingLeft),
      right: parseInset(styles.paddingRight),
    };

    probe.remove();
    return insets;
  }

  public static getSystemInfo(): PlatformSystemInfo {
    const profile = PlatformService.getProfile();

    if (profile.type === "wechat-minigame" && typeof wx !== "undefined" && typeof wx.getSystemInfoSync === "function") {
      const info = wx.getSystemInfoSync() ?? {};
      const screenWidth = info.screenWidth ?? 0;
      const screenHeight = info.screenHeight ?? 0;
      const safeArea = info.safeArea;
      const safeAreaTop = safeArea?.top ?? 0;
      const safeAreaLeft = safeArea?.left ?? 0;
      const safeAreaRight = screenWidth > 0 ? Math.max(0, screenWidth - (safeArea?.right ?? screenWidth)) : 0;
      const safeAreaBottom = screenHeight > 0 ? Math.max(0, screenHeight - (safeArea?.bottom ?? screenHeight)) : 0;

      return {
        platformType: profile.type,
        platformName: profile.name,
        screenWidth,
        screenHeight,
        pixelRatio: info.pixelRatio ?? 1,
        language: info.language ?? "zh-CN",
        safeAreaTop,
        safeAreaBottom,
        safeAreaLeft,
        safeAreaRight,
      };
    }

    if (typeof window !== "undefined") {
      const screenWidth = window.innerWidth ?? 0;
      const screenHeight = window.innerHeight ?? 0;
      const safeAreaInsets = this.readWebSafeAreaInsets();

      return {
        platformType: profile.type,
        platformName: profile.name,
        screenWidth,
        screenHeight,
        pixelRatio: window.devicePixelRatio ?? 1,
        language: typeof navigator !== "undefined" ? navigator.language ?? "zh-CN" : "zh-CN",
        safeAreaTop: safeAreaInsets.top,
        safeAreaBottom: safeAreaInsets.bottom,
        safeAreaLeft: safeAreaInsets.left,
        safeAreaRight: safeAreaInsets.right,
      };
    }

    return {
      platformType: profile.type,
      platformName: profile.name,
      screenWidth: 0,
      screenHeight: 0,
      pixelRatio: 1,
      language: "zh-CN",
      safeAreaTop: 0,
      safeAreaBottom: 0,
      safeAreaLeft: 0,
      safeAreaRight: 0,
    };
  }
}
