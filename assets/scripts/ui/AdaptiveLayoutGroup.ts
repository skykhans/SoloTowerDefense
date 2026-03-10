import { _decorator, Component, Layout, view } from "cc";
import { UILayoutService } from "../platform/UILayoutService";
import { AdaptiveLayoutGroupPresetId, UILayoutPresets } from "./UILayoutPresets";

const { ccclass, property } = _decorator;

@ccclass("AdaptiveLayoutGroup")
export class AdaptiveLayoutGroup extends Component {
  private readonly handleCanvasResize = (): void => {
    this.applyLayout();
  };

  @property(Layout)
  public layout: Layout | null = null;

  @property
  public presetId: AdaptiveLayoutGroupPresetId = "custom";

  @property
  public portraitType = Layout.Type.VERTICAL;

  @property
  public landscapeType = Layout.Type.HORIZONTAL;

  @property
  public portraitResizeMode = Layout.ResizeMode.CONTAINER;

  @property
  public landscapeResizeMode = Layout.ResizeMode.CONTAINER;

  @property
  public compactSpacingX = 12;

  @property
  public compactSpacingY = 12;

  @property
  public standardSpacingX = 20;

  @property
  public standardSpacingY = 20;

  @property
  public portraitPaddingLeft = 0;

  @property
  public portraitPaddingRight = 0;

  @property
  public portraitPaddingTop = 0;

  @property
  public portraitPaddingBottom = 0;

  @property
  public landscapePaddingLeft = 0;

  @property
  public landscapePaddingRight = 0;

  @property
  public landscapePaddingTop = 0;

  @property
  public landscapePaddingBottom = 0;

  onEnable(): void {
    view.on("canvas-resize", this.handleCanvasResize, this);
    this.applyLayout();
  }

  onDisable(): void {
    view.off("canvas-resize", this.handleCanvasResize, this);
  }

  public applyLayout(): void {
    const layout = this.layout ?? this.getComponent(Layout);
    if (!layout) {
      return;
    }

    this.applyPresetIfNeeded();

    const profile = UILayoutService.getLayoutProfile();
    const isCompact = profile.mode === "compact";
    const isLandscape = profile.isLandscape;

    layout.type = isLandscape ? this.landscapeType : this.portraitType;
    layout.resizeMode = isLandscape ? this.landscapeResizeMode : this.portraitResizeMode;
    layout.spacingX = isCompact ? this.compactSpacingX : this.standardSpacingX;
    layout.spacingY = isCompact ? this.compactSpacingY : this.standardSpacingY;
    layout.paddingLeft = isLandscape ? this.landscapePaddingLeft : this.portraitPaddingLeft;
    layout.paddingRight = isLandscape ? this.landscapePaddingRight : this.portraitPaddingRight;
    layout.paddingTop = isLandscape ? this.landscapePaddingTop : this.portraitPaddingTop;
    layout.paddingBottom = isLandscape ? this.landscapePaddingBottom : this.portraitPaddingBottom;

    layout.updateLayout();
  }

  private applyPresetIfNeeded(): void {
    const preset = UILayoutPresets.getAdaptivePreset(this.presetId);
    if (!preset) {
      return;
    }

    this.portraitType = preset.portraitType;
    this.landscapeType = preset.landscapeType;
    this.portraitResizeMode = preset.portraitResizeMode;
    this.landscapeResizeMode = preset.landscapeResizeMode;
    this.compactSpacingX = preset.compactSpacingX;
    this.compactSpacingY = preset.compactSpacingY;
    this.standardSpacingX = preset.standardSpacingX;
    this.standardSpacingY = preset.standardSpacingY;
    this.portraitPaddingLeft = preset.portraitPaddingLeft;
    this.portraitPaddingRight = preset.portraitPaddingRight;
    this.portraitPaddingTop = preset.portraitPaddingTop;
    this.portraitPaddingBottom = preset.portraitPaddingBottom;
    this.landscapePaddingLeft = preset.landscapePaddingLeft;
    this.landscapePaddingRight = preset.landscapePaddingRight;
    this.landscapePaddingTop = preset.landscapePaddingTop;
    this.landscapePaddingBottom = preset.landscapePaddingBottom;
  }
}
