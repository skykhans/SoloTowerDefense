import { _decorator, Button, Canvas, Color, Component, Graphics, Label, Layers, Node, UITransform, Vec3 } from "cc";
import { BattleResultSession } from "../core/BattleResultSession";
import { SceneNavigator } from "../core/SceneNavigator";
import { SCENE_NAMES } from "../core/SceneNames";

const { ccclass } = _decorator;

@ccclass("RuntimeResultBootstrap")
export class RuntimeResultBootstrap extends Component {
  onLoad(): void {
    const canvas = this.node.parent?.getComponent(Canvas);
    if (!canvas || this.node.getChildByName("ResultRoot")) {
      return;
    }

    const result = BattleResultSession.consumeResult();
    const isVictory = result?.result === "victory";
    const root = this.createNode("ResultRoot", this.node);
    root.layer = Layers.Enum.UI_2D;

    this.drawBackdrop(root, isVictory);

    const card = this.createPanel(
      "ResultCard",
      root,
      new Vec3(0, 32, 0),
      560,
      430,
      new Color(12, 24, 48, 228),
      isVictory ? new Color(255, 188, 79, 190) : new Color(106, 145, 209, 160)
    );

    this.createText("Kicker", card, isVictory ? "MISSION CLEAR" : "REDEPLOY", new Vec3(0, 146, 0), 18, 240, 24, new Color(255, 205, 111, 255));
    this.createText("Title", card, isVictory ? "胜利" : "防线失守", new Vec3(0, 96, 0), 54, 260, 64, new Color(245, 248, 255, 255));

    if (result) {
      this.createMetricRow(
        card,
        [
          { title: "关卡", value: `第 ${result.levelId} 关` },
          { title: "波次", value: `${result.reachedWave}` },
          { title: "击杀", value: `${result.kills}` },
        ],
        new Vec3(0, 20, 0)
      );

      this.createText(
        "Summary",
        card,
        isVictory
          ? `获得金币 ${result.awardedCoins}    星级 ${result.stars}\n${result.unlockedLevelId ? `已解锁第 ${result.unlockedLevelId} 关` : "下一关已在此前解锁"}`
          : `到达波次 ${result.reachedWave}\n基地耐久已归零，本局未获得额外奖励。`,
        new Vec3(0, -72, 0),
        24,
        420,
        74,
        new Color(219, 228, 243, 255)
      );
    } else {
      this.createText("Summary", card, "暂无结算数据", new Vec3(0, -20, 0), 26, 360, 32, new Color(219, 228, 243, 255));
    }

    const retry = this.createButton(
      card,
      "RetryButton",
      "再来一局",
      new Vec3(-108, -154, 0),
      188,
      56,
      new Color(255, 188, 79, 255),
      new Color(26, 32, 44, 255)
    );
    const home = this.createButton(
      card,
      "BackHomeButton",
      "返回首页",
      new Vec3(108, -154, 0),
      188,
      56,
      new Color(45, 87, 168, 255),
      new Color(243, 247, 255, 255)
    );

    retry.node.on(Node.EventType.TOUCH_END, () => {
      if (!retry.button.interactable) return;
      SceneNavigator.goTo(SCENE_NAMES.battle);
    });

    home.node.on(Node.EventType.TOUCH_END, () => {
      if (!home.button.interactable) return;
      SceneNavigator.goTo(SCENE_NAMES.home);
    });
  }

  private drawBackdrop(parent: Node, isVictory: boolean): void {
    const background = this.createNode("Background", parent);
    const graphics = background.addComponent(Graphics);
    graphics.fillColor = new Color(5, 14, 31, 255);
    graphics.rect(-480, -320, 960, 640);
    graphics.fill();

    graphics.fillColor = isVictory ? new Color(245, 182, 67, 42) : new Color(88, 144, 225, 42);
    graphics.circle(-200, 220, 260);
    graphics.fill();

    graphics.fillColor = isVictory ? new Color(255, 205, 111, 34) : new Color(61, 103, 164, 34);
    graphics.circle(260, -160, 220);
    graphics.fill();
  }

  private createMetricRow(parent: Node, items: Array<{ title: string; value: string }>, position: Vec3): void {
    const row = this.createNode("MetricRow", parent, position);
    const startX = -170;
    const gap = 170;
    items.forEach((item, index) => {
      const panel = this.createPanel(
        `Metric${index}`,
        row,
        new Vec3(startX + index * gap, 0, 0),
        150,
        86,
        new Color(19, 37, 71, 255),
        new Color(91, 138, 214, 130)
      );
      this.createText(`MetricTitle${index}`, panel, item.title, new Vec3(0, 18, 0), 18, 120, 24, new Color(158, 181, 220, 255));
      this.createText(`MetricValue${index}`, panel, item.value, new Vec3(0, -16, 0), 28, 120, 30, new Color(244, 248, 255, 255));
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
    const label = this.createText(`${name}Label`, node, text, new Vec3(0, 0, 0), 24, width - 18, 30, textColor);
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
    color = new Color(240, 245, 255, 255)
  ): Label {
    const node = this.createNode(name, parent, position);
    this.ensureSize(node, width, height);
    const label = node.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.lineHeight = fontSize + 8;
    label.color = color;
    label.horizontalAlign = 1;
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
