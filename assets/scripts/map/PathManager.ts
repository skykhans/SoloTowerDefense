import { _decorator, Component, Vec3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass("PathManager")
export class PathManager extends Component {
  @property([Vec3])
  public waypoints: Vec3[] = [
    new Vec3(-420, 120, 0),
    new Vec3(-240, 120, 0),
    new Vec3(-240, -60, 0),
    new Vec3(-10, -60, 0),
    new Vec3(-10, 60, 0),
    new Vec3(220, 60, 0),
    new Vec3(220, -120, 0),
    new Vec3(460, -120, 0),
  ];

  public getWaypoint(index: number): Vec3 | null {
    return this.waypoints[index] ?? null;
  }

  public getSpawnPoint(): Vec3 {
    return this.waypoints[0]?.clone() ?? new Vec3();
  }
}
