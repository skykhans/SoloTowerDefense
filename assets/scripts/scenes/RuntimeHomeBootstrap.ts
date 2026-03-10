import { _decorator, Button, Canvas, Color, Component, Graphics, Label, Layers, Node, UITransform, Vec3 } from "cc";
import { ConfigService } from "../config/ConfigService";
import { LocalStorageService } from "../core/LocalStorageService";
import { SceneNavigator } from "../core/SceneNavigator";
import { SCENE_NAMES } from "../core/SceneNames";

const { ccclass } = _decorator;

@ccclass("RuntimeHomeBootstrap")
export class RuntimeHomeBootstrap extends Component {
  onLoad(): void {
    const canvas = this.node.parent?.getComponent(Canvas);
    if (!canvas || this.node.getChildByName("HomeRoot")) {
      return;
    }

    const save = LocalStorageService.loadPlayerSave();
    const levels = ConfigService.getAllLevelConfigs().sort((a, b) => a.id - b.id);
    const selectedLevel = levels.find((level) => level.id === save.selectedLevel) ?? levels[0];
    const currentIndex = levels.findIndex((level) => level.id === selectedLevel.id);
    const nextLevel = levels[currentIndex + 1] ?? null;
    const nextUnlocked = !!nextLevel && save.unlockedLevels.includes(nextLevel.id);

    const root = this.createNode("HomeRoot", this.node);
    root.layer = Layers.Enum.UI_2D;

    this.drawBackdrop(root, new Color(6, 16, 37, 255), new Color(18, 44, 83, 255), new Color(244, 178, 60, 100));
    this.createGlow(root, "TopGlow", new Vec3(-260, 220, 0), 360, new Color(77, 168, 255, 48));
    this.createGlow(root, "BottomGlow", new Vec3(250, -200, 0), 320, new Color(255, 170, 83, 40));

    const heroCard = this.createPanel("HeroCard", root, new Vec3(0, 58, 0), 680, 332, new Color(12, 25, 52, 230), new Color(43, 91, 160, 180));
    this.createText("Eyebrow", heroCard, "SOLO TOWER DEFENSE", new Vec3(0, 118, 0), 18, 420, 26, new Color(255, 202, 108, 255));
    this.createText("Title", heroCard, "守住边境防线", new Vec3(0, 72, 0), 44, 540, 54, new Color(244, 248, 255, 255));
    this.createText("SubTitle", heroCard, "轻量塔防原型，先把完整一局打通，再逐步换正式资源。", new Vec3(0, 30, 0), 20, 540, 30, new Color(178, 198, 232, 255));

    this.createBadgeRow(
      heroCard,
      [
        { title: "当前关卡", value: `第 ${selectedLevel.id} 关` },
        { title: "关卡名", value: selectedLevel.name },
        { title: "已解锁", value: `${save.unlockedLevels.length} 关` },
      ],
      new Vec3(0, -28, 0),
      158,
      72
    );
    this.createMetricRow(
      heroCard,
      [
        { title: "最佳波次", value: `${save.bestWave}` },
        { title: "持有金币", value: `${save.coins}` },
        { title: "目标波次", value: `${selectedLevel.targetWave}` },
        { title: "首通奖励", value: `${selectedLevel.firstClearCoinReward}` },
      ],
      new Vec3(0, -106, 0),
      132,
      72
    );

    const actionCard = this.createPanel(
      "ActionCard",
      root,
      new Vec3(0, -126, 0),
      680,
      92,
      new Color(10, 21, 41, 220),
      new Color(57, 105, 172, 135)
    );
    this.createText("ActionLabel", actionCard, "选择当前关卡后直接进入战斗，或推进到下一关。", new Vec3(0, 22, 0), 18, 520, 24, new Color(171, 193, 229, 255));
    const start = this.createButton(actionCard, "StartButton", "进入战斗", new Vec3(-100, -16, 0), 188, 50, new Color(255, 187, 74, 255), new Color(26, 32, 44, 255));
    const next = this.createButton(
      actionCard,
      "NextLevelButton",
      nextUnlocked ? "切换到下一关" : "下一关未解锁",
      new Vec3(116, -16, 0),
      212,
      50,
      nextUnlocked ? new Color(56, 96, 178, 255) : new Color(70, 82, 108, 255),
      new Color(240, 245, 255, 255)
    );

    const ruleCard = this.createPanel(
      "RuleCard",
      root,
      new Vec3(0, -244, 0),
      680,
      116,
      new Color(11, 20, 40, 212),
      new Color(58, 96, 145, 120)
    );
    this.createText("RuleTitle", ruleCard, "本局说明", new Vec3(-276, 30, 0), 22, 120, 28, new Color(255, 203, 111, 255), 0);
    this.createText(
      "RuleBody",
      ruleCard,
      `起始耐久 ${selectedLevel.startingLives}，起始金币 ${selectedLevel.startingGold}，从第 ${selectedLevel.waveStart} 波开始。\n敌人抵达终点会扣除耐久，耐久归零即失败；守住全部波次则通关。`,
      new Vec3(22, -2, 0),
      19,
      560,
      56,
      new Color(190, 205, 232, 255),
      0
    );

    start.node.on(Node.EventType.TOUCH_END, () => {
      if (!start.button.interactable) return;
      SceneNavigator.goTo(SCENE_NAMES.battle);
    });

    next.node.on(Node.EventType.TOUCH_END, () => {
      if (!next.button.interactable || !nextLevel) return;
      LocalStorageService.updatePlayerSave((playerSave) => ({
        ...playerSave,
        selectedLevel: nextLevel.id,
      }));
      SceneNavigator.goTo(SCENE_NAMES.home);
    });

    next.button.interactable = nextUnlocked;
    if (!nextUnlocked) {
      next.label.color = new Color(176, 187, 204, 255);
    }
  }

