import { _decorator, Color, Component, Node, Sprite, UITransform } from "cc";
import type { EnemyTypeId } from "../config/EnemyConfig";

const { ccclass, property } = _decorator;

@ccclass("EnemyView")
export class EnemyView extends Component {
  @property(Node)
  public normalVisual: Node | null = null;

  @property(Node)
  public fastVisual: Node | null = null;

  @property(Node)
  public heavyVisual: Node | null = null;

  @property(Node)
  public shieldVisual: Node | null = null;

  @property(Node)
  public splitVisual: Node | null = null;

  @property(Node)
  public healerVisual: Node | null = null;

  @property(Node)
  public bossVisual: Node | null = null;

  @property(Node)
  public hpBarFill: Node | null = null;

  @property(Sprite)
  public slowTintTarget: Sprite | null = null;

  public applyEnemyType(type: EnemyTypeId): void {
    const hasShieldVisual = !!this.shieldVisual;
    const hasSplitVisual = !!this.splitVisual;
    const hasHealerVisual = !!this.healerVisual;
    if (this.normalVisual) this.normalVisual.active = type === "normal";
    if (this.fastVisual) this.fastVisual.active = type === "fast" || (type === "split" && !hasSplitVisual);
    if (this.heavyVisual) this.heavyVisual.active = type === "heavy" || (type === "shield" && !hasShieldVisual);
    if (this.shieldVisual) this.shieldVisual.active = type === "shield";
    if (this.splitVisual) this.splitVisual.active = type === "split";
    if (this.healerVisual) this.healerVisual.active = type === "healer";
    if (this.normalVisual && !hasHealerVisual) this.normalVisual.active = this.normalVisual.active || type === "healer";
    if (this.bossVisual) this.bossVisual.active = type === "boss";
  }

  public syncHp(currentHp: number, maxHp: number): void {
    if (!this.hpBarFill) return;

    const ratio = maxHp <= 0 ? 0 : Math.max(0, Math.min(1, currentHp / maxHp));
    const transform = this.hpBarFill.getComponent(UITransform);
    if (transform) {
      const baseWidth = 48;
      transform.setContentSize(baseWidth * ratio, transform.contentSize.height);
      return;
    }

    this.hpBarFill.setScale(ratio, 1, 1);
  }

  public setSlowed(isSlowed: boolean): void {
    if (!this.slowTintTarget) return;

    this.slowTintTarget.color = isSlowed ? new Color(120, 210, 255, 255) : Color.WHITE;
  }
}
