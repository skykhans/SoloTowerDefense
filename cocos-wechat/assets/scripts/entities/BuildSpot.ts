import { _decorator, Component } from "cc";
import { BuildSpotView } from "./BuildSpotView";

const { ccclass, property } = _decorator;

@ccclass("BuildSpot")
export class BuildSpot extends Component {
  @property(BuildSpotView)
  public buildSpotView: BuildSpotView | null = null;

  public isOccupied = false;

  public occupy(): void {
    this.isOccupied = true;
    this.render(false);
  }

  public release(): void {
    this.isOccupied = false;
    this.render(false);
  }

  public render(isBuildModeActive: boolean): void {
    this.buildSpotView?.render(this.isOccupied, isBuildModeActive);
  }
}
