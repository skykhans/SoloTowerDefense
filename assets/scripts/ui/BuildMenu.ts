import { _decorator, Button, Component, Label, Node, Vec3 } from "cc";
import type { TowerTypeId } from "../config/TowerConfig";
import { ConfigService } from "../config/ConfigService";
import { GameManager } from "../systems/GameManager";
import { VibrationService } from "../platform/VibrationService";

const { ccclass, property } = _decorator;

export interface BuildMenuButtonBinding {
  towerType: TowerTypeId;
  node: Node;
  button: Button;
  iconLabel: Label;
  costLabel: Label;
}

@ccclass("BuildMenu")
export class BuildMenu extends Component {
  @property(GameManager)
  public gameManager: GameManager | null = null;

  @property(Label)
  public titleLabel: Label | null = null;

  @property(Label)
  public hintLabel: Label | null = null;

  private buildPosition: Vec3 | null = null;
  private buttonBindings: BuildMenuButtonBinding[] = [];

  public configure(buttonBindings: BuildMenuButtonBinding[]): void {
    this.buttonBindings = buttonBindings;
  }

  public openAt(worldPosition: Vec3): void {
    this.buildPosition = worldPosition.clone();
    this.node.setPosition(this.clampMenuPosition(worldPosition));
    this.node.active = true;
    this.render();
  }

  public hide(): void {
    this.buildPosition = null;
    this.node.active = false;
  }

  update(): void {
    if (!this.node.active) {
      return;
    }
    this.render();
  }

  public buildTower(towerType: TowerTypeId): void {
    if (!this.buildPosition) {
      return;
    }
    const tower = this.gameManager?.createTower(towerType, this.buildPosition) ?? null;
    if (!tower) {
      return;
    }
    this.gameManager?.selectTower(tower);
    this.hide();
    VibrationService.vibrateShort();
  }

  private render(): void {
    const currentGold = this.gameManager?.gameState?.gold ?? 0;
    if (this.titleLabel) {
      this.titleLabel.string = "建造炮塔";
    }
    if (this.hintLabel) {
      this.hintLabel.string = "点击一种炮塔立即建造";
    }

    for (const binding of this.buttonBindings) {
      const config = ConfigService.getTowerConfig(binding.towerType);
      binding.iconLabel.string = this.resolveTowerIcon(binding.towerType);
      binding.costLabel.string = `${this.resolveTowerName(binding.towerType)} ${config.cost}`;
      binding.button.interactable = currentGold >= config.cost;
      binding.node.opacity = currentGold >= config.cost ? 255 : 130;
    }
  }

  private clampMenuPosition(position: Vec3): Vec3 {
    return new Vec3(
      Math.max(-300, Math.min(300, position.x)),
      Math.max(-188, Math.min(188, position.y)),
      0
    );
  }

  private resolveTowerName(type: TowerTypeId): string {
    switch (type) {
      case "rapid":
        return "速射塔";
      case "cannon":
        return "重炮塔";
      case "frost":
        return "减速塔";
      case "burst":
        return "连发塔";
      case "sniper":
        return "狙击塔";
      case "mortar":
        return "迫击塔";
      default:
        return type;
    }
  }

  private resolveTowerIcon(type: TowerTypeId): string {
    switch (type) {
      case "rapid":
        return "速";
      case "cannon":
        return "炮";
      case "frost":
        return "冰";
      case "burst":
        return "连";
      case "sniper":
        return "狙";
      case "mortar":
        return "迫";
      default:
        return "塔";
    }
  }
}
