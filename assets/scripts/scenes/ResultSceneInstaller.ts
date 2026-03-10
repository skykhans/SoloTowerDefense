import { _decorator, Component } from "cc";
import { SceneBindingValidator } from "../core/SceneBindingValidator";
import { SceneStructureValidator } from "../core/SceneStructureValidator";
import { ResultUI } from "../ui/ResultUI";
import { RESULT_SCENE_NODE_NAMES } from "../ui/SceneNodeNames";
import { SceneStructureProfiles } from "../ui/SceneStructureProfiles";

const { ccclass, property } = _decorator;

@ccclass("ResultSceneInstaller")
export class ResultSceneInstaller extends Component {
  @property(ResultUI)
  public resultUI: ResultUI | null = null;

  onLoad(): void {
    const owner = "ResultSceneInstaller";
    SceneStructureValidator.requireRootName(owner, this.node, RESULT_SCENE_NODE_NAMES.root);
    SceneStructureValidator.validateRequiredNodeNames(owner, this.node, SceneStructureProfiles.resultRequiredNodeNames);
    const resultUI = SceneBindingValidator.requireComponent(owner, "ResultUI", this.resultUI);

    SceneBindingValidator.requireComponent(owner, "ResultUI.panelRoot", resultUI.panelRoot);
    SceneBindingValidator.requireComponent(owner, "ResultUI.resultLabel", resultUI.resultLabel);
    SceneBindingValidator.requireComponent(owner, "ResultUI.titleLabel", resultUI.titleLabel);
    SceneBindingValidator.requireComponent(owner, "ResultUI.actionHintLabel", resultUI.actionHintLabel);
    SceneBindingValidator.requireComponent(owner, "ResultUI.retryButton", resultUI.retryButton);
    SceneBindingValidator.requireComponent(owner, "ResultUI.backHomeButton", resultUI.backHomeButton);
    SceneBindingValidator.requireComponent(owner, "ResultUI.nextLevelButton", resultUI.nextLevelButton);
    SceneBindingValidator.requireComponent(owner, "ResultUI.nextLevelButtonLabel", resultUI.nextLevelButtonLabel);
    SceneBindingValidator.requireComponent(owner, "ResultUI.shareButton", resultUI.shareButton);
    SceneBindingValidator.requireComponent(owner, "ResultUI.shareButtonLabel", resultUI.shareButtonLabel);
  }
}
