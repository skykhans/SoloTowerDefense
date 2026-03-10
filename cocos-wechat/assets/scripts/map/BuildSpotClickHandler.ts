import { _decorator, Component, EventTouch, Node, Vec3 } from "cc";
import { BuildSpot } from "../entities/BuildSpot";
import { GameState } from "../core/GameState";
import { VibrationService } from "../platform/VibrationService";
import { GameManager } from "../systems/GameManager";

const { ccclass, property } = _decorator;

@ccclass("BuildSpotClickHandler")
export class BuildSpotClickHandler extends Component {
  @property(GameManager)
  public gameManager: GameManager | null = null;

  @property(GameState)
  public gameState: GameState | null = null;

  private buildSpot: BuildSpot | null = null;

  onLoad(): void {
    this.buildSpot = this.getComponent(BuildSpot);
    this.node.on(Node.EventType.TOUCH_END, this.handleClick, this);
  }

  onDestroy(): void {
    this.node.off(Node.EventType.TOUCH_END, this.handleClick, this);
  }

  update(): void {
    if (!this.buildSpot || !this.gameState) return;
    this.buildSpot.render(!!this.gameState.selectedBuildTowerType);
  }

  private handleClick(_event: EventTouch): void {
    if (!this.buildSpot || this.buildSpot.isOccupied || !this.gameManager || !this.gameState) return;
    if (!this.gameState.selectedBuildTowerType) return;

    const worldPosition = this.node.getPosition();
    const tower = this.gameManager.createTower(this.gameState.selectedBuildTowerType, new Vec3(worldPosition.x, worldPosition.y, worldPosition.z));
    if (tower) {
      this.buildSpot.occupy();
      this.gameState.clearBuildSelection();
      VibrationService.vibrateShort();
    }
  }
}
