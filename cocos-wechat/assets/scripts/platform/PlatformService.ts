import { MemoryStorageAdapter } from "./MemoryStorageAdapter";
import type { PlatformProfile } from "./PlatformTypes";
import { WebStorageAdapter } from "./WebStorageAdapter";
import { WeChatStorageAdapter } from "./WeChatStorageAdapter";

type WeChatLike = {
  getSystemInfoSync?: () => unknown;
  getStorageSync?: (key: string) => string;
};

declare const wx: WeChatLike | undefined;

export class PlatformService {
  private static profile: PlatformProfile | null = null;

  public static getProfile(): PlatformProfile {
    if (!this.profile) {
      this.profile = this.detectProfile();
    }

    return this.profile;
  }

  public static reset(): void {
    this.profile = null;
  }

  public static isWeChatMiniGame(): boolean {
    return this.getProfile().type === "wechat-minigame";
  }

  private static detectProfile(): PlatformProfile {
    if (typeof wx !== "undefined" && (typeof wx.getSystemInfoSync === "function" || typeof wx.getStorageSync === "function")) {
      return {
        type: "wechat-minigame",
        name: "微信小游戏",
        storageName: "wx-storage",
        storage: new WeChatStorageAdapter(),
      };
    }

    if (typeof window !== "undefined" && window.localStorage) {
      return {
        type: "web",
        name: "Web",
        storageName: "web-local-storage",
        storage: new WebStorageAdapter(),
      };
    }

    return {
      type: "unknown",
      name: "Unknown",
      storageName: "memory-fallback",
      storage: new MemoryStorageAdapter(),
    };
  }
}
