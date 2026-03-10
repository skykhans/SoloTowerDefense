import { Node } from "cc";

export class SceneStructureValidator {
  public static requireRootName(owner: string, node: Node, expectedName: string): void {
    if (node.name !== expectedName) {
      throw new Error(`[${owner}] 根节点名称不正确，期望 ${expectedName}，实际 ${node.name}`);
    }
  }

  public static requireDescendant(owner: string, root: Node, nodeName: string): Node {
    const node = this.findDescendant(root, nodeName);
    if (!node) {
      throw new Error(`[${owner}] 缺少结构节点：${nodeName}`);
    }

    return node;
  }

  public static validateRequiredNodeNames(owner: string, root: Node, nodeNames: string[]): void {
    for (const nodeName of nodeNames) {
      this.requireDescendant(owner, root, nodeName);
    }
  }

  public static findDescendant(root: Node, nodeName: string): Node | null {
    if (root.name === nodeName) {
      return root;
    }

    for (const child of root.children) {
      const match = this.findDescendant(child, nodeName);
      if (match) {
        return match;
      }
    }

    return null;
  }
}
