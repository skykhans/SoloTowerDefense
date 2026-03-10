import {
  _decorator,
  Button,
  Canvas,
  Color,
  Component,
  Graphics,
  Label,
  Layers,
  Node,
  UITransform,
  Vec3,
  Widget,
} from "cc";
import { BuildSpot } from "../entities/BuildSpot";
import { BuildSpotView } from "../entities/BuildSpotView";
import { Bullet } from "../entities/Bullet";
import { BulletView } from "../entities/BulletView";
import { Enemy } from "../entities/Enemy";
import { EnemyView } from "../entities/EnemyView";
import { HitEffect } from "../entities/HitEffect";
import { Tower } from "../entities/Tower";
import { TowerView } from "../entities/TowerView";
import { BuildSpotManager } from "../map/BuildSpotManager";
import { BuildSpotClickHandler } from "../map/BuildSpotClickHandler";
import { PathManager } from "../map/PathManager";
import { GameState } from "../core/GameState";
import { BattleUI } from "../ui/BattleUI";
import { TowerPanel } from "../ui/TowerPanel";
import { EnemyMovementSystem } from "../systems/EnemyMovementSystem";
import { GameManager } from "../systems/GameManager";
import { TowerCombatSystem } from "../systems/TowerCombatSystem";
import { WaveSpawnSystem } from "../systems/WaveSpawnSystem";

const { ccclass } = _decorator;

@ccclass("RuntimeBattleBootstrap")
export class RuntimeBattleBootstrap extends Component {
  onLoad(): void {
    const canvas = this.node.parent?.getComponent(Canvas);
    if (!canvas || this.node.getChildByName("GameRoot")) {
      return;
    }

    const gameRoot = this.createNode("GameRoot", this.node, new Vec3(0, 0, 0), new Vec3(1, 1, 1), new Vec3(0.5, 0.5, 0));
    gameRoot.layer = Layers.Enum.UI_2D;

    const managers = this.createNode("Managers", gameRoot);
    const world = this.createNode("World", gameRoot);
    const ui = this.createNode("UI", gameRoot);
    const topHud = this.createNode("TopHUD", ui, new Vec3(0, 280, 0));
    const buildToolbar = this.createNode("BuildToolbar", ui, new Vec3(0, -260, 0));
    const towerPanelNode = this.createNode("TowerPanel", ui, new Vec3(300, -150, 0));

    const mapLayer = this.createNode("MapLayer", world);
    const buildSpotLayer = this.createNode("BuildSpotLayer", world);
    const towerLayer = this.createNode("TowerLayer", world);
    const enemyLayer = this.createNode("EnemyLayer", world);
    const bulletLayer = this.createNode("BulletLayer", world);
    const effectLayer = this.createNode("EffectLayer", world);

    const gameState = managers.addComponent(GameState);
    const pathManager = managers.addComponent(PathManager);
    const buildSpotManager = managers.addComponent(BuildSpotManager);
    const enemyMovementSystem = managers.addComponent(EnemyMovementSystem);
    const towerCombatSystem = managers.addComponent(TowerCombatSystem);
    const waveSpawnSystem = managers.addComponent(WaveSpawnSystem);
    const gameManager = managers.addComponent(GameManager);

    enemyMovementSystem.pathManager = pathManager;
    towerCombatSystem.bulletLayer = bulletLayer;
    towerCombatSystem.effectLayer = effectLayer;
    buildSpotManager.buildSpotLayer = buildSpotLayer;
    buildSpotManager.gameManager = gameManager;

    gameManager.gameState = gameState;
    gameManager.pathManager = pathManager;
    gameManager.buildSpotManager = buildSpotManager;
    gameManager.enemyMovementSystem = enemyMovementSystem;
    gameManager.towerCombatSystem = towerCombatSystem;
    gameManager.waveSpawnSystem = waveSpawnSystem;
    gameManager.enemyLayer = enemyLayer;
    gameManager.towerLayer = towerLayer;

    gameManager.enemyPrefab = this.createEnemyTemplate();
    gameManager.towerPrefab = this.createTowerTemplate();
    buildSpotManager.buildSpotPrefab = this.createBuildSpotTemplate();
    towerCombatSystem.bulletPrefab = this.createBulletTemplate();
    towerCombatSystem.hitEffectPrefab = this.createHitEffectTemplate();

    this.drawBattleBackground(mapLayer, pathManager);
    const battleUI = this.buildBattleHud(topHud, buildToolbar, gameState, gameManager);
    const towerPanel = this.buildTowerPanel(towerPanelNode, gameManager);
    towerPanel.renderTower(null);
    battleUI.update();
  }

