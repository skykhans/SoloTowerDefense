import { _decorator, Component } from "cc";
import { SceneBindingValidator } from "../core/SceneBindingValidator";
import { PrefabStructureValidator } from "../core/PrefabStructureValidator";
import { SceneStructureValidator } from "../core/SceneStructureValidator";
import { GameState } from "../core/GameState";
import { BuildSpotManager } from "../map/BuildSpotManager";
import { PathManager } from "../map/PathManager";
import { EnemyMovementSystem } from "../systems/EnemyMovementSystem";
import { GameManager } from "../systems/GameManager";
import { TowerCombatSystem } from "../systems/TowerCombatSystem";
import { WaveSpawnSystem } from "../systems/WaveSpawnSystem";
import { BattleUI } from "../ui/BattleUI";
import { PlatformDebugPanel } from "../ui/PlatformDebugPanel";
import { TowerPanel } from "../ui/TowerPanel";
import { Enemy } from "../entities/Enemy";
import { Tower } from "../entities/Tower";
import { BuildSpot } from "../entities/BuildSpot";
import { Bullet } from "../entities/Bullet";
import { HitEffect } from "../entities/HitEffect";
import {
  BUILD_SPOT_PREFAB_NODE_NAMES,
  BULLET_PREFAB_NODE_NAMES,
  ENEMY_PREFAB_NODE_NAMES,
  HIT_EFFECT_PREFAB_NODE_NAMES,
  TOWER_PREFAB_NODE_NAMES,
} from "../entities/PrefabNodeNames";
import { PrefabStructureProfiles } from "../entities/PrefabStructureProfiles";
import { MAIN_SCENE_NODE_NAMES } from "../ui/SceneNodeNames";
import { SceneStructureProfiles } from "../ui/SceneStructureProfiles";

const { ccclass, property } = _decorator;

@ccclass("MainSceneInstaller")
export class MainSceneInstaller extends Component {
  @property(GameState)
  public gameState: GameState | null = null;

  @property(GameManager)
  public gameManager: GameManager | null = null;

  @property(PathManager)
  public pathManager: PathManager | null = null;

  @property(BuildSpotManager)
  public buildSpotManager: BuildSpotManager | null = null;

  @property(WaveSpawnSystem)
  public waveSpawnSystem: WaveSpawnSystem | null = null;

  @property(EnemyMovementSystem)
  public enemyMovementSystem: EnemyMovementSystem | null = null;

  @property(TowerCombatSystem)
  public towerCombatSystem: TowerCombatSystem | null = null;

  @property(BattleUI)
  public battleUI: BattleUI | null = null;

  @property(TowerPanel)
  public towerPanel: TowerPanel | null = null;

  @property(PlatformDebugPanel)
  public platformDebugPanel: PlatformDebugPanel | null = null;

