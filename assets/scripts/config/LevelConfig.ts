import type { TowerTypeId } from "./TowerConfig";
import { Vec3 } from "cc";

export interface MapObstacle {
  position: Vec3;
  radius: number;
  icon: string;
}

export interface LevelDefinition {
  id: number;
  chapterId: number;
  name: string;
  startingLives: number;
  startingGold: number;
  pathId: string;
  obstacles: MapObstacle[];
  waveStart: number;
  targetWave: number;
  firstClearCoinReward: number;
  availableTowerTypes: TowerTypeId[];
}

function createObstacles(positions: Vec3[]): MapObstacle[] {
  return positions.map((position, index) => ({
    position,
    radius: index % 3 === 0 ? 36 : 30,
    icon: index % 2 === 0 ? "🌿" : "🪵",
  }));
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
    targetWave: 20,
    firstClearCoinReward: 100,
    availableTowerTypes: ["rapid", "cannon"],
    obstacles: createObstacles([
      new Vec3(-300, 20, 0),
      new Vec3(-140, 40, 0),
      new Vec3(-90, -140, 0),
      new Vec3(50, 150, 0),
      new Vec3(140, -30, 0),
      new Vec3(300, 120, 0),
      new Vec3(360, -60, 0),
      new Vec3(410, -220, 0),
    ]),
  },
  2: {
    id: 2,
    chapterId: 1,
    name: "双岔路口",
    startingLives: 18,
    startingGold: 150,
    pathId: "path-2",
    waveStart: 2,
    targetWave: 25,
    firstClearCoinReward: 150,
    availableTowerTypes: ["rapid", "cannon"],
    obstacles: createObstacles([
      new Vec3(-320, 90, 0),
      new Vec3(-220, -40, 0),
      new Vec3(-60, 120, 0),
      new Vec3(10, -120, 0),
      new Vec3(170, 60, 0),
      new Vec3(250, -150, 0),
      new Vec3(360, 100, 0),
      new Vec3(430, -40, 0),
    ]),
  },
  3: {
    id: 3,
    chapterId: 2,
    name: "护盾前线",
    startingLives: 16,
    startingGold: 170,
    pathId: "path-3",
    waveStart: 3,
    targetWave: 30,
    firstClearCoinReward: 220,
    availableTowerTypes: ["rapid", "cannon", "frost"],
    obstacles: createObstacles([
      new Vec3(-350, 130, 0),
      new Vec3(-260, -20, 0),
      new Vec3(-110, 120, 0),
      new Vec3(-20, -150, 0),
      new Vec3(120, 50, 0),
      new Vec3(210, -120, 0),
      new Vec3(330, 110, 0),
      new Vec3(430, -90, 0),
    ]),
  },
  4: {
    id: 4,
    chapterId: 2,
    name: "峡口阻击",
    startingLives: 18,
    startingGold: 185,
    pathId: "path-1",
    waveStart: 4,
    targetWave: 22,
    firstClearCoinReward: 260,
    availableTowerTypes: ["rapid", "cannon", "frost"],
    obstacles: createObstacles([
      new Vec3(-330, 80, 0),
      new Vec3(-210, -10, 0),
      new Vec3(-120, 150, 0),
      new Vec3(20, -130, 0),
      new Vec3(120, 110, 0),
      new Vec3(210, -60, 0),
      new Vec3(310, 140, 0),
      new Vec3(400, -170, 0),
    ]),
  },
  5: {
    id: 5,
    chapterId: 2,
    name: "双桥封锁",
    startingLives: 17,
    startingGold: 200,
    pathId: "path-2",
    waveStart: 5,
    targetWave: 24,
    firstClearCoinReward: 320,
    availableTowerTypes: ["rapid", "cannon", "frost", "burst"],
    obstacles: createObstacles([
      new Vec3(-340, 120, 0),
      new Vec3(-250, -70, 0),
      new Vec3(-110, 60, 0),
      new Vec3(-30, -150, 0),
      new Vec3(120, 140, 0),
      new Vec3(190, -40, 0),
      new Vec3(320, 70, 0),
      new Vec3(420, -120, 0),
    ]),
  },
  6: {
    id: 6,
    chapterId: 2,
    name: "寒霜断层",
    startingLives: 16,
    startingGold: 215,
    pathId: "path-3",
    waveStart: 6,
    targetWave: 26,
    firstClearCoinReward: 380,
    availableTowerTypes: ["rapid", "cannon", "frost", "burst", "sniper"],
    obstacles: createObstacles([
      new Vec3(-350, 150, 0),
      new Vec3(-280, 20, 0),
      new Vec3(-150, -120, 0),
      new Vec3(-40, 140, 0),
      new Vec3(70, -150, 0),
      new Vec3(190, 70, 0),
      new Vec3(300, -80, 0),
      new Vec3(420, 120, 0),
    ]),
  },
  7: {
    id: 7,
    chapterId: 3,
    name: "钢铁阵线",
    startingLives: 16,
    startingGold: 230,
    pathId: "path-1",
    waveStart: 7,
    targetWave: 30,
    firstClearCoinReward: 460,
    availableTowerTypes: ["rapid", "cannon", "frost", "burst", "sniper"],
    obstacles: createObstacles([
      new Vec3(-340, 40, 0),
      new Vec3(-220, 140, 0),
      new Vec3(-150, -120, 0),
      new Vec3(-20, 90, 0),
      new Vec3(90, -140, 0),
      new Vec3(190, 130, 0),
      new Vec3(310, -40, 0),
      new Vec3(420, -180, 0),
    ]),
  },
  8: {
    id: 8,
    chapterId: 3,
    name: "风暴核心",
    startingLives: 15,
    startingGold: 245,
    pathId: "path-2",
    waveStart: 8,
    targetWave: 34,
    firstClearCoinReward: 560,
    availableTowerTypes: ["rapid", "cannon", "frost", "burst", "sniper", "mortar"],
    obstacles: createObstacles([
      new Vec3(-340, 90, 0),
      new Vec3(-230, -110, 0),
      new Vec3(-130, 140, 0),
      new Vec3(-20, -40, 0),
      new Vec3(110, -150, 0),
      new Vec3(170, 80, 0),
      new Vec3(320, 150, 0),
      new Vec3(430, -40, 0),
    ]),
  },
  9: {
    id: 9,
    chapterId: 3,
    name: "终局防区",
    startingLives: 15,
    startingGold: 260,
    pathId: "path-3",
    waveStart: 9,
    targetWave: 38,
    firstClearCoinReward: 680,
    availableTowerTypes: ["rapid", "cannon", "frost", "burst", "sniper", "mortar"],
    obstacles: createObstacles([
      new Vec3(-360, 130, 0),
      new Vec3(-280, -30, 0),
      new Vec3(-170, 150, 0),
      new Vec3(-40, -170, 0),
      new Vec3(80, 40, 0),
      new Vec3(180, -130, 0),
      new Vec3(320, 120, 0),
      new Vec3(430, -100, 0),
    ]),
  },
};
