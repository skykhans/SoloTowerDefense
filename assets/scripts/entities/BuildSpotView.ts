import { _decorator, Component, Node } from "cc";

const { ccclass, property } = _decorator;

@ccclass("BuildSpotView")
export class BuildSpotView extends Component {
  @property(Node)
  public availableVisual: Node | null = null;

  @property(Node)
  public occupiedVisual: Node | null = null;

  @property(Node)
  public buildModeHintVisual: Node | null = null;

  public render(isOccupied: boolean, isBuildModeActive: boolean): void {
    if (this.availableVisual) {
      this.availableVisual.active = !isOccupied;
    }

    if (this.occupiedVisual) {
      this.occupiedVisual.active = isOccupied;
    }

    if (this.buildModeHintVisual) {
      this.buildModeHintVisual.active = !isOccupied && isBuildModeActive;
    }
  }
}
