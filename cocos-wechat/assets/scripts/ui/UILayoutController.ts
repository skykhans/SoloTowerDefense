import { _decorator, Component, Node, Vec3, view } from "cc";
import { UILayoutService } from "../platform/UILayoutService";
import { UILayoutControllerPresetId, UILayoutPresets } from "./UILayoutPresets";

const { ccclass, property } = _decorator;

@ccclass("UILayoutController")
export class UILayoutController extends Component {
  private readonly handleCanvasResize = (): void => {
    this.applyLayout();
  };

  @property(Node)
  public targetRoot: Node | null = null;

  @property
  public presetId: UILayoutControllerPresetId = "custom";

  @property
  public compactScale = 0.92;

  @property
  public standardScale = 1;

  @property
  public portraitScale = 1;

  @property
  public landscapeScale = 1;

  @property([Node])
  public compactOnlyNodes: Node[] = [];

  @property([Node])
  public standardOnlyNodes: Node[] = [];

  @property([Node])
  public portraitOnlyNodes: Node[] = [];

  @property([Node])
  public landscapeOnlyNodes: Node[] = [];

  onEnable(): void {
    view.on("canvas-resize", this.handleCanvasResize, this);
    this.applyLayout();
  }

  onDisable(): void {
    view.off("canvas-resize", this.handleCanvasResize, this);
  }

  public applyLayout(): void {
    this.applyPresetIfNeeded();

    const layout = UILayoutService.getLayoutProfile();
    const root = this.targetRoot ?? this.node;
    const scale = (layout.mode === "compact" ? this.compactScale : this.standardScale) *
      (layout.isLandscape ? this.landscapeScale : this.portraitScale);

    root.setScale(new Vec3(scale, scale, 1));

    this.setNodesActive(this.compactOnlyNodes, layout.mode === "compact");
    this.setNodesActive(this.standardOnlyNodes, layout.mode === "standard");
    this.setNodesActive(this.portraitOnlyNodes, !layout.isLandscape);
    this.setNodesActive(this.landscapeOnlyNodes, layout.isLandscape);
  }

  private applyPresetIfNeeded(): void {
    const preset = UILayoutPresets.getControllerPreset(this.presetId);
    if (!preset) {
      return;
    }

    this.compactScale = preset.compactScale;
    this.standardScale = preset.standardScale;
    this.portraitScale = preset.portraitScale;
    this.landscapeScale = preset.landscapeScale;
  }

  private setNodesActive(nodes: Node[], active: boolean): void {
    for (const node of nodes) {
      if (node) {
        node.active = active;
      }
    }
  }
}
