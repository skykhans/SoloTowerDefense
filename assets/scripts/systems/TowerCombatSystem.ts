import { _decorator, Component, instantiate, Node, Vec3 } from "cc";
import { Bullet } from "../entities/Bullet";
import { Enemy } from "../entities/Enemy";
import { HitEffect } from "../entities/HitEffect";
import { Tower } from "../entities/Tower";

const { ccclass, property } = _decorator;

@ccclass("TowerCombatSystem")
export class TowerCombatSystem extends Component {
  @property(Node)
  public bulletLayer: Node | null = null;

  @property(Node)
  public bulletPrefab: Node | null = null;

  @property(Node)
  public effectLayer: Node | null = null;

  @property(Node)
  public hitEffectPrefab: Node | null = null;

  private bullets: Bullet[] = [];

  public tick(towers: Tower[], enemies: Enemy[], dt: number): void {
    this.fireBullets(towers, enemies, dt);
    this.moveBullets(dt, enemies);
  }

  public getBullets(): Bullet[] {
    return this.bullets;
  }

  public reset(): void {
    for (const bullet of this.bullets) {
      bullet.node.destroy();
    }
    this.bullets = [];
  }

  private fireBullets(towers: Tower[], enemies: Enemy[], dt: number): void {
    if (!this.bulletLayer || !this.bulletPrefab) return;

    for (const tower of towers) {
      tower.tickCooldown(dt);
      if (!tower.canFire()) continue;

      const target = this.pickTarget(tower, enemies);
      if (!target) continue;

      const bulletNode = instantiate(this.bulletPrefab);
      this.bulletLayer.addChild(bulletNode);
      const bullet = bulletNode.getComponent(Bullet);
      if (!bullet) {
        bulletNode.destroy();
        continue;
      }

      bullet.setup({
        position: tower.node.getPosition(),
        target,
        speed: tower.projectileSpeed,
        damage: tower.damage,
        sourceTowerType: tower.towerType,
        splashRadius: tower.splashRadius,
        slowFactor: tower.slowFactor,
        slowDuration: tower.slowDuration,
      });

      this.bullets.push(bullet);
      tower.markFired();
    }
  }

  private moveBullets(dt: number, enemies: Enemy[]): void {
    for (let i = this.bullets.length - 1; i >= 0; i -= 1) {
      const bullet = this.bullets[i];
      const target = bullet.target;
      if (!target || !target.node || !target.node.isValid || target.isDead) {
        bullet.node.destroy();
        this.bullets.splice(i, 1);
        continue;
      }

      const position = bullet.node.getPosition();
      const targetPosition = target.node.getPosition();
      const direction = new Vec3(targetPosition.x - position.x, targetPosition.y - position.y, 0);
      const distance = direction.length();
      const step = bullet.speed * dt;

      if (distance <= step) {
        target.applyDamage(bullet.damage);
        this.spawnHitEffect(targetPosition);
        if (bullet.slowFactor < 1) {
          target.applySlow(bullet.slowFactor, bullet.slowDuration);
        }
        if (bullet.splashRadius > 0) {
          this.applySplashDamage(target, enemies, bullet.splashRadius, Math.round(bullet.damage * 0.45));
        }

        bullet.node.destroy();
        this.bullets.splice(i, 1);
        continue;
      }

      direction.normalize();
      bullet.node.setPosition(
        position.x + direction.x * step,
        position.y + direction.y * step,
        position.z
      );
    }
  }

  private pickTarget(tower: Tower, enemies: Enemy[]): Enemy | null {
    let target: Enemy | null = null;
    let furthest = -1;
    const towerPosition = tower.node.getPosition();

    for (const enemy of enemies) {
      if (enemy.isDead) continue;
      const enemyPosition = enemy.node.getPosition();
      const distance = Vec3.distance(towerPosition, enemyPosition);
      if (distance > tower.range) continue;
      if (enemy.waypointIndex > furthest) {
        furthest = enemy.waypointIndex;
        target = enemy;
      }
    }

    return target;
  }

  private applySplashDamage(target: Enemy, enemies: Enemy[], radius: number, damage: number): void {
    const targetPosition = target.node.getPosition();
    for (const enemy of enemies) {
      if (enemy === target || enemy.isDead) continue;
      const distance = Vec3.distance(targetPosition, enemy.node.getPosition());
      if (distance <= radius) {
        enemy.applyDamage(damage);
      }
    }
  }

  private spawnHitEffect(position: Vec3): void {
    if (!this.effectLayer || !this.hitEffectPrefab) return;

    const effectNode = instantiate(this.hitEffectPrefab);
    this.effectLayer.addChild(effectNode);
    effectNode.setPosition(position);
    effectNode.getComponent(HitEffect)?.play();
  }
}
