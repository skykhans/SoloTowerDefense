import {
  _decorator,
  Button,
  Canvas,
  Color,
  Component,
  EventTouch,
  Graphics,
  Label,
  Layers,
  Node,
  UITransform,
  Vec3,
} from "cc";
import { Bullet } from "../entities/Bullet";
import { BulletView } from "../entities/BulletView";
import { ConfigService } from "../config/ConfigService";
import { LocalStorageService } from "../core/LocalStorageService";
import { Enemy } from "../entities/Enemy";
import { EnemyView } from "../entities/EnemyView";
import { HitEffect } from "../entities/HitEffect";
import { Tower } from "../entities/Tower";
import { TowerView } from "../entities/TowerView";
import { BuildSpotManager } from "../map/BuildSpotManager";
import { PathManager } from "../map/PathManager";
import { GameState } from "../core/GameState";
import { BattleUI } from "../ui/BattleUI";
import { BuildMenu, type BuildMenuButtonBinding } from "../ui/BuildMenu";
import { TowerPanel } from "../ui/TowerPanel";
import { EnemyMovementSystem } from "../systems/EnemyMovementSystem";
import { GameManager } from "../systems/GameManager";
import { TowerCombatSystem } from "../systems/TowerCombatSystem";
import { WaveSpawnSystem } from "../systems/WaveSpawnSystem";
import type { TowerTypeId } from "../config/TowerConfig";

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
    const topHud = this.createPanel("TopHUD", ui, new Vec3(0, 272, 0), 760, 76, new Color(84, 178, 154, 210), new Color(232, 251, 244, 190));
    const buildMenuNode = this.createPanel(
      "BuildMenu",
      ui,
      new Vec3(0, -180, 0),
      284,
      166,
      new Color(247, 238, 205, 232),
      new Color(183, 154, 99, 170)
    );
    buildMenuNode.active = false;
    const towerPanelNode = this.createPanel(
      "TowerPanel",
      ui,
      new Vec3(334, -202, 0),
      198,
      136,
      new Color(252, 243, 218, 235),
      new Color(192, 162, 96, 170)
    );

    const mapLayer = this.createNode("MapLayer", world);
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
    towerCombatSystem.bulletPrefab = this.createBulletTemplate();
    towerCombatSystem.hitEffectPrefab = this.createHitEffectTemplate();

    const selectedLevelId = LocalStorageService.loadPlayerSave().selectedLevel;
    const availableTowerTypes = ConfigService.getLevelConfig(selectedLevelId).availableTowerTypes;

    const mapHitArea = this.drawBattleBackground(mapLayer, pathManager, selectedLevelId);
    const battleUI = this.buildBattleHud(topHud, gameState, gameManager);
    const buildMenu = this.buildBuildMenu(buildMenuNode, gameManager, availableTowerTypes);
    const towerPanel = this.buildTowerPanel(towerPanelNode, gameManager);
    towerPanel.renderTower(null);
    const onPointerEnd = (event: EventTouch | { getUILocation?: () => { x: number; y: number }; getLocation?: () => { x: number; y: number } }) => {
      const transform = mapHitArea.getComponent(UITransform);
      if (!transform) {
        return;
      }

      const pointerEvent = event as EventTouch & {
        touch?: { getUILocation: () => { x: number; y: number } };
        getUILocation?: () => { x: number; y: number };
        getLocation?: () => { x: number; y: number };
      };
      const uiLocation =
        pointerEvent.touch?.getUILocation() ??
        pointerEvent.getUILocation?.() ??
        pointerEvent.getLocation?.() ??
        { x: 0, y: 0 };
      const localPosition = transform.convertToNodeSpaceAR(new Vec3(uiLocation.x, uiLocation.y, 0));
      if (!gameManager.canBuildAt(localPosition)) {
        buildMenu.hide();
        return;
      }

      gameManager.clearSelectedTower();
      buildMenu.openAt(localPosition);
    };
    mapHitArea.on(Node.EventType.TOUCH_END, onPointerEnd);
    mapHitArea.on("mouse-up", onPointerEnd);
    battleUI.update();
  }

  private buildBattleHud(
    topHud: Node,
    gameState: GameState,
    gameManager: GameManager
  ): BattleUI {
    const resourceBar = this.createNode("ResourceBar", topHud, new Vec3(-126, 2, 0));
    const actionButtons = this.createNode("ActionButtons", topHud, new Vec3(258, 2, 0));

    const livesLabel = this.createBadgeLabel("LivesLabel", resourceBar, "❤ 20", new Vec3(-118, 0, 0), 82, new Color(255, 255, 255, 210), new Color(55, 126, 105, 110), new Color(62, 78, 80, 255));
    const goldLabel = this.createBadgeLabel("GoldLabel", resourceBar, "🪙 120", new Vec3(-16, 0, 0), 92, new Color(255, 255, 255, 210), new Color(55, 126, 105, 110), new Color(62, 78, 80, 255));
    const waveLabel = this.createBadgeLabel("WaveLabel", resourceBar, "1 / 20 波", new Vec3(96, 0, 0), 126, new Color(255, 255, 255, 210), new Color(55, 126, 105, 110), new Color(62, 78, 80, 255));
    const killsLabel = this.createBadgeLabel("KillsLabel", resourceBar, "击杀 0", new Vec3(214, 0, 0), 86, new Color(255, 255, 255, 210), new Color(55, 126, 105, 110), new Color(62, 78, 80, 255));
    const bestWaveLabel = this.createText("BestWaveLabel", topHud, "最佳 1", new Vec3(-332, 0, 0), 16, 80, 20, new Color(245, 251, 247, 255), 0);
    const phaseLabel = this.createText("PhaseLabel", topHud, "待命", new Vec3(-286, 0, 0), 16, 70, 20, new Color(245, 251, 247, 255), 0);
    const tutorialLabel = this.createText("TutorialLabel", topHud, "点击空地建造炮塔，金币足够时可直接点塔顶升级。", new Vec3(24, -26, 0), 14, 420, 18, new Color(232, 247, 240, 255));
    const buildModeLabel = this.createText("BuildModeLabel", topHud, "点击空地打开建造菜单", new Vec3(-250, -26, 0), 14, 210, 18, new Color(232, 247, 240, 255), 0);

    const startWave = this.createActionButton("StartWaveButton", actionButtons, "▶", new Vec3(-92, 0, 0), 56, 36, new Color(255, 247, 237, 235), new Color(88, 111, 111, 255), new Color(141, 177, 168, 180));
    const pause = this.createActionButton("PauseButton", actionButtons, "⏸", new Vec3(-22, 0, 0), 56, 36, new Color(255, 247, 237, 235), new Color(88, 111, 111, 255), new Color(141, 177, 168, 180));
    const restart = this.createActionButton("RestartButton", actionButtons, "≡", new Vec3(48, 0, 0), 56, 36, new Color(255, 247, 237, 235), new Color(88, 111, 111, 255), new Color(141, 177, 168, 180));

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

    return battleUI;
  }

  private buildBuildMenu(buildMenuNode: Node, gameManager: GameManager, availableTowerTypes: TowerTypeId[]): BuildMenu {
    const titleLabel = this.createText("BuildMenuTitle", buildMenuNode, "建造炮塔", new Vec3(0, 56, 0), 18, 180, 20, new Color(109, 79, 42, 255));
    const hintLabel = this.createText("BuildMenuHint", buildMenuNode, "点击一种炮塔立即建造", new Vec3(0, 34, 0), 13, 220, 16, new Color(145, 112, 63, 255));
    const close = this.createActionButton(
      "CloseBuildMenuButton",
      buildMenuNode,
      "×",
      new Vec3(112, 56, 0),
      34,
      28,
      new Color(210, 198, 171, 255),
      new Color(114, 91, 54, 255),
      new Color(168, 146, 111, 150)
    );

    const buildMenu = buildMenuNode.addComponent(BuildMenu);
    buildMenu.gameManager = gameManager;
    buildMenu.titleLabel = titleLabel;
    buildMenu.hintLabel = hintLabel;

    const buttonBindings: BuildMenuButtonBinding[] = availableTowerTypes.slice(0, 6).map((towerType, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = column === 0 ? -60 : 60;
      const y = 0 - row * 42;
      const style = this.resolveTowerButtonStyle(towerType);
      const button = this.createActionButton(
        `${towerType}BuildButton`,
        buildMenuNode,
        style.icon,
        new Vec3(x - 36, y, 0),
        44,
        28,
        style.fill,
        style.text,
        style.stroke
      );
      const costLabel = this.createText(
        `${towerType}BuildCost`,
        buildMenuNode,
        "",
        new Vec3(x + 18, y, 0),
        12,
        92,
        18,
        new Color(125, 102, 62, 255),
        0
      );
      this.bindButton(button.node, button.button, () => buildMenu.buildTower(towerType));
      return {
        towerType,
        node: button.node,
        button: button.button,
        iconLabel: button.label,
        costLabel,
      };
    });

    buildMenu.configure(buttonBindings);
    this.bindButton(close.node, close.button, () => buildMenu.hide());
    return buildMenu;
  }

  private buildTowerPanel(panelNode: Node, gameManager: GameManager): TowerPanel {
    const title = this.createText("TowerPanelTitle", panelNode, "炮塔面板", new Vec3(0, 42, 0), 22, 150, 24, new Color(131, 97, 47, 255));
    const info = this.createText("TowerInfoLabel", panelNode, "未选中炮塔", new Vec3(0, 14, 0), 15, 180, 28, new Color(92, 80, 57, 255));
    const upgradeValue = this.createText("UpgradeValueLabel", panelNode, "升级花费 -", new Vec3(0, -10, 0), 15, 180, 18, new Color(109, 95, 69, 255));
    const sellValue = this.createText("SellValueLabel", panelNode, "出售返还 -", new Vec3(0, -28, 0), 15, 180, 18, new Color(109, 95, 69, 255));
    const hint = this.createText("ActionHintLabel", panelNode, "点击炮塔查看详情。", new Vec3(0, -48, 0), 13, 176, 20, new Color(131, 112, 82, 255));
    const upgrade = this.createActionButton("UpgradeButton", panelNode, "升级", new Vec3(-40, -72, 0), 70, 30, new Color(255, 191, 84, 255), new Color(116, 80, 23, 255), new Color(205, 146, 48, 170));
    const sell = this.createActionButton("SellButton", panelNode, "出售", new Vec3(40, -72, 0), 70, 30, new Color(249, 133, 99, 255), new Color(255, 248, 245, 255), new Color(196, 98, 71, 170));

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
    panel.node.active = false;
    gameManager.towerPanel = panel;

    return panel;
  }

  private drawBattleBackground(mapLayer: Node, pathManager: PathManager, levelId: number): Node {
    const background = this.createNode("MapBackground", mapLayer);
    this.ensureSize(background, 960, 640);
    const graphics = background.addComponent(Graphics);
    graphics.fillColor = new Color(83, 222, 197, 255);
    graphics.rect(-480, -320, 960, 640);
    graphics.fill();

    graphics.fillColor = new Color(64, 188, 164, 255);
    graphics.circle(-390, 0, 180);
    graphics.fill();
    graphics.circle(390, 0, 180);
    graphics.fill();

    graphics.fillColor = new Color(117, 232, 209, 90);
    graphics.circle(0, 0, 260);
    graphics.fill();

    graphics.lineWidth = 56;
    graphics.strokeColor = new Color(200, 171, 123, 255);
    const startShadow = pathManager.waypoints[0];
    graphics.moveTo(startShadow.x + 6, startShadow.y - 6);
    for (const point of pathManager.waypoints.slice(1)) {
      graphics.lineTo(point.x + 6, point.y - 6);
    }
    graphics.stroke();

    graphics.lineWidth = 40;
    graphics.strokeColor = new Color(244, 226, 180, 255);

    const start = pathManager.waypoints[0];
    graphics.moveTo(start.x, start.y);
    for (const point of pathManager.waypoints.slice(1)) {
      graphics.lineTo(point.x, point.y);
    }
    graphics.stroke();

    this.drawMapDecoration(mapLayer, new Vec3(-430, 190, 0), 72);
    this.drawMapDecoration(mapLayer, new Vec3(420, 190, 0), 72);
    this.drawMapDecoration(mapLayer, new Vec3(-420, -170, 0), 72);
    this.drawMapDecoration(mapLayer, new Vec3(410, -170, 0), 72);
    for (const obstacle of ConfigService.getLevelConfig(levelId).obstacles) {
      const obstacleNode = this.createNode("MapObstacle", mapLayer, obstacle.position);
      const obstacleGraphics = obstacleNode.addComponent(Graphics);
      obstacleGraphics.fillColor = new Color(57, 151, 116, 255);
      obstacleGraphics.circle(0, 0, obstacle.radius);
      obstacleGraphics.fill();
      obstacleGraphics.fillColor = new Color(110, 222, 167, 180);
      obstacleGraphics.circle(6, 6, obstacle.radius * 0.56);
      obstacleGraphics.fill();
      this.createText("ObstacleIcon", obstacleNode, obstacle.icon, new Vec3(0, 0, 0), 24, 34, 28);
    }
    return background;
  }

  private createEnemyTemplate(): Node {
    const node = this.createNode("EnemyTemplate");
    this.ensureSize(node, 48, 48);
    const view = node.addComponent(EnemyView);
    const enemy = node.addComponent(Enemy);
    enemy.enemyView = view;

    view.normalVisual = this.createText("NormalVisual", node, "🐰", new Vec3(0, 0, 0), 28, 40, 34).node;
    view.fastVisual = this.createText("FastVisual", node, "🐹", new Vec3(0, 0, 0), 28, 40, 34).node;
    view.heavyVisual = this.createText("HeavyVisual", node, "🐻", new Vec3(0, 0, 0), 28, 40, 34).node;
    view.shieldVisual = this.createText("ShieldVisual", node, "🐢", new Vec3(0, 0, 0), 28, 40, 34).node;
    view.splitVisual = this.createText("SplitVisual", node, "🐭", new Vec3(0, 0, 0), 28, 40, 34).node;
    view.healerVisual = this.createText("HealerVisual", node, "🦉", new Vec3(0, 0, 0), 28, 40, 34).node;
    view.bossVisual = this.createText("BossVisual", node, "🐲", new Vec3(0, 0, 0), 30, 44, 36).node;
    view.hpBarFill = this.createText("HpBarFill", node, "▁▁▁▁", new Vec3(0, -26, 0), 16, 48, 18, new Color(255, 133, 133, 255)).node;
    view.applyEnemyType("normal");
    return node;
  }

  private createTowerTemplate(): Node {
    const node = this.createNode("TowerTemplate");
    this.ensureSize(node, 64, 64);
    const view = node.addComponent(TowerView);
    const tower = node.addComponent(Tower);
    tower.towerView = view;

    view.selectionRing = this.createText("SelectionRing", node, "✨", new Vec3(0, 24, 0), 24, 34, 26, new Color(255, 225, 120, 255)).node;
    view.rangeIndicator = this.createText("RangeIndicator", node, "◌", new Vec3(0, 0, 0), 30, 36, 32, new Color(255, 255, 255, 130)).node;
    view.rapidVisual = this.createText("RapidVisual", node, "🏹", new Vec3(0, 0, 0), 24, 36, 30).node;
    view.cannonVisual = this.createText("CannonVisual", node, "💥", new Vec3(0, 0, 0), 24, 36, 30).node;
    view.frostVisual = this.createText("FrostVisual", node, "❄", new Vec3(0, 0, 0), 24, 36, 30, new Color(216, 251, 255, 255)).node;
    view.burstVisual = this.createText("BurstVisual", node, "⚡", new Vec3(0, 0, 0), 24, 36, 30, new Color(255, 245, 180, 255)).node;
    view.sniperVisual = this.createText("SniperVisual", node, "🎯", new Vec3(0, 0, 0), 24, 36, 30).node;
    view.mortarVisual = this.createText("MortarVisual", node, "☄", new Vec3(0, 0, 0), 24, 36, 30, new Color(255, 218, 152, 255)).node;
    view.upgradeMarker = this.createText("UpgradeMarker", node, "⬆", new Vec3(0, 24, 0), 20, 28, 22, new Color(255, 239, 148, 255)).node;
    view.setSelected(false);
    view.setUpgradeReady(false);
    return node;
  }

  private createBulletTemplate(): Node {
    const node = this.createNode("BulletTemplate");
    this.ensureSize(node, 18, 18);
    const view = node.addComponent(BulletView);
    const bullet = node.addComponent(Bullet);
    bullet.bulletView = view;
    view.rapidVisual = this.createText("RapidVisual", node, "•", new Vec3(0, 0, 0), 20, 20, 20, new Color(255, 255, 255, 255)).node;
    view.cannonVisual = this.createText("CannonVisual", node, "✦", new Vec3(0, 0, 0), 22, 22, 22, new Color(255, 201, 120, 255)).node;
    view.frostVisual = this.createText("FrostVisual", node, "❄", new Vec3(0, 0, 0), 18, 20, 20, new Color(225, 251, 255, 255)).node;
    view.burstVisual = this.createText("BurstVisual", node, "✧", new Vec3(0, 0, 0), 20, 20, 20, new Color(255, 241, 176, 255)).node;
    view.sniperVisual = this.createText("SniperVisual", node, "◆", new Vec3(0, 0, 0), 18, 20, 20, new Color(255, 255, 255, 255)).node;
    view.mortarVisual = this.createText("MortarVisual", node, "✹", new Vec3(0, 0, 0), 20, 20, 20, new Color(255, 210, 145, 255)).node;
    return node;
  }

  private createHitEffectTemplate(): Node {
    const node = this.createNode("HitEffectTemplate");
    const effect = node.addComponent(HitEffect);
    effect.coreVisual = this.createText("CoreVisual", node, "✦", new Vec3(0, 0, 0), 26, 28, 28, new Color(255, 230, 122, 255)).node;
    return node;
  }

  private createActionButton(
    name: string,
    parent: Node,
    text: string,
    position: Vec3,
    width: number,
    height: number,
    fillColor: Color,
    textColor: Color,
    strokeColor = new Color(255, 255, 255, 46)
  ): { node: Node; button: Button; label: Label } {
    const node = this.createPanel(name, parent, position, width, height, fillColor, strokeColor);
    const button = node.addComponent(Button);
    const label = this.createText(`${name}Label`, node, text, new Vec3(0, 0, 0), 20, width - 12, 24, textColor);
    return { node, button, label };
  }

  private createBadgeLabel(
    name: string,
    parent: Node,
    text: string,
    position: Vec3,
    width: number,
    fillColor = new Color(255, 255, 255, 210),
    strokeColor = new Color(55, 126, 105, 110),
    textColor = new Color(62, 78, 80, 255)
  ): Label {
    this.createPanel(`${name}Panel`, parent, position, width, 36, fillColor, strokeColor);
    return this.createText(name, parent, text, position, 17, width - 12, 20, textColor);
  }

  private resolveTowerButtonStyle(towerType: TowerTypeId): {
    icon: string;
    fill: Color;
    text: Color;
    stroke: Color;
  } {
    switch (towerType) {
      case "rapid":
        return { icon: "速", fill: new Color(114, 206, 255, 255), text: new Color(255, 255, 255, 255), stroke: new Color(88, 157, 193, 160) };
      case "cannon":
        return { icon: "炮", fill: new Color(255, 179, 96, 255), text: new Color(255, 255, 255, 255), stroke: new Color(197, 125, 64, 160) };
      case "frost":
        return { icon: "冰", fill: new Color(128, 227, 202, 255), text: new Color(255, 255, 255, 255), stroke: new Color(88, 173, 151, 160) };
      case "burst":
        return { icon: "连", fill: new Color(255, 208, 104, 255), text: new Color(255, 255, 255, 255), stroke: new Color(189, 149, 74, 160) };
      case "sniper":
        return { icon: "狙", fill: new Color(184, 142, 255, 255), text: new Color(255, 255, 255, 255), stroke: new Color(134, 101, 204, 160) };
      case "mortar":
        return { icon: "迫", fill: new Color(255, 146, 125, 255), text: new Color(255, 255, 255, 255), stroke: new Color(198, 101, 82, 160) };
      default:
        return { icon: "塔", fill: new Color(210, 198, 171, 255), text: new Color(114, 91, 54, 255), stroke: new Color(168, 146, 111, 150) };
    }
  }

  private bindButton(node: Node, button: Button, onTap: () => void): void {
    node.on(Node.EventType.TOUCH_END, () => {
      if (!button.interactable) {
        return;
      }
      onTap();
    });
  }

  private createText(
    name: string,
    parent: Node,
    text: string,
    position: Vec3,
    fontSize = 20,
    width = 220,
    height = 30,
    color = new Color(230, 235, 245, 255),
    horizontalAlign = 1
  ): Label {
    const node = this.createNode(name, parent, position);
    this.ensureSize(node, width, height);
    const label = node.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.lineHeight = fontSize + 6;
    label.color = color;
    label.horizontalAlign = horizontalAlign;
    return label;
  }

  private createPanel(
    name: string,
    parent: Node,
    position: Vec3,
    width: number,
    height: number,
    fillColor: Color,
    strokeColor: Color
  ): Node {
    const node = this.createNode(name, parent, position);
    this.ensureSize(node, width, height);
    const graphics = node.addComponent(Graphics);
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    graphics.fillColor = fillColor;
    graphics.roundRect(-halfWidth, -halfHeight, width, height, 24);
    graphics.fill();
    graphics.lineWidth = 2;
    graphics.strokeColor = strokeColor;
    graphics.roundRect(-halfWidth, -halfHeight, width, height, 24);
    graphics.stroke();
    return node;
  }

  private drawMapDecoration(parent: Node, position: Vec3, radius: number): void {
    const node = this.createNode("MapDecoration", parent, position);
    const graphics = node.addComponent(Graphics);
    graphics.fillColor = new Color(46, 151, 123, 255);
    graphics.circle(0, 0, radius);
    graphics.fill();
    graphics.fillColor = new Color(92, 208, 171, 220);
    graphics.circle(16, 10, radius * 0.55);
    graphics.fill();
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
