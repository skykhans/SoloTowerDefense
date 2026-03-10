import { director } from "cc";
import type { SceneName } from "./SceneNames";

export class SceneNavigator {
  public static goTo(sceneName: SceneName): void {
    director.loadScene(sceneName);
  }
}
