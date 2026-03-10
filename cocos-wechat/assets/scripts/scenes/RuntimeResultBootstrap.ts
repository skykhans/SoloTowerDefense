import { _decorator, Button, Canvas, Color, Component, Label, Layers, Node, UITransform, Vec3 } from "cc";
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
    const root = this.createNode("ResultRoot", this.node);
    root.layer = Layers.Enum.UI_2D;

    this.createText("Title", root, result?.result === "victory" ? "胜利" : "失败", new Vec3(0, 160, 0), 40);
    this.createText(
      "Summary",
      root,
      result
        ? `第 ${result.levelId} 关\n到达波次 ${result.reachedWave}\n击杀 ${result.kills}\n获得金币 ${result.awardedCoins}`
        : "暂无结算数据",
      new Vec3(0, 48, 0),
      26,
      420,
      140
    );

    const retry = this.createButton(root, "RetryButton", "再来一局", new Vec3(-90, -92, 0));
    const home = this.createButton(root, "BackHomeButton", "返回首页", new Vec3(90, -92, 0));

    retry.node.on(Node.EventType.TOUCH_END, () => {
      if (!retry.button.interactable) return;
      SceneNavigator.goTo(SCENE_NAMES.battle);
    });

    home.node.on(Node.EventType.TOUCH_END, () => {
      if (!home.button.interactable) return;
      SceneNavigator.goTo(SCENE_NAMES.home);
    });
  }

  private createButton(parent: Node, name: string, text: string, position: Vec3): { node: Node; button: Button; label: Label } {
    const node = this.createNode(name, parent, position);
    this.ensureSize(node, 160, 48);
    const button = node.addComponent(Button);
    const label = this.createText(`${name}Label`, node, text, new Vec3(0, 0, 0), 22, 140, 40);
    return { node, button, label };
  }

  private createText(name: string, parent: Node, text: string, position: Vec3, fontSize = 20, width = 240, height = 30): Label {
    const node = this.createNode(name, parent, position);
    this.ensureSize(node, width, height);
    const label = node.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.lineHeight = fontSize + 6;
    label.color = new Color(240, 245, 255, 255);
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
