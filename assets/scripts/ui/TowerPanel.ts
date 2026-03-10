import { _decorator, Button, Component, Label } from "cc";
import { GameManager } from "../systems/GameManager";
import { Tower } from "../entities/Tower";
import { VibrationService } from "../platform/VibrationService";

const { ccclass, property } = _decorator;

@ccclass("TowerPanel")
export class TowerPanel extends Component {
  @property(GameManager)
  public gameManager: GameManager | null = null;

  @property(Label)
  public titleLabel: Label | null = null;

  @property(Label)
  public infoLabel: Label | null = null;

  @property(Label)
  public upgradeValueLabel: Label | null = null;

  @property(Label)
  public sellValueLabel: Label | null = null;

  @property(Label)
  public actionHintLabel: Label | null = null;

  @property(Button)
  public upgradeButton: Button | null = null;

  @property(Button)
  public sellButton: Button | null = null;

  update(): void {
    this.renderTower(this.gameManager?.getSelectedTower() ?? null);
  }

  public renderTower(tower: Tower | null): void {
    if (!tower) {
      this.node.active = false;
      if (this.titleLabel) this.titleLabel.string = "炮塔面板";
      if (this.infoLabel) this.infoLabel.string = "未选中炮塔";
      if (this.upgradeValueLabel) this.upgradeValueLabel.string = "升级花费 -";
      if (this.sellValueLabel) this.sellValueLabel.string = "出售返还 -";
      if (this.actionHintLabel) this.actionHintLabel.string = "点击场景中的炮塔查看详细信息。";
      if (this.upgradeButton) this.upgradeButton.interactable = false;
      if (this.sellButton) this.sellButton.interactable = false;
      return;
    }

    if (!this.node.active) {
      this.node.active = true;
    }
    const canUpgrade = tower.canUpgrade();
    const upgradeCost = tower.getUpgradeCost();
    const sellValue = tower.getSellValue();
    const currentGold = this.gameManager?.gameState?.gold ?? 0;
    const slowText = tower.slowFactor < 1 ? ` | 减速 ${Math.round((1 - tower.slowFactor) * 100)}%` : "";
    if (this.titleLabel) this.titleLabel.string = `${this.resolveTowerName(tower)} Lv.${tower.level}/${Tower.MAX_LEVEL}`;
    if (this.infoLabel) {
      this.infoLabel.string = `伤害 ${tower.damage} | 射程 ${Math.round(tower.range)} | 攻速 ${tower.fireInterval.toFixed(2)}${slowText}`;
    }
    if (this.upgradeValueLabel) {
      this.upgradeValueLabel.string = canUpgrade ? `升级花费 ${upgradeCost}` : "升级花费 已满级";
    }
    if (this.sellValueLabel) {
      this.sellValueLabel.string = `出售返还 ${sellValue}`;
    }
    if (this.actionHintLabel) {
      this.actionHintLabel.string = !canUpgrade
        ? "已完成三次升级，当前炮塔已满级。"
        : currentGold >= upgradeCost
          ? "金币足够，可以继续升级。"
          : "金币不足，可先完成当前波次获取更多资源。";
    }
    if (this.upgradeButton) this.upgradeButton.interactable = canUpgrade && currentGold >= upgradeCost;
    if (this.sellButton) this.sellButton.interactable = true;
  }

  public onUpgradeTower(): void {
    if (this.gameManager?.upgradeSelectedTower()) {
      VibrationService.vibrateShort();
    }
  }

  public onSellTower(): void {
    if (this.gameManager?.sellSelectedTower()) {
      VibrationService.vibrateShort();
    }
  }

  private resolveTowerName(tower: Tower): string {
    switch (tower.towerType) {
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
        return tower.towerType;
    }
  }
}
