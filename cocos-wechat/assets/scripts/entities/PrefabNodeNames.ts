export const ENEMY_PREFAB_NODE_NAMES = {
  root: "Enemy",
  body: "Body",
  normalVisual: "NormalVisual",
  fastVisual: "FastVisual",
  heavyVisual: "HeavyVisual",
  bossVisual: "BossVisual",
  hpBarRoot: "HpBarRoot",
  hpBarBg: "HpBarBg",
  hpBarFill: "HpBarFill",
} as const;

export const TOWER_PREFAB_NODE_NAMES = {
  root: "Tower",
  base: "Base",
  visualRoot: "VisualRoot",
  rapidVisual: "RapidVisual",
  cannonVisual: "CannonVisual",
  frostVisual: "FrostVisual",
  selectionRing: "SelectionRing",
  rangeIndicator: "RangeIndicator",
} as const;

export const BUILD_SPOT_PREFAB_NODE_NAMES = {
  root: "BuildSpot",
  availableVisual: "AvailableVisual",
  occupiedVisual: "OccupiedVisual",
  buildModeHintVisual: "BuildModeHintVisual",
} as const;

export const BULLET_PREFAB_NODE_NAMES = {
  root: "Bullet",
  rapidVisual: "RapidVisual",
  cannonVisual: "CannonVisual",
  frostVisual: "FrostVisual",
} as const;

export const HIT_EFFECT_PREFAB_NODE_NAMES = {
  root: "HitEffect",
  coreVisual: "CoreVisual",
} as const;
