import { _decorator, Component, instantiate, Node, Vec3 } from "cc";
import { type EnemyTypeId } from "../config/EnemyConfig";
import { ConfigService } from "../config/ConfigService";
import { type TowerTypeId } from "../config/TowerConfig";
import { BattleResultSession } from "../core/BattleResultSession";
import { GameState } from "../core/GameState";
import { LocalStorageService } from "../core/LocalStorageService";
import { SceneNavigator } from "../core/SceneNavigator";
import { SCENE_NAMES } from "../core/SceneNames";
import { Enemy } from "../entities/Enemy";
import { Tower } from "../entities/Tower";
import { BuildSpotManager } from "../map/BuildSpotManager";
import { PathManager } from "../map/PathManager";
import { VibrationService } from "../platform/VibrationService";
import { EnemyMovementSystem } from "./EnemyMovementSystem";
import { TowerCombatSystem } from "./TowerCombatSystem";
import { WaveSpawnSystem } from "./WaveSpawnSystem";

const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property(GameState)
  public gameState: GameState | null = null;

  @property(PathManager)
  public pathManager: PathManager | null = null;

  @property(BuildSpotManager)
  public buildSpotManager: BuildSpotManager | null = null;

  @property(EnemyMovementSystem)
  public enemyMovementSystem: EnemyMovementSystem | null = null;

  @property(TowerCombatSystem)
  public towerCombatSystem: TowerCombatSystem | null = null;

  @property(WaveSpawnSystem)
  public waveSpawnSystem: WaveSpawnSystem | null = null;

  @property(Node)
  public enemyLayer: Node | null = null;

  @property(Node)
  public towerLayer: Node | null = null;

  @property(Node)
  public enemyPrefab: Node | null = null;

  @property(Node)
  public towerPrefab: Node | null = null;

  private enemies: Enemy[] = [];
  private towers: Tower[] = [];
  private towerCounter = 0;
  private selectedTower: Tower | null = null;

  start(): void {
    if (!this.gameState) return;
    this.gameState.reset();
    if (this.buildSpotManager) {
      this.buildSpotManager.gameManager = this;
      this.buildSpotManager.loadLevel(this.gameState.currentLevelId);
    }
  }

  public startWave(): void {
    if (!this.gameState || !this.pathManager || !this.enemyPrefab || !this.enemyLayer || !this.waveSpawnSystem) return;
    if (this.gameState.phase !== "idle") return;

    const wave = ConfigService.getWaveConfig(this.gameState.wave);
    this.gameState.startWave(wave.totalCount);
    this.gameState.advanceTutorial("upgrade");
    this.waveSpawnSystem.startWave(wave);
  }

  public canStartWave(): boolean {
    return !!this.gameState && this.gameState.phase === "idle" && !this.gameState.isGameOver;
  }

  public restartBattle(): void {
    if (!this.gameState) return;
    this.waveSpawnSystem?.stop();
    for (const enemy of this.enemies) enemy.node.destroy();
    for (const tower of this.towers) tower.node.destroy();
    this.towerCombatSystem?.reset();
    this.enemies = [];
    this.towers = [];
    this.selectedTower = null;
    this.towerCounter = 0;
    this.gameState.reset();
    if (this.buildSpotManager) {
      this.buildSpotManager.gameManager = this;
      this.buildSpotManager.loadLevel(this.gameState.currentLevelId);
    }
  }

  public createTower(type: TowerTypeId, position: Vec3): Tower | null {
    if (!this.gameState || !this.towerLayer || !this.towerPrefab) return null;

    const config = ConfigService.getTowerConfig(type);
    if (!this.gameState.spendGold(config.cost)) return null;

    const towerNode = instantiate(this.towerPrefab);
    this.towerLayer.addChild(towerNode);
    const tower = towerNode.getComponent(Tower);
    if (!tower) return null;

    this.towerCounter += 1;
    tower.setup({
      towerId: `tower-${this.towerCounter}`,
      towerType: config.id,
      position,
      range: config.range,
      damage: config.damage,
      fireInterval: config.fireInterval,
      projectileSpeed: config.projectileSpeed,
      splashRadius: config.splashRadius,
      slowFactor: config.slowFactor,
      slowDuration: config.slowDuration,
      spentGold: config.cost,
    });
    tower.gameManager = this;

    this.towers.push(tower);
    if (!this.gameState.tutorialCompleted && this.gameState.tutorialStep === "build") {
      this.gameState.advanceTutorial("startWave");
    }
    return tower;
  }

  public selectTower(tower: Tower | null): void {
    for (const item of this.towers) {
      item.setSelected(item === tower);
    }

    this.selectedTower = tower;
    if (this.gameState) {
      this.gameState.selectedTowerId = tower?.towerId ?? "";
      this.gameState.clearBuildSelection();
    }
  }

  public clearSelectedTower(): void {
    this.selectTower(null);
  }

  public getSelectedTower(): Tower | null {
    return this.selectedTower;
  }

  public upgradeSelectedTower(): boolean {
    if (!this.gameState || !this.selectedTower) return false;
    const cost = this.selectedTower.getUpgradeCost();
    if (!this.gameState.spendGold(cost)) return false;

    this.selectedTower.spentGold += cost;
    this.selectedTower.upgrade();
    if (!this.gameState.tutorialCompleted && this.gameState.tutorialStep === "upgrade") {
      this.gameState.markTutorialCompleted();
    }
    return true;
  }

  public sellSelectedTower(): boolean {
    if (!this.gameState || !this.selectedTower) return false;

    const tower = this.selectedTower;
    this.gameState.addGold(tower.getSellValue());
    tower.node.destroy();
    this.towers = this.towers.filter((item) => item !== tower);
    this.selectedTower = null;
    tower.setSelected(false);
    this.gameState.selectedTowerId = "";
    return true;
  }

  update(dt: number): void {
    if (!this.gameState || this.gameState.isGameOver || this.gameState.isPaused) return;

    const spawned = this.waveSpawnSystem?.tick(dt) ?? [];
    for (const enemyType of spawned) {
      this.spawnEnemy(enemyType);
      this.gameState.markEnemySpawned();
    }

    const reachedGoal = this.enemyMovementSystem?.tick(this.enemies, dt) ?? [];
    for (const enemy of reachedGoal) {
      this.handleEnemyReachedGoal(enemy);
    }

    this.applyEnemySupport(dt);
    this.towerCombatSystem?.tick(this.towers, this.enemies, dt);
    this.cleanupDeadEnemies();

    if (this.gameState.phase === "resolving" && this.enemies.length === 0) {
      const level = this.gameState.getCurrentLevel();
      if (this.gameState.wave >= level.targetWave) {
        const rewardSummary = this.resolveVictoryRewards();
        this.gameState.markVictory();
        this.waveSpawnSystem?.stop();
        BattleResultSession.setResult({
          result: "victory",
          levelId: this.gameState.currentLevelId,
          reachedWave: this.gameState.wave,
          kills: this.gameState.kills,
          bestWave: this.gameState.bestWave,
          stars: rewardSummary.stars,
          awardedCoins: rewardSummary.awardedCoins,
          firstClearReward: rewardSummary.firstClearReward,
          unlockedLevelId: rewardSummary.unlockedLevelId,
        });
        SceneNavigator.goTo(SCENE_NAMES.result);
        return;
      }
      this.gameState.recordWaveClear();
      this.waveSpawnSystem?.stop();
    }
  }

  private spawnEnemy(
    type: EnemyTypeId,
    options?: {
      position?: Vec3;
      waypointIndex?: number;
      rewardScale?: number;
    }
  ): void {
    if (!this.gameState || !this.pathManager || !this.enemyPrefab || !this.enemyLayer) return;

    const config = ConfigService.getEnemyConfig(type);
    const hpBase = 34 + this.gameState.wave * 9;
    const speedBase = 45 + this.gameState.wave * 5;
    const enemyNode = instantiate(this.enemyPrefab);
    this.enemyLayer.addChild(enemyNode);
    const enemy = enemyNode.getComponent(Enemy);
    if (!enemy) return;

    const hp = Math.round(hpBase * config.hpFactor);
    const shieldHp = config.shieldFactor ? Math.round(hp * config.shieldFactor) : 0;
    const healAmount = config.healFactor ? Math.max(1, Math.round(hp * config.healFactor)) : 0;
    enemy.setup({
      enemyType: config.id,
      hp,
      speed: speedBase * config.speedFactor,
      reward: Math.max(
        1,
        Math.round((12 + Math.floor(this.gameState.wave * 1.8) + config.rewardBonus) * (options?.rewardScale ?? 1))
      ),
      lifeDamage: config.lifeDamage,
      shieldHp,
      splitInto: config.splitInto,
      splitCount: config.splitCount,
      healAmount,
      healRadius: config.healRadius,
      healInterval: config.healInterval,
      waypointIndex: options?.waypointIndex,
      position: options?.position ?? this.pathManager.getSpawnPoint(),
    });

    this.enemies.push(enemy);
  }

  private applyEnemySupport(dt: number): void {
    for (const enemy of this.enemies) {
      if (enemy.isDead) {
        continue;
      }

      enemy.tickSupport(dt);
      if (!enemy.canTriggerHeal()) {
        continue;
      }

      const sourcePosition = enemy.node.getPosition();
      let healedCount = 0;
      for (const ally of this.enemies) {
        if (ally === enemy || ally.isDead) {
          continue;
        }

        const distance = Vec3.distance(sourcePosition, ally.node.getPosition());
        if (distance > enemy.healRadius) {
          continue;
        }

        ally.receiveHeal(enemy.healAmount);
        healedCount += 1;
      }

      if (healedCount > 0) {
        enemy.resetHealTimer();
      }
    }
  }

  private cleanupDeadEnemies(): void {
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      if (!enemy.isDead) continue;
      const splitInfo = enemy.consumeSplit();
      this.gameState?.addGold(enemy.reward);
      if (this.gameState) {
        this.gameState.kills += 1;
      }
      if (splitInfo) {
        const origin = enemy.node.getPosition();
        for (let index = 0; index < splitInfo.count; index += 1) {
          const offsetX = (index - (splitInfo.count - 1) / 2) * 18;
          const offset = new Vec3(origin.x + offsetX, origin.y, origin.z);
          this.spawnEnemy(splitInfo.enemyType, {
            position: offset,
            waypointIndex: enemy.waypointIndex,
            rewardScale: 0.55,
          });
        }
      }
      enemy.node.destroy();
      this.enemies.splice(i, 1);
    }
  }

  private handleEnemyReachedGoal(enemy: Enemy): void {
    this.gameState?.damageBase(enemy.lifeDamage);
    enemy.node.destroy();
    this.enemies = this.enemies.filter((item) => item !== enemy);
    if (this.gameState?.isGameOver) {
      this.waveSpawnSystem?.stop();
      VibrationService.vibrateLong();
      BattleResultSession.setResult({
        result: "failure",
        levelId: this.gameState.currentLevelId,
        reachedWave: this.gameState.wave,
        kills: this.gameState.kills,
        bestWave: this.gameState.bestWave,
        stars: 0,
        awardedCoins: 0,
        firstClearReward: 0,
        unlockedLevelId: null,
      });
      SceneNavigator.goTo(SCENE_NAMES.result);
    }
  }

  private resolveVictoryRewards(): {
    stars: number;
    awardedCoins: number;
    firstClearReward: number;
    unlockedLevelId: number | null;
  } {
    if (!this.gameState) {
      return { stars: 1, awardedCoins: 0, firstClearReward: 0, unlockedLevelId: null };
    }

    const level = this.gameState.getCurrentLevel();
    const stars = this.calculateStars(level.startingLives, this.gameState.lives);
    const baseCoins = 50 + this.gameState.wave * 10;
    const save = LocalStorageService.loadPlayerSave();
    const progressKey = String(level.id);
    const currentProgress = save.levelProgress[progressKey] ?? {
      bestStars: 0,
      cleared: false,
      firstClearClaimed: false,
    };
    const isFirstClear = !currentProgress.cleared;
    const firstClearReward = isFirstClear ? level.firstClearCoinReward : 0;
    const awardedCoins = baseCoins + firstClearReward;
    const nextLevelId = level.id + 1;
    const hasNextLevel = ConfigService.getAllLevelConfigs().some((item) => item.id === nextLevelId);
    const unlockedLevelId = hasNextLevel && !save.unlockedLevels.includes(nextLevelId) ? nextLevelId : null;

    return {
      stars,
      awardedCoins,
      firstClearReward,
      unlockedLevelId,
    };
  }

  private calculateStars(startingLives: number, remainingLives: number): number {
    if (remainingLives >= startingLives) {
      return 3;
    }

    if (remainingLives >= Math.ceil(startingLives * 0.6)) {
      return 2;
    }

    return 1;
  }
}
