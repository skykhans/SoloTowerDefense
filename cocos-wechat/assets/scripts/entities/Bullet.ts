import { _decorator, Component, Vec3 } from "cc";
import { Enemy } from "./Enemy";
import type { TowerTypeId } from "../config/TowerConfig";
import { BulletView } from "./BulletView";

const { ccclass, property } = _decorator;

@ccclass("Bullet")
export class Bullet extends Component {
  @property(BulletView)
  public bulletView: BulletView | null = null;

  public target: Enemy | null = null;
  public speed = 0;
  public damage = 0;
  public splashRadius = 0;
  public slowFactor = 1;
  public slowDuration = 0;
  public sourceTowerType: TowerTypeId = "rapid";

  public setup(params: {
    position: Vec3;
    target: Enemy;
    speed: number;
    damage: number;
    sourceTowerType: TowerTypeId;
    splashRadius?: number;
    slowFactor?: number;
    slowDuration?: number;
  }): void {
    this.node.setPosition(params.position);
    this.target = params.target;
    this.speed = params.speed;
    this.damage = params.damage;
    this.splashRadius = params.splashRadius ?? 0;
    this.slowFactor = params.slowFactor ?? 1;
    this.slowDuration = params.slowDuration ?? 0;
    this.sourceTowerType = params.sourceTowerType;
    this.bulletView?.applyTowerType(this.sourceTowerType);
  }
}
