import { _decorator, Button, Component, Label } from "cc";
import { GameState } from "../core/GameState";
import { TutorialGuideService } from "../core/TutorialGuideService";
import { GameManager } from "../systems/GameManager";

const { ccclass, property } = _decorator;

@ccclass("BattleUI")
export class BattleUI extends Component {
  @property(GameState)
  public gameState: GameState | null = null;

  @property(GameManager)
  public gameManager: GameManager | null = null;

  @property(Label)
  public livesLabel: Label | null = null;

  @property(Label)
  public goldLabel: Label | null = null;

  @property(Label)
  public waveLabel: Label | null = null;

  @property(Label)
  public killsLabel: Label | null = null;

  @property(Label)
  public bestWaveLabel: Label | null = null;

  @property(Label)
  public phaseLabel: Label | null = null;

  @property(Label)
  public buildModeLabel: Label | null = null;

  @property(Label)
  public tutorialLabel: Label | null = null;

  @property(Button)
  public startWaveButton: Button | null = null;

  @property(Label)
  public startWaveButtonLabel: Label | null = null;

  @property(Button)
  public pauseButton: Button | null = null;

  @property(Label)
  public pauseButtonLabel: Label | null = null;

  update(): void {
    if (!this.gameState) return;

    if (this.livesLabel) this.livesLabel.string = `生命 ${this.gameState.lives}`;
    if (this.goldLabel) this.goldLabel.string = `金币 ${this.gameState.gold}`;
    if (this.waveLabel) this.waveLabel.string = `波次 ${this.gameState.wave}`;
    if (this.killsLabel) this.killsLabel.string = `击杀 ${this.gameState.kills}`;
    if (this.bestWaveLabel) this.bestWaveLabel.string = `最佳 ${this.gameState.bestWave}`;
    if (this.phaseLabel) this.phaseLabel.string = this.resolvePhaseText();
    if (this.buildModeLabel) this.buildModeLabel.string = this.resolveBuildModeText();
    if (this.tutorialLabel) this.tutorialLabel.string = this.resolveTutorialText();
    if (this.startWaveButton) this.startWaveButton.interactable = this.gameManager?.canStartWave() ?? false;
    if (this.startWaveButtonLabel) this.startWaveButtonLabel.string = this.resolveStartWaveButtonText();
    if (this.pauseButton) this.pauseButton.interactable = !this.gameState.isGameOver;
    if (this.pauseButtonLabel) this.pauseButtonLabel.string = this.gameState.isPaused ? "继续" : "暂停";
  }

  private resolvePhaseText(): string {
    if (!this.gameState) return "";

    switch (this.gameState.phase) {
      case "idle":
        if (this.gameManager?.hasPendingAutoWaveStart()) {
          const seconds = this.gameManager.getAutoWaveDelayRemaining();
          return `自动出兵 ${seconds.toFixed(1)}s`;
        }
        return "待命";
      case "spawning":
        return `出兵中 ${this.gameState.pendingEnemies}`;
      case "resolving":
        return "清场中";
      case "gameOver":
        return "失败";
      default:
        return "";
    }
  }

  private resolveBuildModeText(): string {
    return "点击空地打开建造菜单";
  }

  private resolveStartWaveButtonText(): string {
    if (!this.gameState) return "开始波次";
    if (this.gameState.phase === "idle") {
      if (this.gameManager?.hasPendingAutoWaveStart()) {
        const seconds = this.gameManager.getAutoWaveDelayRemaining();
        return `立即开始 ${seconds.toFixed(1)}s`;
      }
      return "开始波次";
    }
    if (this.gameState.phase === "spawning") return "出兵中";
    if (this.gameState.phase === "resolving") return "清场中";
    return "战斗结束";
  }

  private resolveTutorialText(): string {
    if (!this.gameState) {
      return "";
    }

    return TutorialGuideService.getBattleHint(this.gameState.tutorialStep, this.gameState.tutorialCompleted);
  }

  public onClearBuildSelection(): void {
    this.gameState?.clearBuildSelection();
  }

  public onStartWave(): void {
    if (!this.gameManager?.canStartWave()) return;
    this.gameManager.startWave();
  }

  public onTogglePause(): void {
    this.gameState?.togglePause();
  }

  public onRestartBattle(): void {
    this.gameManager?.restartBattle();
  }
}
