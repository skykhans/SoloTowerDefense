export type TowerTypeId = "rapid" | "cannon" | "frost" | "burst" | "sniper" | "mortar";

export interface TowerDefinition {
  id: TowerTypeId;
  name: string;
  cost: number;
  range: number;
  fireInterval: number;
  damage: number;
  projectileSpeed: number;
  splashRadius?: number;
  slowFactor?: number;
  slowDuration?: number;
}

export const TOWER_CONFIG: Record<TowerTypeId, TowerDefinition> = {
  rapid: {
    id: "rapid",
    name: "速射塔",
    cost: 70,
    range: 118,
    fireInterval: 0.34,
    damage: 13,
    projectileSpeed: 410,
  },
  cannon: {
    id: "cannon",
    name: "重炮塔",
    cost: 115,
    range: 150,
    fireInterval: 1.0,
    damage: 40,
    projectileSpeed: 300,
    splashRadius: 42,
  },
  frost: {
    id: "frost",
    name: "减速塔",
    cost: 95,
    range: 130,
    fireInterval: 0.9,
    damage: 9,
    projectileSpeed: 360,
    slowFactor: 0.58,
    slowDuration: 1.8,
  },
  burst: {
    id: "burst",
    name: "连发塔",
    cost: 85,
    range: 96,
    fireInterval: 0.22,
    damage: 9,
    projectileSpeed: 440,
  },
  sniper: {
    id: "sniper",
    name: "狙击塔",
    cost: 140,
    range: 210,
    fireInterval: 1.45,
    damage: 78,
    projectileSpeed: 480,
  },
  mortar: {
    id: "mortar",
    name: "迫击塔",
    cost: 155,
    range: 170,
    fireInterval: 1.35,
    damage: 52,
    projectileSpeed: 260,
    splashRadius: 68,
  },
};
