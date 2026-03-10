import type { LevelDefinition } from "../config/LevelConfig";
import type { LevelProgressData, PlayerSaveData } from "./SaveData";

export class HomeProgressService {
  public static getClearedLevelCount(save: PlayerSaveData): number {
    return Object.values(save.levelProgress).filter((progress) => progress.cleared).length;
  }

  public static getTotalStars(save: PlayerSaveData): number {
    return Object.values(save.levelProgress).reduce((sum, progress) => sum + progress.bestStars, 0);
  }

  public static getRecommendedLevelId(save: PlayerSaveData, levels: LevelDefinition[]): number {
    const firstUnlockedUncleared = levels.find((level) => {
      const progress = save.levelProgress[String(level.id)];
      return save.unlockedLevels.includes(level.id) && !progress?.cleared;
    });

    if (firstUnlockedUncleared) {
      return firstUnlockedUncleared.id;
    }

    const unlockedLevels = levels.filter((level) => save.unlockedLevels.includes(level.id));
    return unlockedLevels[unlockedLevels.length - 1]?.id ?? levels[0]?.id ?? 1;
  }

  public static getLevelActionText(
    level: LevelDefinition,
    isUnlocked: boolean,
    progress?: LevelProgressData
  ): string {
    if (!isUnlocked) {
      return "关卡未解锁";
    }

    if (!progress?.cleared) {
      return `开始第 ${level.id} 关`;
    }

    return progress.bestStars >= 3 ? `重刷第 ${level.id} 关` : `继续挑战第 ${level.id} 关`;
  }

  public static getLevelProgressText(progress?: LevelProgressData): string {
    if (!progress?.cleared) {
      return "未通关";
    }

    return `已通关 | 星级 ${"★".repeat(progress.bestStars)}${"☆".repeat(3 - progress.bestStars)}`;
  }
}
