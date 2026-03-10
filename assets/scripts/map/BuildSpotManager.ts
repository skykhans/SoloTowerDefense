import { _decorator, Component, instantiate, Node, Vec3 } from "cc";
import { LEVEL_CONFIG } from "../config/LevelConfig";
import { BuildSpot } from "../entities/BuildSpot";
import { BuildSpotClickHandler } from "./BuildSpotClickHandler";
import { GameManager } from "../systems/GameManager";

const { ccclass, property } = _decorator;

@ccclass("BuildSpotManager")
export class BuildSpotManager extends Component {
  @property(GameManager)
  public gameManager: GameManager | null = null;

  @property(Node)
  public buildSpotPrefab: Node | null = null;

  @property(Node)
  public buildSpotLayer: Node | null = null;

  private buildSpots: BuildSpot[] = [];

  public loadLevel(levelId: number): void {
    const level = LEVEL_CONFIG[levelId];
    if (!level || !this.buildSpotPrefab || !this.buildSpotLayer) return;

    this.clear();

    for (const position of level.buildSpots) {
      const node = instantiate(this.buildSpotPrefab);
      this.buildSpotLayer.addChild(node);
      node.setPosition(new Vec3(position.x, position.y, position.z));
      const buildSpot = node.getComponent(BuildSpot);
      const clickHandler = node.getComponent(BuildSpotClickHandler);
      if (buildSpot) {
        buildSpot.release();
        this.buildSpots.push(buildSpot);
      }
      if (clickHandler && this.gameManager) {
        clickHandler.gameManager = this.gameManager;
        clickHandler.gameState = this.gameManager.gameState;
      }
    }
  }

  public getAvailableSpots(): BuildSpot[] {
    return this.buildSpots.filter((spot) => !spot.isOccupied);
  }

  public clear(): void {
    for (const buildSpot of this.buildSpots) {
      buildSpot.node.destroy();
    }
    this.buildSpots = [];
  }
}
