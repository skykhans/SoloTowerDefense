import { STORAGE_KEYS } from "./StorageKeys";
import { PlayerSaveData, createDefaultSaveData } from "./SaveData";
import { PlatformService } from "../platform/PlatformService";

export class LocalStorageService {
  public static loadPlayerSave(): PlayerSaveData {
    const raw = this.getItem(STORAGE_KEYS.playerSave);
    if (!raw) {
      return createDefaultSaveData();
    }

    try {
      const parsed = JSON.parse(raw) as Partial<PlayerSaveData>;
      return {
        ...createDefaultSaveData(),
        ...parsed,
      };
    } catch {
      return createDefaultSaveData();
    }
  }

  public static savePlayerSave(save: PlayerSaveData): void {
    this.setItem(STORAGE_KEYS.playerSave, JSON.stringify(save));
  }

  public static updatePlayerSave(updater: (save: PlayerSaveData) => PlayerSaveData): PlayerSaveData {
    const nextSave = updater(this.loadPlayerSave());
    this.savePlayerSave(nextSave);
    return nextSave;
  }

  public static clearPlayerSave(): void {
    this.removeItem(STORAGE_KEYS.playerSave);
  }

  private static getItem(key: string): string {
    return PlatformService.getProfile().storage.getItem(key);
  }

  private static setItem(key: string, value: string): void {
    PlatformService.getProfile().storage.setItem(key, value);
  }

  private static removeItem(key: string): void {
    PlatformService.getProfile().storage.removeItem(key);
  }
}
