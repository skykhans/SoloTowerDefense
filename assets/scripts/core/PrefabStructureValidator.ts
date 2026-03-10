import { Node } from "cc";

export class PrefabStructureValidator {
  public static requireRootName(owner: string, node: Node, expectedName: string): void {
    if (node.name !== expectedName) {
      throw new Error(`[${owner}] 预制体根节点名称不正确，期望 ${expectedName}，实际 ${node.name}`);
    }
  }

  public static validateRequiredNodeNames(owner: string, root: Node, nodeNames: string[]): void {
    for (const nodeName of nodeNames) {
      if (!this.findDescendant(root, nodeName)) {
        throw new Error(`[${owner}] 预制体缺少结构节点：${nodeName}`);
      }
    }
  }

  private static findDescendant(root: Node, nodeName: string): Node | null {
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
