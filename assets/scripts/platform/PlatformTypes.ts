export type RuntimePlatformType = "wechat-minigame" | "web" | "unknown";

export interface StorageAdapter {
  getItem(key: string): string;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface PlatformSystemInfo {
  platformType: RuntimePlatformType;
  platformName: string;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  language: string;
  safeAreaTop: number;
  safeAreaBottom: number;
  safeAreaLeft: number;
  safeAreaRight: number;
}

export interface SharePayload {
  title: string;
  imageUrl?: string;
  query?: string;
}

export interface PlatformProfile {
  type: RuntimePlatformType;
  name: string;
  storageName: string;
  storage: StorageAdapter;
}
