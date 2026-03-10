import { _decorator, Component, Node, Vec3 } from "cc";
import { LEVEL_CONFIG, type MapObstacle } from "../config/LevelConfig";
import "../core/PreviewSceneRedirector";
import { GameManager } from "../systems/GameManager";

const { ccclass, property } = _decorator;

@ccclass("BuildSpotManager")
export class BuildSpotManager extends Component {
  private static readonly MAP_MIN_X = -428;
  private static readonly MAP_MAX_X = 428;
  private static readonly MAP_MIN_Y = -220;
  private static readonly MAP_MAX_Y = 220;
  private static readonly TOWER_RADIUS = 34;
  private static readonly PATH_SAFE_DISTANCE = 56;

  @property({ type: "GameManager" })
  public gameManager: GameManager | null = null;

  @property(Node)
  public buildSpotPrefab: Node | null = null;

  @property(Node)
  public buildSpotLayer: Node | null = null;

  private obstacles: MapObstacle[] = [];

  public loadLevel(levelId: number): void {
    this.clear();
    const level = LEVEL_CONFIG[levelId];
    this.obstacles = level?.obstacles ?? [];
  }

  public getObstacles(): MapObstacle[] {
    return this.obstacles;
  }

  public canBuildAt(position: Vec3, occupiedPositions: Vec3[]): boolean {
    if (position.x < BuildSpotManager.MAP_MIN_X || position.x > BuildSpotManager.MAP_MAX_X) {
      return false;
    }
    if (position.y < BuildSpotManager.MAP_MIN_Y || position.y > BuildSpotManager.MAP_MAX_Y) {
      return false;
    }

    for (const obstacle of this.obstacles) {
      if (Vec3.distance(position, obstacle.position) <= obstacle.radius + BuildSpotManager.TOWER_RADIUS) {
        return false;
      }
    }

    for (const towerPosition of occupiedPositions) {
      if (Vec3.distance(position, towerPosition) <= BuildSpotManager.TOWER_RADIUS * 2) {
        return false;
      }
    }

    const pathPoints = this.gameManager?.pathManager?.waypoints ?? [];
    for (let index = 0; index < pathPoints.length - 1; index += 1) {
      if (this.getDistanceToSegment(position, pathPoints[index], pathPoints[index + 1]) <= BuildSpotManager.PATH_SAFE_DISTANCE) {
        return false;
      }
    }

    return true;
  }

  public clear(): void {
    this.obstacles = [];
  }

  private getDistanceToSegment(point: Vec3, start: Vec3, end: Vec3): number {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared === 0) {
      return Vec3.distance(point, start);
    }

    const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
    const projectionX = start.x + t * dx;
    const projectionY = start.y + t * dy;
    const distanceX = point.x - projectionX;
    const distanceY = point.y - projectionY;
    return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  }
}