  private buildBattleHud(topHud: Node, buildToolbar: Node, gameState: GameState, gameManager: GameManager): BattleUI {
    const resourceBar = this.createNode("ResourceBar", topHud, new Vec3(-180, 0, 0));
    const actionButtons = this.createNode("ActionButtons", topHud, new Vec3(210, 0, 0));

    const livesLabel = this.createText("LivesLabel", resourceBar, "生命 20", new Vec3(-150, 0, 0));
    const goldLabel = this.createText("GoldLabel", resourceBar, "金币 120", new Vec3(-40, 0, 0));
    const waveLabel = this.createText("WaveLabel", resourceBar, "波次 1", new Vec3(60, 0, 0));
    const killsLabel = this.createText("KillsLabel", resourceBar, "击杀 0", new Vec3(150, 0, 0));
    const bestWaveLabel = this.createText("BestWaveLabel", topHud, "最佳 1", new Vec3(0, -34, 0));
    const phaseLabel = this.createText("PhaseLabel", topHud, "待命", new Vec3(0, -62, 0));
    const tutorialLabel = this.createText("TutorialLabel", topHud, "首次进入建议先放塔。", new Vec3(0, -92, 0), 22);
    const buildModeLabel = this.createText("BuildModeLabel", buildToolbar, "当前未选择建造模式", new Vec3(0, 30, 0), 24);

    const startWave = this.createActionButton("StartWaveButton", actionButtons, "开始波次", new Vec3(-110, 0, 0));
    const pause = this.createActionButton("PauseButton", actionButtons, "暂停", new Vec3(0, 0, 0));
    const restart = this.createActionButton("RestartButton", actionButtons, "重开", new Vec3(110, 0, 0));

    const rapid = this.createActionButton("RapidButton", buildToolbar, "速射塔", new Vec3(-180, -24, 0));
    const cannon = this.createActionButton("CannonButton", buildToolbar, "重炮塔", new Vec3(-60, -24, 0));
    const frost = this.createActionButton("FrostButton", buildToolbar, "减速塔", new Vec3(60, -24, 0));
    const clear = this.createActionButton("ClearBuildSelectionButton", buildToolbar, "取消建造", new Vec3(190, -24, 0));

    const battleUI = topHud.addComponent(BattleUI);
    battleUI.gameState = gameState;
    battleUI.gameManager = gameManager;
    battleUI.livesLabel = livesLabel;
    battleUI.goldLabel = goldLabel;
    battleUI.waveLabel = waveLabel;
    battleUI.killsLabel = killsLabel;
    battleUI.bestWaveLabel = bestWaveLabel;
    battleUI.phaseLabel = phaseLabel;
    battleUI.buildModeLabel = buildModeLabel;
    battleUI.tutorialLabel = tutorialLabel;
    battleUI.startWaveButton = startWave.button;
    battleUI.startWaveButtonLabel = startWave.label;
    battleUI.pauseButton = pause.button;
    battleUI.pauseButtonLabel = pause.label;

    this.bindButton(startWave.node, startWave.button, () => battleUI.onStartWave());
    this.bindButton(pause.node, pause.button, () => battleUI.onTogglePause());
    this.bindButton(restart.node, restart.button, () => battleUI.onRestartBattle());
    this.bindButton(rapid.node, rapid.button, () => battleUI.onSelectRapid());
    this.bindButton(cannon.node, cannon.button, () => battleUI.onSelectCannon());
    this.bindButton(frost.node, frost.button, () => battleUI.onSelectFrost());
    this.bindButton(clear.node, clear.button, () => battleUI.onClearBuildSelection());

    return battleUI;
  }

