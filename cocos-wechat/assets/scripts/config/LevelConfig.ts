import { Vec3 } from "cc";

export interface LevelDefinition {
  id: number;
  chapterId: number;
  name: string;
  startingLives: number;
  startingGold: number;
  pathId: string;
  buildSpots: Vec3[];
  waveStart: number;
  targetWave: number;
  firstClearCoinReward: number;
}

export const LEVEL_CONFIG: Record<number, LevelDefinition> = {
  1: {
    id: 1,
    chapterId: 1,
    name: "边境防线",
    startingLives: 20,
    startingGold: 120,
    pathId: "path-1",
    waveStart: 1,
    targetWave: 5,
    firstClearCoinReward: 100,
    buildSpots: [
      new Vec3(-300, 20, 0),
      new Vec3(-140, 40, 0),
      new Vec3(-90, -140, 0),
      new Vec3(50, 150, 0),
      new Vec3(140, -30, 0),
      new Vec3(300, 120, 0),
      new Vec3(360, -60, 0),
      new Vec3(410, -220, 0),
    ],
  },
  2: {
    id: 2,
    chapterId: 1,
    name: "双岔路口",
    startingLives: 18,
    startingGold: 150,
    pathId: "path-2",
    waveStart: 2,
    targetWave: 6,
    firstClearCoinReward: 150,
    buildSpots: [
      new Vec3(-320, 90, 0),
      new Vec3(-220, -40, 0),
      new Vec3(-60, 120, 0),
      new Vec3(10, -120, 0),
      new Vec3(170, 60, 0),
      new Vec3(250, -150, 0),
      new Vec3(360, 100, 0),
      new Vec3(430, -40, 0),
    ],
  },
  3: {
    id: 3,
    chapterId: 2,
    name: "护盾前线",
    startingLives: 16,
    startingGold: 170,
    pathId: "path-3",
    waveStart: 3,
    targetWave: 7,
    firstClearCoinReward: 220,
    buildSpots: [
      new Vec3(-350, 130, 0),
      new Vec3(-260, -20, 0),
      new Vec3(-110, 120, 0),
      new Vec3(-20, -150, 0),
      new Vec3(120, 50, 0),
      new Vec3(210, -120, 0),
      new Vec3(330, 110, 0),
      new Vec3(430, -90, 0),
    ],
  },
};
