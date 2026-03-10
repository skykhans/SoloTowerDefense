import { _decorator, Component } from "cc";
import { SceneBindingValidator } from "../core/SceneBindingValidator";
import { SceneStructureValidator } from "../core/SceneStructureValidator";
import { HomeUI } from "../ui/HomeUI";
import { HOME_SCENE_NODE_NAMES } from "../ui/SceneNodeNames";
import { SceneStructureProfiles } from "../ui/SceneStructureProfiles";

const { ccclass, property } = _decorator;

@ccclass("HomeSceneInstaller")
export class HomeSceneInstaller extends Component {
  @property(HomeUI)
  public homeUI: HomeUI | null = null;

  onLoad(): void {
    const owner = "HomeSceneInstaller";
    SceneStructureValidator.requireRootName(owner, this.node, HOME_SCENE_NODE_NAMES.root);
    SceneStructureValidator.validateRequiredNodeNames(owner, this.node, SceneStructureProfiles.homeRequiredNodeNames);
    const homeUI = SceneBindingValidator.requireComponent(owner, "HomeUI", this.homeUI);

    SceneBindingValidator.requireComponent(owner, "HomeUI.summaryLabel", homeUI.summaryLabel);
    SceneBindingValidator.requireComponent(owner, "HomeUI.levelLabel", homeUI.levelLabel);
    SceneBindingValidator.requireComponent(owner, "HomeUI.levelDetailLabel", homeUI.levelDetailLabel);
    SceneBindingValidator.requireComponent(owner, "HomeUI.statusLabel", homeUI.statusLabel);
    SceneBindingValidator.requireComponent(owner, "HomeUI.prevLevelButton", homeUI.prevLevelButton);
    SceneBindingValidator.requireComponent(owner, "HomeUI.nextLevelButton", homeUI.nextLevelButton);
    SceneBindingValidator.requireComponent(owner, "HomeUI.startLevelButton", homeUI.startLevelButton);
    SceneBindingValidator.requireComponent(owner, "HomeUI.startLevelButtonLabel", homeUI.startLevelButtonLabel);
    SceneBindingValidator.requireComponent(owner, "HomeUI.shareButton", homeUI.shareButton);
    SceneBindingValidator.requireComponent(owner, "HomeUI.shareButtonLabel", homeUI.shareButtonLabel);
  }
}
