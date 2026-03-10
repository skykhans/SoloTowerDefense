import {
  BUILD_SPOT_PREFAB_NODE_NAMES,
  BULLET_PREFAB_NODE_NAMES,
  ENEMY_PREFAB_NODE_NAMES,
  HIT_EFFECT_PREFAB_NODE_NAMES,
  TOWER_PREFAB_NODE_NAMES,
} from "./PrefabNodeNames";

export class PrefabStructureProfiles {
  public static readonly enemyRequiredNodeNames = [
    ENEMY_PREFAB_NODE_NAMES.body,
    ENEMY_PREFAB_NODE_NAMES.normalVisual,
    ENEMY_PREFAB_NODE_NAMES.fastVisual,
    ENEMY_PREFAB_NODE_NAMES.heavyVisual,
    ENEMY_PREFAB_NODE_NAMES.bossVisual,
    ENEMY_PREFAB_NODE_NAMES.hpBarRoot,
    ENEMY_PREFAB_NODE_NAMES.hpBarFill,
  ];

  public static readonly towerRequiredNodeNames = [
    TOWER_PREFAB_NODE_NAMES.base,
    TOWER_PREFAB_NODE_NAMES.visualRoot,
    TOWER_PREFAB_NODE_NAMES.rapidVisual,
    TOWER_PREFAB_NODE_NAMES.cannonVisual,
    TOWER_PREFAB_NODE_NAMES.frostVisual,
    TOWER_PREFAB_NODE_NAMES.selectionRing,
    TOWER_PREFAB_NODE_NAMES.rangeIndicator,
  ];

  public static readonly buildSpotRequiredNodeNames = [
    BUILD_SPOT_PREFAB_NODE_NAMES.availableVisual,
    BUILD_SPOT_PREFAB_NODE_NAMES.occupiedVisual,
    BUILD_SPOT_PREFAB_NODE_NAMES.buildModeHintVisual,
  ];

  public static readonly bulletRequiredNodeNames = [
    BULLET_PREFAB_NODE_NAMES.rapidVisual,
    BULLET_PREFAB_NODE_NAMES.cannonVisual,
    BULLET_PREFAB_NODE_NAMES.frostVisual,
  ];

  public static readonly hitEffectRequiredNodeNames = [
    HIT_EFFECT_PREFAB_NODE_NAMES.coreVisual,
  ];
}
