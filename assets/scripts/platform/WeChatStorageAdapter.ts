import type { StorageAdapter } from "./PlatformTypes";

type WeChatStorageLike = {
  getStorageSync: (key: string) => string;
  setStorageSync: (key: string, value: string) => void;
  removeStorageSync?: (key: string) => void;
};

declare const wx: WeChatStorageLike | undefined;

export class WeChatStorageAdapter implements StorageAdapter {
  public getItem(key: string): string {
    if (typeof wx === "undefined" || typeof wx.getStorageSync !== "function") {
      return "";
    }

    return wx.getStorageSync(key) ?? "";
  }

  public setItem(key: string, value: string): void {
    if (typeof wx === "undefined" || typeof wx.setStorageSync !== "function") {
      return;
    }

    wx.setStorageSync(key, value);
  }

  public removeItem(key: string): void {
    if (typeof wx === "undefined") {
      return;
    }

    if (typeof wx.removeStorageSync === "function") {
      wx.removeStorageSync(key);
      return;
    }

    if (typeof wx.setStorageSync === "function") {
      wx.setStorageSync(key, "");
    }
  }
}