  private drawBackdrop(parent: Node, topColor: Color, bottomColor: Color, accentColor: Color): void {
    const background = this.createNode("Background", parent);
    const graphics = background.addComponent(Graphics);
    graphics.fillColor = topColor;
    graphics.rect(-480, -320, 960, 640);
    graphics.fill();

    graphics.fillColor = bottomColor;
    graphics.circle(260, 280, 300);
    graphics.fill();

    graphics.fillColor = accentColor;
    graphics.moveTo(-480, -140);
    graphics.lineTo(-140, -320);
    graphics.lineTo(140, -320);
    graphics.lineTo(-180, -30);
    graphics.close();
    graphics.fill();
  }

  private createGlow(parent: Node, name: string, position: Vec3, radius: number, color: Color): void {
    const node = this.createNode(name, parent, position);
    const graphics = node.addComponent(Graphics);
    graphics.fillColor = color;
    graphics.circle(0, 0, radius);
    graphics.fill();
  }

  private createBadgeRow(
    parent: Node,
    items: Array<{ title: string; value: string }>,
    position: Vec3,
    width = 168,
    height = 78
  ): void {
    const row = this.createNode("BadgeRow", parent, position);
    const startX = -200;
    const gap = 200;
    items.forEach((item, index) => {
      const badge = this.createPanel(
        `Badge${index}`,
        row,
        new Vec3(startX + index * gap, 0, 0),
        width,
        height,
        new Color(18, 36, 68, 255),
        new Color(64, 123, 201, 150)
      );
      this.createText(`BadgeTitle${index}`, badge, item.title, new Vec3(0, 14, 0), 15, width - 28, 20, new Color(153, 181, 230, 255));
      this.createText(`BadgeValue${index}`, badge, item.value, new Vec3(0, -12, 0), 22, width - 20, 26, new Color(245, 248, 255, 255));
    });
  }

  private createMetricRow(
    parent: Node,
    items: Array<{ title: string; value: string }>,
    position: Vec3,
    width = 132,
    height = 72
  ): void {
    const row = this.createNode("MetricRow", parent, position);
    const startX = -220;
    const gap = 146;
    items.forEach((item, index) => {
      const panel = this.createPanel(
        `Metric${index}`,
        row,
        new Vec3(startX + index * gap, 0, 0),
        width,
        height,
        new Color(15, 30, 58, 255),
        new Color(59, 108, 176, 130)
      );
      this.createText(`MetricTitle${index}`, panel, item.title, new Vec3(0, 14, 0), 14, width - 18, 18, new Color(156, 180, 221, 255));
      this.createText(`MetricValue${index}`, panel, item.value, new Vec3(0, -12, 0), 24, width - 18, 26, new Color(245, 248, 255, 255));
    });
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
    graphics.roundRect(-halfWidth, -halfHeight, width, height, 26);
    graphics.fill();
    graphics.lineWidth = 2;
    graphics.strokeColor = strokeColor;
    graphics.roundRect(-halfWidth, -halfHeight, width, height, 26);
    graphics.stroke();
    return node;
  }

  private createButton(
    parent: Node,
    name: string,
    text: string,
    position: Vec3,
    width: number,
    height: number,
    fillColor: Color,
    textColor: Color
  ): { node: Node; button: Button; label: Label } {
    const node = this.createPanel(name, parent, position, width, height, fillColor, new Color(255, 255, 255, 42));
    const button = node.addComponent(Button);
    const label = this.createText(`${name}Label`, node, text, new Vec3(0, 0, 0), 24, width - 16, 30, textColor);
    return { node, button, label };
  }

  private createText(
    name: string,
    parent: Node,
    text: string,
    position: Vec3,
    fontSize = 20,
    width = 240,
    height = 30,
    color = new Color(240, 245, 255, 255),
    horizontalAlign = 1
  ): Label {
    const node = this.createNode(name, parent, position);
    this.ensureSize(node, width, height);
    const label = node.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.lineHeight = fontSize + 8;
    label.color = color;
    label.horizontalAlign = horizontalAlign;
    return label;
  }

  private createNode(name: string, parent?: Node | null, position: Vec3 = new Vec3()): Node {
    const node = new Node(name);
    if (parent) {
      parent.addChild(node);
    }
    node.setPosition(position);
    node.addComponent(UITransform);
    return node;
  }

  private ensureSize(node: Node, width: number, height: number): void {
    const transform = node.getComponent(UITransform) ?? node.addComponent(UITransform);
    transform.setContentSize(width, height);
  }
}
