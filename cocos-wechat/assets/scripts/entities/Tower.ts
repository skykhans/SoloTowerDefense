import { _decorator, Component, EventTouch, Node, Vec3 } from "cc";
import type { TowerTypeId } from "../config/TowerConfig";
import { GameManager } from "../systems/GameManager";
import { TowerView } from "./TowerView";

const { ccclass, property } = _decorator;

@ccclass("Tower")
export class Tower extends Component {
  @property(GameManager)
  public gameManager: GameManager | null = null;

  @property(TowerView)
  public towerView: TowerView | null = null;

  public towerId = "";
  public towerType: TowerTypeId = "rapid";
  public level = 1;
  public range = 0;
  public damage = 0;
  public fireInterval = 0;
  public projectileSpeed = 0;
  public splashRadius = 0;
  public slowFactor = 1;
  public slowDuration = 0;
  public cooldown = 0;
  public spentGold = 0;

  public setup(params: {
    towerId: string;
    towerType: TowerTypeId;
    position: Vec3;
    range: number;
    damage: number;
    fireInterval: number;
    projectileSpeed: number;
    splashRadius?: number;
    slowFactor?: number;
    slowDuration?: number;
    spentGold: number;
  }): void {
    this.towerId = params.towerId;
    this.towerType = params.towerType;
    this.level = 1;
    this.range = params.range;
    this.damage = params.damage;
    this.fireInterval = params.fireInterval;
    this.projectileSpeed = params.projectileSpeed;
    this.splashRadius = params.splashRadius ?? 0;
    this.slowFactor = params.slowFactor ?? 1;
    this.slowDuration = params.slowDuration ?? 0;
    this.cooldown = 0;
    this.spentGold = params.spentGold;
    this.node.setPosition(params.position);
    this.towerView?.applyTowerType(this.towerType);
    this.towerView?.syncRange(this.range);
    this.towerView?.setSelected(false);
  }

  public tickCooldown(dt: number): void {
    this.cooldown = Math.max(0, this.cooldown - dt);
  }

  public canFire(): boolean {
    return this.cooldown <= 0;
  }

  public markFired(): void {
    this.cooldown = this.fireInterval;
  }

  public getUpgradeCost(): number {
    return Math.round(this.spentGold * 0.3 + this.level * 18);
  }

  public getSellValue(): number {
    return Math.round(this.spentGold * 0.7);
  }

  public upgrade(): void {
    this.level += 1;
    this.damage = Math.round(this.damage * 1.24);
    this.range += 8;
    this.fireInterval = Math.max(0.22, this.fireInterval * 0.93);
    if (this.slowFactor < 1) {
      this.slowFactor = Math.max(0.3, this.slowFactor - 0.04);
      this.slowDuration += 0.12;
    }
    this.towerView?.syncRange(this.range);
  }

  public setSelected(selected: boolean): void {
    this.towerView?.setSelected(selected);
  }

  onLoad(): void {
    this.node.on(Node.EventType.TOUCH_END, this.handleClick, this);
  }

  onDestroy(): void {
    this.node.off(Node.EventType.TOUCH_END, this.handleClick, this);
  }

  private handleClick(_event: EventTouch): void {
    this.gameManager?.selectTower(this);
  }
}
