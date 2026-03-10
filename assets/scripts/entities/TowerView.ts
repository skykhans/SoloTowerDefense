import { _decorator, Component, Node, UITransform, Vec3 } from "cc";
import type { TowerTypeId } from "../config/TowerConfig";

const { ccclass, property } = _decorator;

@ccclass("TowerView")
export class TowerView extends Component {
  @property(Node)
  public selectionRing: Node | null = null;

  @property(Node)
  public rangeIndicator: Node | null = null;

  @property(Node)
  public rapidVisual: Node | null = null;

  @property(Node)
  public cannonVisual: Node | null = null;

  @property(Node)
  public frostVisual: Node | null = null;

  @property(Node)
  public burstVisual: Node | null = null;

  @property(Node)
  public sniperVisual: Node | null = null;

  @property(Node)
  public mortarVisual: Node | null = null;

  @property(Node)
  public upgradeMarker: Node | null = null;

  onLoad(): void {
    this.setSelected(false);
  }

  public applyTowerType(type: TowerTypeId): void {
    if (this.rapidVisual) this.rapidVisual.active = type === "rapid";
    if (this.cannonVisual) this.cannonVisual.active = type === "cannon";
    if (this.frostVisual) this.frostVisual.active = type === "frost";
    if (this.burstVisual) this.burstVisual.active = type === "burst";
    if (this.sniperVisual) this.sniperVisual.active = type === "sniper";
    if (this.mortarVisual) this.mortarVisual.active = type === "mortar";
  }

  public setSelected(selected: boolean): void {
    if (this.selectionRing) this.selectionRing.active = selected;
    if (this.rangeIndicator) this.rangeIndicator.active = selected;
  }

  public setUpgradeReady(ready: boolean): void {
    if (this.upgradeMarker) {
      this.upgradeMarker.active = ready;
    }
  }

  public syncRange(range: number): void {
    if (!this.rangeIndicator) return;

    const diameter = Math.max(24, range * 2);
    const transform = this.rangeIndicator.getComponent(UITransform);
    if (transform) {
      transform.setContentSize(diameter, diameter);
      return;
    }

    this.rangeIndicator.setScale(new Vec3(diameter / 100, diameter / 100, 1));
  }
}
