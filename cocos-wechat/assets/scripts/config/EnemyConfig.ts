export type EnemyTypeId = "normal" | "fast" | "heavy" | "shield" | "boss";

export interface EnemyDefinition {
  id: EnemyTypeId;
  name: string;
  hpFactor: number;
  speedFactor: number;
  rewardBonus: number;
  lifeDamage: number;
  radius: number;
  shieldFactor?: number;
  isBoss?: boolean;
}

export const ENEMY_CONFIG: Record<EnemyTypeId, EnemyDefinition> = {
  normal: {
    id: "normal",
    name: "普通敌人",
    hpFactor: 1,
    speedFactor: 1,
    rewardBonus: 0,
    lifeDamage: 1,
    radius: 14,
  },
  fast: {
    id: "fast",
    name: "快速敌人",
    hpFactor: 0.85,
    speedFactor: 1.52,
    rewardBonus: 6,
    lifeDamage: 1,
    radius: 12,
  },
  heavy: {
    id: "heavy",
    name: "重甲敌人",
    hpFactor: 2.25,
    speedFactor: 0.78,
    rewardBonus: 12,
    lifeDamage: 2,
    radius: 17,
  },
  shield: {
    id: "shield",
    name: "护盾敌人",
    hpFactor: 1.35,
    speedFactor: 0.92,
    rewardBonus: 16,
    lifeDamage: 2,
    radius: 16,
    shieldFactor: 0.75,
  },
  boss: {
    id: "boss",
    name: "Boss",
    hpFactor: 4.8,
    speedFactor: 0.74,
    rewardBonus: 32,
    lifeDamage: 4,
    radius: 21,
    isBoss: true,
  },
};
