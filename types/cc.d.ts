declare module "cc" {
  export class Vec3 {
    public x: number;
    public y: number;
    public z: number;
    constructor(x?: number, y?: number, z?: number);
    public clone(): Vec3;
    public length(): number;
    public normalize(): Vec3;
    public static distance(a: Vec3, b: Vec3): number;
  }

  export class Node {
    public static EventType: {
      TOUCH_END: string;
    };

    public name: string;
    public active: boolean;
    public layer: number;
    public parent: Node | null;
    public position: Vec3;
    public scale: Vec3;
    [key: string]: any;

    constructor(name?: string);
    public addChild(child: Node): void;
    public addComponent<T>(type: new () => T): T;
    public getChildByName(name: string): Node | null;
    public getComponent<T>(type: new () => T): T | null;
    public setPosition(position: Vec3 | number, y?: number, z?: number): void;
    public getPosition(): Vec3;
    public setScale(scale: Vec3 | number, y?: number, z?: number): void;
    public setAnchorPoint?(point: Vec3): void;
    public on(type: string, callback: (...args: any[]) => void, target?: unknown): void;
    public off(type: string, callback?: (...args: any[]) => void, target?: unknown): void;
    public destroy(): void;
  }

  export class Component {
    public node: Node;
    [key: string]: any;
    public getComponent<T>(type: new () => T): T | null;
  }

  export class UITransform extends Component {
    public setContentSize(width: number, height: number): void;
  }

  export class Sprite extends Component {
    public color: Color;
  }

  export class Label extends Component {
    public string: string;
    public fontSize: number;
    public lineHeight: number;
    public color: Color;
    public horizontalAlign: number;
  }

  export class Button extends Component {
    public interactable: boolean;
  }

  export class Layout extends Component {
    public type: number;
    public resizeMode: number;
    public spacingX: number;
    public spacingY: number;
    public paddingLeft: number;
    public paddingRight: number;
    public paddingTop: number;
    public paddingBottom: number;
    public updateLayout(): void;
  }

  export namespace Layout {
    type Type = number;
    type ResizeMode = number;
    const Type: {
      HORIZONTAL: number;
      VERTICAL: number;
    };
    const ResizeMode: {
      CONTAINER: number;
    };
  }

  export class Widget extends Component {
    public top: number;
    public bottom: number;
    public left: number;
    public right: number;
    public updateAlignment(): void;
  }

  export class Canvas extends Component {}

  export class Color {
    public static WHITE: Color;
    constructor(r?: number, g?: number, b?: number, a?: number);
  }

  export class Graphics extends Component {
    public fillColor: Color;
    public strokeColor: Color;
    public lineWidth: number;
    public rect(x: number, y: number, w: number, h: number): void;
    public fill(): void;
    public moveTo(x: number, y: number): void;
    public lineTo(x: number, y: number): void;
    public stroke(): void;
  }

  export class EventTouch {}

  export class Scene {
    public name: string;
  }

  export class Director {
    public static EVENT_AFTER_SCENE_LAUNCH: string;
  }

  export class Game {
    public static EVENT_GAME_INITED: string;
  }

  export const Layers: {
    Enum: {
      UI_2D: number;
    };
  };

  export const director: {
    loadScene(sceneName: string): void;
    getScene(): Scene | null;
    once(eventName: string, callback: (...args: any[]) => void, target?: unknown): void;
  };

  export const game: {
    once(eventName: string, callback: (...args: any[]) => void, target?: unknown): void;
  };

  export const view: {
    on(eventName: string, callback: (...args: any[]) => void, target?: unknown): void;
    off(eventName: string, callback?: (...args: any[]) => void, target?: unknown): void;
    getVisibleSize(): {
      width: number;
      height: number;
    };
  };

  export function instantiate<T>(original: T): T;

  export function tween(target: unknown): {
    to(duration: number, props: Record<string, unknown>): ReturnType<typeof tween>;
    call(callback: () => void): ReturnType<typeof tween>;
    start(): void;
  };

  export const _decorator: {
    ccclass(name?: string): ClassDecorator;
    property(...args: any[]): any;
  };
}