  private buildTowerPanel(panelNode: Node, gameManager: GameManager): TowerPanel {
    this.ensureSize(panelNode, 300, 180);
    const title = this.createText("TowerPanelTitle", panelNode, "炮塔面板", new Vec3(0, 62, 0), 28);
    const info = this.createText("TowerInfoLabel", panelNode, "未选中炮塔", new Vec3(0, 24, 0), 22);
    const upgradeValue = this.createText("UpgradeValueLabel", panelNode, "升级花费 -", new Vec3(0, -10, 0), 20);
    const sellValue = this.createText("SellValueLabel", panelNode, "出售返还 -", new Vec3(0, -36, 0), 20);
    const hint = this.createText("ActionHintLabel", panelNode, "点击炮塔查看详情。", new Vec3(0, -68, 0), 18);
    const upgrade = this.createActionButton("UpgradeButton", panelNode, "升级", new Vec3(-70, -110, 0));
    const sell = this.createActionButton("SellButton", panelNode, "出售", new Vec3(70, -110, 0));

    const panel = panelNode.addComponent(TowerPanel);
    panel.gameManager = gameManager;
    panel.titleLabel = title;
    panel.infoLabel = info;
    panel.upgradeValueLabel = upgradeValue;
    panel.sellValueLabel = sellValue;
    panel.actionHintLabel = hint;
    panel.upgradeButton = upgrade.button;
    panel.sellButton = sell.button;

    this.bindButton(upgrade.node, upgrade.button, () => panel.onUpgradeTower());
    this.bindButton(sell.node, sell.button, () => panel.onSellTower());

    return panel;
  }

  private drawBattleBackground(mapLayer: Node, pathManager: PathManager): void {
    const background = this.createNode("MapBackground", mapLayer);
    const graphics = background.addComponent(Graphics);
    graphics.fillColor = new Color(24, 28, 36, 255);
    graphics.rect(-480, -320, 960, 640);
    graphics.fill();
    graphics.lineWidth = 40;
    graphics.strokeColor = new Color(82, 93, 108, 255);

    const start = pathManager.waypoints[0];
    graphics.moveTo(start.x, start.y);
    for (const point of pathManager.waypoints.slice(1)) {
      graphics.lineTo(point.x, point.y);
    }
    graphics.stroke();
  }

  private createEnemyTemplate(): Node {
    const node = this.createNode("EnemyTemplate");
    this.ensureSize(node, 48, 48);
    const view = node.addComponent(EnemyView);
    const enemy = node.addComponent(Enemy);
    enemy.enemyView = view;

    view.normalVisual = this.createText("NormalVisual", node, "普", new Vec3(0, 0, 0), 24).node;
    view.fastVisual = this.createText("FastVisual", node, "快", new Vec3(0, 0, 0), 24).node;
    view.heavyVisual = this.createText("HeavyVisual", node, "重", new Vec3(0, 0, 0), 24).node;
    view.shieldVisual = this.createText("ShieldVisual", node, "盾", new Vec3(0, 0, 0), 24).node;
    view.splitVisual = this.createText("SplitVisual", node, "裂", new Vec3(0, 0, 0), 24).node;
    view.healerVisual = this.createText("HealerVisual", node, "疗", new Vec3(0, 0, 0), 24).node;
    view.bossVisual = this.createText("BossVisual", node, "B", new Vec3(0, 0, 0), 30).node;
    view.hpBarFill = this.createText("HpBarFill", node, "====", new Vec3(0, -26, 0), 16).node;
    view.applyEnemyType("normal");
    return node;
  }

