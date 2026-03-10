import { _decorator, Component, Node, tween, Vec3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass("HitEffect")
export class HitEffect extends Component {
  @property(Node)
  public coreVisual: Node | null = null;

  @property
  public lifetime = 0.2;

  public play(): void {
    const target = this.coreVisual ?? this.node;
    target.setScale(new Vec3(0.5, 0.5, 1));
    tween(target)
      .to(this.lifetime, { scale: new Vec3(1.2, 1.2, 1) })
      .call(() => {
        this.node.destroy();
      })
      .start();
  }
}
