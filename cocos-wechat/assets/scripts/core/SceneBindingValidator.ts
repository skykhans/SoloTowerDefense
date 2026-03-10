import { Component, Node } from "cc";

type NullableBinding = Component | Node | null;

export class SceneBindingValidator {
  public static requireComponent<T extends NullableBinding>(owner: string, label: string, value: T): T {
    if (!value) {
      throw new Error(`[${owner}] 缺少必要绑定：${label}`);
    }

    return value;
  }

  public static requireNode(owner: string, label: string, value: Node | null): Node {
    if (!value) {
      throw new Error(`[${owner}] 缺少必要节点：${label}`);
    }

    return value;
  }
}
