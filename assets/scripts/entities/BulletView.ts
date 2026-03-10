import { _decorator, Component, Node } from "cc";
import type { TowerTypeId } from "../config/TowerConfig";

const { ccclass, property } = _decorator;

@ccclass("BulletView")
export class BulletView extends Component {
  @property(Node)
  public rapidVisual: Node | null = null;

  @property(Node)
  public cannonVisual: Node | null = null;

  @property(Node)
  public frostVisual: Node | null = null;

  public applyTowerType(type: TowerTypeId): void {
    if (this.rapidVisual) this.rapidVisual.active = type === "rapid";
    if (this.cannonVisual) this.cannonVisual.active = type === "cannon";
    if (this.frostVisual) this.frostVisual.active = type === "frost";
  }
}
