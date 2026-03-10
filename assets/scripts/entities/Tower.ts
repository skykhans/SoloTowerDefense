import { _decorator, Component, EventTouch, Node, UITransform, Vec3 } from "cc";
import type { TowerTypeId } from "../config/TowerConfig";
import { BuildSpot } from "./BuildSpot";
import { GameManager } from "../systems/GameManager";
import { TowerView } from "./TowerView";

const { ccclass, property } = _decorator;

@ccclass("Tower")
export class Tower extends Component {
  public static readonly MAX_LEVEL = 4;

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
  public buildSpot: BuildSpot | null = null;

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
    const levelStep = this.level - 1;
    return Math.round(this.spentGold * 0.24 + 24 + levelStep * 26);
  }

  public getSellValue(): number {
    return Math.round(this.spentGold * 0.7);
  }

  public canUpgrade(): boolean {
    return this.level < Tower.MAX_LEVEL;
  }

  public upgrade(): void {
    if (!this.canUpgrade()) {
      return;
    }

    this.level += 1;
    switch (this.towerType) {
      case "rapid":
        this.damage = Math.round(this.damage * 1.2 + 2);
        this.range += 6;
        this.fireInterval = Math.max(0.2, this.fireInterval * 0.88);
        this.projectileSpeed += 18;
        break;
      case "cannon":
        this.damage = Math.round(this.damage * 1.32 + 6);
        this.range += 10;
        this.fireInterval = Math.max(0.72, this.fireInterval * 0.94);
        this.splashRadius += 8;
        this.projectileSpeed += 12;
        break;
      case "frost":
        this.damage = Math.round(this.damage * 1.18 + 2);
        this.range += 12;
        this.fireInterval = Math.max(0.62, this.fireInterval * 0.92);
        this.slowFactor = Math.max(0.34, this.slowFactor - 0.06);
        this.slowDuration += 0.2;
        this.projectileSpeed += 15;
        break;
      case "burst":
        this.damage = Math.round(this.damage * 1.16 + 1);
        this.range += 4;
        this.fireInterval = Math.max(0.14, this.fireInterval * 0.9);
        this.projectileSpeed += 16;
        break;
      case "sniper":
        this.damage = Math.round(this.damage * 1.28 + 8);
        this.range += 12;
        this.fireInterval = Math.max(1.05, this.fireInterval * 0.95);
        this.projectileSpeed += 25;
        break;
      case "mortar":
        this.damage = Math.round(this.damage * 1.24 + 7);
        this.range += 8;
        this.fireInterval = Math.max(1.0, this.fireInterval * 0.96);
        this.splashRadius += 10;
        this.projectileSpeed += 10;
        break;
      default:
        this.damage = Math.round(this.damage * 1.2);
        this.range += 8;
        this.fireInterval = Math.max(0.22, this.fireInterval * 0.93);
        break;
    }

    this.towerView?.syncRange(this.range);
  }

  public setSelected(selected: boolean): void {
    this.towerView?.setSelected(selected);
  }

  update(): void {
    const currentGold = this.gameManager?.gameState?.gold ?? 0;
    this.towerView?.setUpgradeReady(this.canUpgrade() && currentGold >= this.getUpgradeCost());
  }

  onLoad(): void {
    this.node.on(Node.EventType.TOUCH_END, this.handleClick, this);
    this.node.on("mouse-up", this.handleClick, this);
  }

  onDestroy(): void {
    this.node.off(Node.EventType.TOUCH_END, this.handleClick, this);
    this.node.off("mouse-up", this.handleClick, this);
  }

  private handleClick(event: EventTouch | { getUILocation?: () => { x: number; y: number }; getLocation?: () => { x: number; y: number } }): void {
    const transform = this.node.getComponent(UITransform);
    const pointerEvent = event as EventTouch & {
      touch?: { getUILocation: () => { x: number; y: number } };
      getUILocation?: () => { x: number; y: number };
      getLocation?: () => { x: number; y: number };
    };
    const uiLocation =
      pointerEvent.touch?.getUILocation() ??
      pointerEvent.getUILocation?.() ??
      pointerEvent.getLocation?.() ??
      { x: 0, y: 0 };
    const localPosition = transform?.convertToNodeSpaceAR(new Vec3(uiLocation.x, uiLocation.y, 0));
    const canDirectUpgrade =
      !!localPosition &&
      localPosition.y >= 16 &&
      this.canUpgrade() &&
      (this.gameManager?.gameState?.gold ?? 0) >= this.getUpgradeCost();

    if (canDirectUpgrade && this.gameManager?.upgradeTower(this)) {
      return;
    }
    this.gameManager?.selectTower(this);
  }
}