  private createTowerTemplate(): Node {
    const node = this.createNode("TowerTemplate");
    this.ensureSize(node, 64, 64);
    const view = node.addComponent(TowerView);
    const tower = node.addComponent(Tower);
    tower.towerView = view;

    view.selectionRing = this.createText("SelectionRing", node, "◎", new Vec3(0, 0, 0), 46).node;
    view.rangeIndicator = this.createText("RangeIndicator", node, "○", new Vec3(0, 0, 0), 36).node;
    view.rapidVisual = this.createText("RapidVisual", node, "速", new Vec3(0, 0, 0), 22).node;
    view.cannonVisual = this.createText("CannonVisual", node, "炮", new Vec3(0, 0, 0), 22).node;
    view.frostVisual = this.createText("FrostVisual", node, "冰", new Vec3(0, 0, 0), 22).node;
    view.setSelected(false);
    return node;
  }

  private createBuildSpotTemplate(): Node {
    const node = this.createNode("BuildSpotTemplate");
    this.ensureSize(node, 54, 54);
    const view = node.addComponent(BuildSpotView);
    const spot = node.addComponent(BuildSpot);
    const click = node.addComponent(BuildSpotClickHandler);
    spot.buildSpotView = view;
    view.availableVisual = this.createText("AvailableVisual", node, "○", new Vec3(0, 0, 0), 34).node;
    view.occupiedVisual = this.createText("OccupiedVisual", node, "■", new Vec3(0, 0, 0), 24).node;
    view.buildModeHintVisual = this.createText("BuildModeHintVisual", node, "+", new Vec3(0, 0, 0), 30).node;
    click.enabled = true;
    return node;
  }

  private createBulletTemplate(): Node {
    const node = this.createNode("BulletTemplate");
    this.ensureSize(node, 18, 18);
    const view = node.addComponent(BulletView);
    const bullet = node.addComponent(Bullet);
    bullet.bulletView = view;
    view.rapidVisual = this.createText("RapidVisual", node, ".", new Vec3(0, 0, 0), 22).node;
    view.cannonVisual = this.createText("CannonVisual", node, "*", new Vec3(0, 0, 0), 22).node;
    view.frostVisual = this.createText("FrostVisual", node, "•", new Vec3(0, 0, 0), 22).node;
    return node;
  }

  private createHitEffectTemplate(): Node {
    const node = this.createNode("HitEffectTemplate");
    const effect = node.addComponent(HitEffect);
    effect.coreVisual = this.createText("CoreVisual", node, "✦", new Vec3(0, 0, 0), 26).node;
    return node;
  }

  private createActionButton(name: string, parent: Node, text: string, position: Vec3): { node: Node; button: Button; label: Label } {
    const node = this.createNode(name, parent, position);
    this.ensureSize(node, 96, 40);
    const button = node.addComponent(Button);
    const label = this.createText(`${name}Label`, node, text, new Vec3(0, 0, 0), 20);
    return { node, button, label };
  }

  private bindButton(node: Node, button: Button, onTap: () => void): void {
    node.on(Node.EventType.TOUCH_END, () => {
      if (!button.interactable) {
        return;
      }
      onTap();
    });
  }

  private createText(name: string, parent: Node, text: string, position: Vec3, fontSize = 20): Label {
    const node = this.createNode(name, parent, position);
    this.ensureSize(node, 220, 30);
    const label = node.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.lineHeight = fontSize + 4;
    label.color = new Color(230, 235, 245, 255);
    return label;
  }

  private createNode(
    name: string,
    parent?: Node | null,
    position: Vec3 = new Vec3(),
    scale: Vec3 = new Vec3(1, 1, 1),
    anchor?: Vec3
  ): Node {
    const node = new Node(name);
    if (parent) {
      parent.addChild(node);
    }
    node.setPosition(position);
    node.setScale(scale);
    const transform = node.addComponent(UITransform);
    if (anchor) {
      transform.setAnchorPoint(anchor.x, anchor.y);
    }
    return node;
  }

  private ensureSize(node: Node, width: number, height: number): void {
    const transform = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    transform.setContentSize(width, height);
  }
}