  onLoad(): void {
    const owner = "MainSceneInstaller";
    SceneStructureValidator.requireRootName(owner, this.node, MAIN_SCENE_NODE_NAMES.root);
    SceneStructureValidator.validateRequiredNodeNames(owner, this.node, SceneStructureProfiles.battleRequiredNodeNames);
    const gameState = SceneBindingValidator.requireComponent(owner, "GameState", this.gameState);
    const gameManager = SceneBindingValidator.requireComponent(owner, "GameManager", this.gameManager);
    const pathManager = SceneBindingValidator.requireComponent(owner, "PathManager", this.pathManager);
    const buildSpotManager = SceneBindingValidator.requireComponent(owner, "BuildSpotManager", this.buildSpotManager);
    const waveSpawnSystem = SceneBindingValidator.requireComponent(owner, "WaveSpawnSystem", this.waveSpawnSystem);
    const enemyMovementSystem = SceneBindingValidator.requireComponent(owner, "EnemyMovementSystem", this.enemyMovementSystem);
    const towerCombatSystem = SceneBindingValidator.requireComponent(owner, "TowerCombatSystem", this.towerCombatSystem);
    const battleUI = SceneBindingValidator.requireComponent(owner, "BattleUI", this.battleUI);
    const towerPanel = SceneBindingValidator.requireComponent(owner, "TowerPanel", this.towerPanel);

    gameManager.gameState = gameState;
    gameManager.pathManager = pathManager;
    gameManager.buildSpotManager = buildSpotManager;
    gameManager.waveSpawnSystem = waveSpawnSystem;
    gameManager.enemyMovementSystem = enemyMovementSystem;
    gameManager.towerCombatSystem = towerCombatSystem;

    buildSpotManager.gameManager = gameManager;
    enemyMovementSystem.pathManager = pathManager;

    battleUI.gameState = gameState;
    battleUI.gameManager = gameManager;
    SceneBindingValidator.requireComponent(owner, "BattleUI.livesLabel", battleUI.livesLabel);
    SceneBindingValidator.requireComponent(owner, "BattleUI.goldLabel", battleUI.goldLabel);
    SceneBindingValidator.requireComponent(owner, "BattleUI.waveLabel", battleUI.waveLabel);
    SceneBindingValidator.requireComponent(owner, "BattleUI.killsLabel", battleUI.killsLabel);
    SceneBindingValidator.requireComponent(owner, "BattleUI.bestWaveLabel", battleUI.bestWaveLabel);
    SceneBindingValidator.requireComponent(owner, "BattleUI.phaseLabel", battleUI.phaseLabel);
    SceneBindingValidator.requireComponent(owner, "BattleUI.buildModeLabel", battleUI.buildModeLabel);

    towerPanel.gameManager = gameManager;
    SceneBindingValidator.requireComponent(owner, "TowerPanel.titleLabel", towerPanel.titleLabel);
    SceneBindingValidator.requireComponent(owner, "TowerPanel.infoLabel", towerPanel.infoLabel);
    SceneBindingValidator.requireComponent(owner, "TowerPanel.upgradeValueLabel", towerPanel.upgradeValueLabel);
    SceneBindingValidator.requireComponent(owner, "TowerPanel.sellValueLabel", towerPanel.sellValueLabel);
    SceneBindingValidator.requireComponent(owner, "TowerPanel.actionHintLabel", towerPanel.actionHintLabel);
    SceneBindingValidator.requireComponent(owner, "TowerPanel.upgradeButton", towerPanel.upgradeButton);
    SceneBindingValidator.requireComponent(owner, "TowerPanel.sellButton", towerPanel.sellButton);

    if (this.platformDebugPanel) {
      SceneBindingValidator.requireComponent(owner, "PlatformDebugPanel.panelRoot", this.platformDebugPanel.panelRoot);
      SceneBindingValidator.requireComponent(owner, "PlatformDebugPanel.infoLabel", this.platformDebugPanel.infoLabel);
    }

    SceneBindingValidator.requireNode(owner, "GameManager.enemyLayer", gameManager.enemyLayer);
    SceneBindingValidator.requireNode(owner, "GameManager.towerLayer", gameManager.towerLayer);
    SceneBindingValidator.requireNode(owner, "GameManager.enemyPrefab", gameManager.enemyPrefab);
    SceneBindingValidator.requireNode(owner, "GameManager.towerPrefab", gameManager.towerPrefab);
    SceneBindingValidator.requireNode(owner, "BuildSpotManager.buildSpotPrefab", buildSpotManager.buildSpotPrefab);
    SceneBindingValidator.requireNode(owner, "BuildSpotManager.buildSpotLayer", buildSpotManager.buildSpotLayer);
    SceneBindingValidator.requireNode(owner, "TowerCombatSystem.bulletLayer", towerCombatSystem.bulletLayer);
    SceneBindingValidator.requireNode(owner, "TowerCombatSystem.bulletPrefab", towerCombatSystem.bulletPrefab);

    const enemyPrefab = gameManager.enemyPrefab;
    const towerPrefab = gameManager.towerPrefab;
    const buildSpotPrefab = buildSpotManager.buildSpotPrefab;
    const bulletPrefab = towerCombatSystem.bulletPrefab;
    const hitEffectPrefab = towerCombatSystem.hitEffectPrefab;

    SceneBindingValidator.requireComponent(owner, "Enemy.prefab -> Enemy", enemyPrefab.getComponent(Enemy));
    SceneBindingValidator.requireComponent(owner, "Tower.prefab -> Tower", towerPrefab.getComponent(Tower));
    SceneBindingValidator.requireComponent(owner, "BuildSpot.prefab -> BuildSpot", buildSpotPrefab.getComponent(BuildSpot));
    SceneBindingValidator.requireComponent(owner, "Bullet.prefab -> Bullet", bulletPrefab.getComponent(Bullet));
    PrefabStructureValidator.requireRootName(owner, enemyPrefab, ENEMY_PREFAB_NODE_NAMES.root);
    PrefabStructureValidator.validateRequiredNodeNames(owner, enemyPrefab, PrefabStructureProfiles.enemyRequiredNodeNames);
    PrefabStructureValidator.requireRootName(owner, towerPrefab, TOWER_PREFAB_NODE_NAMES.root);
    PrefabStructureValidator.validateRequiredNodeNames(owner, towerPrefab, PrefabStructureProfiles.towerRequiredNodeNames);
    PrefabStructureValidator.requireRootName(owner, buildSpotPrefab, BUILD_SPOT_PREFAB_NODE_NAMES.root);
    PrefabStructureValidator.validateRequiredNodeNames(owner, buildSpotPrefab, PrefabStructureProfiles.buildSpotRequiredNodeNames);
    PrefabStructureValidator.requireRootName(owner, bulletPrefab, BULLET_PREFAB_NODE_NAMES.root);
    PrefabStructureValidator.validateRequiredNodeNames(owner, bulletPrefab, PrefabStructureProfiles.bulletRequiredNodeNames);
    if (towerCombatSystem.effectLayer || hitEffectPrefab) {
      SceneBindingValidator.requireNode(owner, "TowerCombatSystem.effectLayer", towerCombatSystem.effectLayer);
      SceneBindingValidator.requireNode(owner, "TowerCombatSystem.hitEffectPrefab", hitEffectPrefab);
      SceneBindingValidator.requireComponent(owner, "HitEffect.prefab -> HitEffect", hitEffectPrefab.getComponent(HitEffect));
      PrefabStructureValidator.requireRootName(owner, hitEffectPrefab, HIT_EFFECT_PREFAB_NODE_NAMES.root);
      PrefabStructureValidator.validateRequiredNodeNames(owner, hitEffectPrefab, PrefabStructureProfiles.hitEffectRequiredNodeNames);
    }
  }
}
