import { _decorator, Component, Vec3 } from "cc";
import type { EnemyTypeId } from "../config/EnemyConfig";
import { EnemyView } from "./EnemyView";

const { ccclass, property } = _decorator;

@ccclass("Enemy")
export class Enemy extends Component {
  @property(EnemyView)
  public enemyView: EnemyView | null = null;

  public enemyType: EnemyTypeId = "normal";
  public hp = 0;
  public maxHp = 0;
  public baseSpeed = 0;
  public reward = 0;
  public lifeDamage = 1;
  public shieldHp = 0;
  public maxShieldHp = 0;
  public waypointIndex = 1;
  public slowFactor = 1;
  public slowTimer = 0;

  public setup(params: {
    enemyType: EnemyTypeId;
    hp: number;
    speed: number;
    reward: number;
    lifeDamage: number;
    shieldHp?: number;
    position: Vec3;
  }): void {
    this.enemyType = params.enemyType;
    this.hp = params.hp;
    this.maxHp = params.hp;
    this.baseSpeed = params.speed;
    this.reward = params.reward;
    this.lifeDamage = params.lifeDamage;
    this.shieldHp = params.shieldHp ?? 0;
    this.maxShieldHp = params.shieldHp ?? 0;
    this.waypointIndex = 1;
    this.slowFactor = 1;
    this.slowTimer = 0;
    this.node.setPosition(params.position);
    this.enemyView?.applyEnemyType(this.enemyType);
    this.enemyView?.syncHp(this.hp, this.maxHp);
    this.enemyView?.setSlowed(false);
  }

  public applyDamage(amount: number): void {
    if (this.shieldHp > 0) {
      const absorbed = Math.min(this.shieldHp, amount);
      this.shieldHp -= absorbed;
      amount -= absorbed;
    }

    if (amount > 0) {
      this.hp -= amount;
    }

    this.enemyView?.syncHp(this.hp, this.maxHp);
  }

  public applySlow(factor: number, duration: number): void {
    this.slowFactor = Math.min(this.slowFactor, factor);
    this.slowTimer = Math.max(this.slowTimer, duration);
    this.enemyView?.setSlowed(this.slowFactor < 1);
  }

  public tickSlow(dt: number): void {
    this.slowTimer = Math.max(0, this.slowTimer - dt);
    if (this.slowTimer === 0) {
      this.slowFactor = 1;
    }
    this.enemyView?.setSlowed(this.slowFactor < 1);
  }

  public getCurrentSpeed(): number {
    return this.baseSpeed * this.slowFactor;
  }

  public get isDead(): boolean {
    return this.hp <= 0;
  }
}
