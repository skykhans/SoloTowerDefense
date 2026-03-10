import type { StorageAdapter } from "./PlatformTypes";

export class WebStorageAdapter implements StorageAdapter {
  public getItem(key: string): string {
    if (typeof window === "undefined" || !window.localStorage) {
      return "";
    }

    return window.localStorage.getItem(key) ?? "";
  }

  public setItem(key: string, value: string): void {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    window.localStorage.setItem(key, value);
  }

  public removeItem(key: string): void {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    window.localStorage.removeItem(key);
  }
}
