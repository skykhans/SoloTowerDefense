export interface LevelProgressData {
  bestStars: number;
  cleared: boolean;
  firstClearClaimed: boolean;
}

export interface PlayerSaveData {
  version: number;
  bestWave: number;
  unlockedLevels: number[];
  selectedLevel: number;
  coins: number;
  gems: number;
  unlockedTowers: string[];
  tutorialCompleted: boolean;
  audioEnabled: boolean;
  levelProgress: Record<string, LevelProgressData>;
}

export function createDefaultSaveData(): PlayerSaveData {
  return {
    version: 1,
    bestWave: 1,
    unlockedLevels: [1],
    selectedLevel: 1,
    coins: 0,
    gems: 0,
    unlockedTowers: ["rapid", "cannon", "frost"],
    tutorialCompleted: false,
    audioEnabled: true,
    levelProgress: {},
  };
}
