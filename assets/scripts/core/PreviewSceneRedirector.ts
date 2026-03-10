import { Director, director, game, Game, Layers, Node, UITransform } from "cc";
import { SCENE_NAMES } from "./SceneNames";

const FALLBACK_SCENE_NAMES = new Set(["", "default", "scene-2d", "scene-quality"]);
const RUNTIME_BOOTSTRAP_BY_SCENE = {
  [SCENE_NAMES.home]: {
    classId: "a1111ERERFBEYERERERERER",
    nodeName: "RuntimeHome",
  },
  [SCENE_NAMES.battle]: {
    classId: "b2222IiIiJCIoIiIiIiIiIi",
    nodeName: "RuntimeBattle",
  },
  [SCENE_NAMES.result]: {
    classId: "c3333MzMzNDM4MzMzMzMzMz",
    nodeName: "RuntimeResult",
  },
} as const;

let hasRegisteredPreviewRedirect = false;
let hasRedirectedFromFallbackScene = false;

function shouldRedirectCurrentScene(): boolean {
  const currentSceneName = director.getScene()?.name ?? "";
  if (!FALLBACK_SCENE_NAMES.has(currentSceneName)) {
    return false;
  }

  return currentSceneName !== SCENE_NAMES.home;
}

function redirectToHomeScene(): void {
  if (hasRedirectedFromFallbackScene || !shouldRedirectCurrentScene()) {
    return;
  }

  hasRedirectedFromFallbackScene = true;
  director.loadScene(SCENE_NAMES.home);
}

function ensureRuntimeBootstrapForScene(): void {
  const scene = director.getScene() as Node | null;
  if (!scene) {
    return;
  }

  const runtimeConfig = RUNTIME_BOOTSTRAP_BY_SCENE[scene.name as keyof typeof RUNTIME_BOOTSTRAP_BY_SCENE];
  if (!runtimeConfig) {
    return;
  }

  const canvas = scene.getChildByName("Canvas");
  if (!canvas) {
    return;
  }

  const ccGlobal = (globalThis as { cc?: { js?: { getClassById?: (classId: string) => (new () => unknown) | null } } }).cc;
  const componentCtor = ccGlobal?.js?.getClassById?.(runtimeConfig.classId);
  if (!componentCtor) {
    console.warn(`[PreviewSceneRedirector] Missing bootstrap class ${runtimeConfig.classId} for ${scene.name}`);
    return;
  }

  let runtimeNode = canvas.getChildByName(runtimeConfig.nodeName);
  if (!runtimeNode) {
    runtimeNode = new Node(runtimeConfig.nodeName);
    runtimeNode.layer = Layers.Enum.UI_2D;
    runtimeNode.addComponent(UITransform);
    canvas.addChild(runtimeNode);
  }

  if (!runtimeNode.getComponent(componentCtor)) {
    runtimeNode.addComponent(componentCtor);
  }
}

function registerPreviewSceneRedirect(): void {
  if (hasRegisteredPreviewRedirect) {
    return;
  }

  hasRegisteredPreviewRedirect = true;

  (director as unknown as { on(eventName: string, callback: () => void): void }).on(Director.EVENT_AFTER_SCENE_LAUNCH, () => {
    if (shouldRedirectCurrentScene()) {
      redirectToHomeScene();
      return;
    }

    ensureRuntimeBootstrapForScene();
  });

  game.once(Game.EVENT_GAME_INITED, () => {
    setTimeout(() => {
      if (shouldRedirectCurrentScene()) {
        redirectToHomeScene();
        return;
      }

      ensureRuntimeBootstrapForScene();
    }, 0);
  });
}

registerPreviewSceneRedirect();
