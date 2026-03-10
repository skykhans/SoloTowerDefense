import { _decorator, Component, Vec3 } from "cc";
import { Enemy } from "../entities/Enemy";
import { PathManager } from "../map/PathManager";

const { ccclass, property } = _decorator;

@ccclass("EnemyMovementSystem")
export class EnemyMovementSystem extends Component {
  @property(PathManager)
  public pathManager: PathManager | null = null;

  public tick(enemies: Enemy[], dt: number): Enemy[] {
    if (!this.pathManager) return [];

    const reachedGoal: Enemy[] = [];

    for (const enemy of enemies) {
      enemy.tickSlow(dt);
      const target = this.pathManager.getWaypoint(enemy.waypointIndex);
      if (!target) {
        reachedGoal.push(enemy);
        continue;
      }

      const position = enemy.node.getPosition();
      const direction = new Vec3(target.x - position.x, target.y - position.y, 0);
      const distance = direction.length();

      if (distance < 2) {
        enemy.waypointIndex += 1;
        continue;
      }

      direction.normalize();
      const step = enemy.getCurrentSpeed() * dt;
      enemy.node.setPosition(
        position.x + direction.x * step,
        position.y + direction.y * step,
        position.z
      );
    }

    return reachedGoal;
  }
}
