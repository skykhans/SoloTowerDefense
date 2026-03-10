import { _decorator, Component, Label, Node, view } from "cc";
import { PlatformService } from "../platform/PlatformService";
import { UILayoutService } from "../platform/UILayoutService";
import { SystemInfoService } from "../platform/SystemInfoService";

const { ccclass, property } = _decorator;

@ccclass("PlatformDebugPanel")
export class PlatformDebugPanel extends Component {
  private readonly handleCanvasResize = (): void => {
    this.render();
  };

  @property(Node)
  public panelRoot: Node | null = null;

  @property(Label)
  public infoLabel: Label | null = null;

  @property
  public visibleInDebug = true;

  onEnable(): void {
    view.on("canvas-resize", this.handleCanvasResize, this);
    this.render();
  }

  onDisable(): void {
    view.off("canvas-resize", this.handleCanvasResize, this);
  }

  public render(): void {
    const profile = PlatformService.getProfile();
    const systemInfo = SystemInfoService.getSystemInfo();
    const layout = UILayoutService.getLayoutProfile();

    if (this.panelRoot) {
      this.panelRoot.active = this.visibleInDebug;
    }

    if (!this.infoLabel) {
      return;
    }

    this.infoLabel.string =
      `平台 ${profile.name}\n` +
      `类型 ${profile.type}\n` +
      `存储 ${profile.storageName}\n` +
      `布局 ${layout.mode}\n` +
      `分辨率 ${systemInfo.screenWidth} x ${systemInfo.screenHeight}\n` +
      `安全区 上${layout.safePaddingTop} 下${layout.safePaddingBottom} 左${layout.safePaddingLeft} 右${layout.safePaddingRight}\n` +
      `像素比 ${systemInfo.pixelRatio}\n` +
      `语言 ${systemInfo.language}`;
  }

  public toggleVisible(): void {
    this.visibleInDebug = !this.visibleInDebug;
    this.render();
  }
}
