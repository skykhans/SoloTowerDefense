import { _decorator, Component, Widget, view } from "cc";
import { UILayoutService } from "../platform/UILayoutService";

const { ccclass, property } = _decorator;

@ccclass("SafeAreaPanel")
export class SafeAreaPanel extends Component {
  private readonly handleCanvasResize = (): void => {
    this.applySafeArea();
  };

  @property
  public applyLeft = true;

  @property
  public applyRight = true;

  @property
  public applyTop = true;

  @property
  public applyBottom = true;

  onEnable(): void {
    view.on("canvas-resize", this.handleCanvasResize, this);
    this.applySafeArea();
  }

  onDisable(): void {
    view.off("canvas-resize", this.handleCanvasResize, this);
  }

  public applySafeArea(): void {
    const widget = this.getComponent(Widget);
    if (!widget) {
      return;
    }

    const layout = UILayoutService.getLayoutProfile();
    if (this.applyLeft) widget.left = layout.safePaddingLeft;
    if (this.applyRight) widget.right = layout.safePaddingRight;
    if (this.applyTop) widget.top = layout.safePaddingTop;
    if (this.applyBottom) widget.bottom = layout.safePaddingBottom;
  }
}
