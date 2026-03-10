export type TowerTypeId = "rapid" | "cannon" | "frost";

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
    fireInterval: 0.35,
    damage: 12,
    projectileSpeed: 410,
  },
  cannon: {
    id: "cannon",
    name: "重炮塔",
    cost: 110,
    range: 155,
    fireInterval: 1.05,
    damage: 42,
    projectileSpeed: 300,
    splashRadius: 42,
  },
  frost: {
    id: "frost",
    name: "减速塔",
    cost: 95,
    range: 132,
    fireInterval: 0.9,
    damage: 8,
    projectileSpeed: 360,
    slowFactor: 0.55,
    slowDuration: 1.8,
  },
};
