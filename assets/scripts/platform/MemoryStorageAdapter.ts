import type { StorageAdapter } from "./PlatformTypes";

export class MemoryStorageAdapter implements StorageAdapter {
  private readonly store = new Map<string, string>();

  public getItem(key: string): string {
    return this.store.get(key) ?? "";
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  public removeItem(key: string): void {
    this.store.delete(key);
  }
}
