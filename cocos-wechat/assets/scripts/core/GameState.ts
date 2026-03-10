import { _decorator, Component } from "cc";
import { ConfigService } from "../config/ConfigService";
import type { LevelDefinition } from "../config/LevelConfig";
import type { TowerTypeId } from "../config/TowerConfig";
import type { BattlePhase } from "./BattleTypes";
import { LocalStorageService } from "./LocalStorageService";
import type { TutorialStep } from "./TutorialGuideService";

const { ccclass } = _decorator;

@ccclass("GameState")
export class GameState extends Component {
  public currentLevelId = 1;
  public lives = 20;
  public gold = 120;
  public wave = 1;
  public kills = 0;
  public bestWave = 1;
  public isPaused = false;
  public isGameOver = false;
  public isVictory = false;
  public selectedTowerId = "";
  public selectedBuildTowerType: TowerTypeId | "" = "";
  public phase: BattlePhase = "idle";
  public pendingEnemies = 0;
  public tutorialCompleted = false;
  public tutorialStep: TutorialStep = "build";

  start(): void {
    const save = LocalStorageService.loadPlayerSave();
    this.bestWave = save.bestWave;
    this.currentLevelId = save.selectedLevel;
    this.tutorialCompleted = save.tutorialCompleted;
    this.tutorialStep = save.tutorialCompleted ? "complete" : "build";
  }

  public getCurrentLevel(): LevelDefinition {
    return ConfigService.getLevelConfig(this.currentLevelId);
  }

  public reset(): void {
    const level = this.getCurrentLevel();
    this.lives = level.startingLives;
    this.gold = level.startingGold;
    this.wave = level.waveStart;
    this.kills = 0;
    this.isPaused = false;
    this.isGameOver = false;
    this.isVictory = false;
    this.selectedTowerId = "";
    this.selectedBuildTowerType = "";
    this.phase = "idle";
    this.pendingEnemies = 0;
    this.tutorialCompleted = LocalStorageService.loadPlayerSave().tutorialCompleted;
    this.tutorialStep = this.tutorialCompleted ? "complete" : "build";
  }

  public addGold(amount: number): void {
    this.gold += amount;
  }

  public spendGold(amount: number): boolean {
    if (this.gold < amount) return false;
    this.gold -= amount;
    return true;
  }

  public damageBase(amount: number): void {
    this.lives = Math.max(0, this.lives - amount);
    if (this.lives === 0) {
      this.isGameOver = true;
      this.phase = "gameOver";
    }
  }

  public startWave(totalEnemies: number): void {
    this.pendingEnemies = totalEnemies;
    this.selectedBuildTowerType = "";
    this.phase = "spawning";
  }

  public markEnemySpawned(): void {
    this.pendingEnemies = Math.max(0, this.pendingEnemies - 1);
    if (this.pendingEnemies === 0 && this.phase === "spawning") {
      this.phase = "resolving";
    }
  }

  public recordWaveClear(): void {
    if (this.wave > this.bestWave) {
      this.bestWave = this.wave;
      const save = LocalStorageService.loadPlayerSave();
      save.bestWave = this.bestWave;
      LocalStorageService.savePlayerSave(save);
    }
    this.wave += 1;
    this.phase = "idle";
  }

  public selectBuildTowerType(type: TowerTypeId): void {
    this.selectedBuildTowerType = type;
  }

  public clearBuildSelection(): void {
    this.selectedBuildTowerType = "";
  }

  public togglePause(): void {
    if (this.isGameOver) return;
    this.isPaused = !this.isPaused;
  }

  public markVictory(): void {
    this.isVictory = true;
    this.isGameOver = true;
    this.phase = "gameOver";
    this.markTutorialCompleted();
  }

  public advanceTutorial(nextStep: TutorialStep): void {
    if (this.tutorialCompleted) {
      this.tutorialStep = "complete";
      return;
    }

    this.tutorialStep = nextStep;
    if (nextStep === "complete") {
      this.markTutorialCompleted();
    }
  }

  public markTutorialCompleted(): void {
    this.tutorialCompleted = true;
    this.tutorialStep = "complete";
    LocalStorageService.updatePlayerSave((save) => ({
      ...save,
      tutorialCompleted: true,
    }));
  }
}
