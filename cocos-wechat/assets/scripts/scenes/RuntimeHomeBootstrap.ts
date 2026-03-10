import { _decorator, Button, Canvas, Color, Component, Label, Layers, Node, UITransform, Vec3 } from "cc";
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

    const root = this.createNode("HomeRoot", this.node);
    root.layer = Layers.Enum.UI_2D;
    this.createText("Title", root, "SoloTowerDefense", new Vec3(0, 180, 0), 40);
    this.createText("SubTitle", root, "Cocos 微信小游戏运行时原型", new Vec3(0, 132, 0), 24);
    this.createText(
      "Summary",
      root,
      `当前关卡 第 ${selectedLevel.id} 关 ${selectedLevel.name}\n最佳波次 ${save.bestWave} | 金币 ${save.coins} | 已解锁 ${save.unlockedLevels.length} 关`,
      new Vec3(0, 42, 0),
      24,
      500,
      80
    );

    const start = this.createButton(root, "StartButton", "进入战斗", new Vec3(0, -52, 0));
    const next = this.createButton(root, "NextLevelButton", "切换到下一关", new Vec3(0, -118, 0));
    const hint = this.createText("Hint", root, "后续会逐步替换成正式 HomeScene 与 HomeUI。", new Vec3(0, -200, 0), 18, 520, 40);
    hint.color = new Color(180, 190, 210, 255);

    start.node.on(Node.EventType.TOUCH_END, () => {
      if (!start.button.interactable) return;
      SceneNavigator.goTo(SCENE_NAMES.battle);
    });

    next.node.on(Node.EventType.TOUCH_END, () => {
      if (!next.button.interactable) return;
      const currentIndex = levels.findIndex((level) => level.id === selectedLevel.id);
      const target = levels[currentIndex + 1];
      if (!target || !save.unlockedLevels.includes(target.id)) {
        return;
      }
      LocalStorageService.updatePlayerSave((playerSave) => ({
        ...playerSave,
        selectedLevel: target.id,
      }));
      SceneNavigator.goTo(SCENE_NAMES.home);
    });

    next.button.interactable = (() => {
      const currentIndex = levels.findIndex((level) => level.id === selectedLevel.id);
      const target = levels[currentIndex + 1];
      return !!target && save.unlockedLevels.includes(target.id);
    })();
  }

  private createButton(parent: Node, name: string, text: string, position: Vec3): { node: Node; button: Button; label: Label } {
    const node = this.createNode(name, parent, position);
    this.ensureSize(node, 220, 48);
    const button = node.addComponent(Button);
    const label = this.createText(`${name}Label`, node, text, new Vec3(0, 0, 0), 24, 200, 40);
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
