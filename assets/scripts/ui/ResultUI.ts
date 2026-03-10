import { _decorator, Button, Component, Label, Node } from "cc";
import { ConfigService } from "../config/ConfigService";
import { BattleResultSession } from "../core/BattleResultSession";
import { HomeNoticeSession } from "../core/HomeNoticeSession";
import { LocalStorageService } from "../core/LocalStorageService";
import { ShareService } from "../platform/ShareService";
import { SceneNavigator } from "../core/SceneNavigator";
import { SCENE_NAMES } from "../core/SceneNames";

const { ccclass, property } = _decorator;

@ccclass("ResultUI")
export class ResultUI extends Component {
  @property(Node)
  public panelRoot: Node | null = null;

  @property(Label)
  public resultLabel: Label | null = null;

  @property(Label)
  public titleLabel: Label | null = null;

  @property(Label)
  public actionHintLabel: Label | null = null;

  @property(Button)
  public retryButton: Button | null = null;

  @property(Button)
  public backHomeButton: Button | null = null;

  @property(Button)
  public nextLevelButton: Button | null = null;

  @property(Button)
  public shareButton: Button | null = null;

  @property(Label)
  public nextLevelButtonLabel: Label | null = null;

  @property(Label)
  public shareButtonLabel: Label | null = null;

  private shareTitle = "来看看我的塔防战绩";
  private homeNotice = "";
  private nextLevelId: number | null = null;

  start(): void {
    const result = BattleResultSession.consumeResult();
    if (!this.resultLabel) return;

    if (!result) {
      if (this.titleLabel) {
        this.titleLabel.string = "暂无结算";
      }
      this.resultLabel.string = "当前没有可展示的战斗结算。";
      if (this.actionHintLabel) {
        this.actionHintLabel.string = "可以返回首页重新开始一局。";
      }
      if (this.nextLevelButton) this.nextLevelButton.interactable = false;
      if (this.nextLevelButtonLabel) this.nextLevelButtonLabel.string = "暂无下一关";
      if (this.shareButton) this.shareButton.interactable = false;
      if (this.shareButtonLabel) this.shareButtonLabel.string = "暂无可分享内容";
      (this.panelRoot ?? this.node).active = true;
      return;
    }

    const save = LocalStorageService.loadPlayerSave();
    save.bestWave = Math.max(save.bestWave, result.bestWave, result.reachedWave);
    if (result.result === "victory") {
      const level = ConfigService.getLevelConfig(result.levelId);
      const progressKey = String(result.levelId);
      const currentProgress = save.levelProgress[progressKey] ?? {
        bestStars: 0,
        cleared: false,
        firstClearClaimed: false,
      };
      save.coins += result.awardedCoins;
      save.levelProgress[progressKey] = {
        bestStars: Math.max(currentProgress.bestStars, result.stars),
        cleared: true,
        firstClearClaimed: currentProgress.firstClearClaimed || result.firstClearReward > 0,
      };
      if (result.unlockedLevelId && !save.unlockedLevels.includes(result.unlockedLevelId)) {
        save.unlockedLevels.push(result.unlockedLevelId);
      }
      save.selectedLevel = result.unlockedLevelId ?? result.levelId;
      if (this.actionHintLabel) {
        const rewardText = result.firstClearReward > 0 ? `首次通关奖励 ${level.firstClearCoinReward} 金币。` : "已结算通关奖励。";
        const unlockText = result.unlockedLevelId ? `已解锁第 ${result.unlockedLevelId} 关。` : "未解锁新关卡。";
        this.actionHintLabel.string = `${rewardText}${unlockText}`;
      }
    } else {
      save.selectedLevel = result.levelId;
    }
    LocalStorageService.savePlayerSave(save);

    if (this.titleLabel) {
      this.titleLabel.string = result.result === "victory" ? "胜利" : "失败";
    }

    this.shareTitle =
      result.result === "victory"
        ? `我在第 ${result.levelId} 关完成了目标波次 ${result.reachedWave}`
        : `我在第 ${result.levelId} 关坚持到了第 ${result.reachedWave} 波`;
    this.nextLevelId = result.result === "victory" ? result.unlockedLevelId : null;

    this.resultLabel.string =
      result.result === "victory"
        ? `防线守住了\n完成目标波次 ${result.reachedWave}\n累计击杀 ${result.kills}\n星级评价 ${"★".repeat(result.stars)}${"☆".repeat(3 - result.stars)}\n获得金币 ${result.awardedCoins}`
        : `防线失守\n到达波次 ${result.reachedWave}\n累计击杀 ${result.kills}`;

    this.homeNotice =
      result.result === "victory"
        ? `第 ${result.levelId} 关结算完成，获得 ${result.awardedCoins} 金币，评级 ${"★".repeat(result.stars)}${"☆".repeat(3 - result.stars)}${result.unlockedLevelId ? `，已解锁第 ${result.unlockedLevelId} 关` : ""}。`
        : `第 ${result.levelId} 关挑战结束，本次到达第 ${result.reachedWave} 波。`;

    if (this.actionHintLabel && result.result !== "victory") {
      this.actionHintLabel.string =
        "可以再来一局，或者返回首页重新调整关卡选择。";
    }

    if (this.retryButton) {
      this.retryButton.interactable = true;
    }

    if (this.backHomeButton) {
      this.backHomeButton.interactable = true;
    }

    if (this.nextLevelButton) {
      this.nextLevelButton.interactable = this.nextLevelId !== null;
    }

    if (this.nextLevelButtonLabel) {
      this.nextLevelButtonLabel.string = this.nextLevelId ? `进入第 ${this.nextLevelId} 关` : "暂无下一关";
    }

    if (this.shareButton) {
      this.shareButton.interactable = true;
    }

    if (this.shareButtonLabel) {
      this.shareButtonLabel.string = "分享战绩";
    }

    (this.panelRoot ?? this.node).active = true;
  }

  public onBackHome(): void {
    if (this.homeNotice) {
      HomeNoticeSession.setNotice(this.homeNotice);
    }
    SceneNavigator.goTo(SCENE_NAMES.home);
  }

  public onRetryBattle(): void {
    SceneNavigator.goTo(SCENE_NAMES.battle);
  }

  public onGoToNextLevel(): void {
    if (!this.nextLevelId) {
      return;
    }

    LocalStorageService.updatePlayerSave((save) => ({
      ...save,
      selectedLevel: this.nextLevelId ?? save.selectedLevel,
    }));
    SceneNavigator.goTo(SCENE_NAMES.battle);
  }

  public onShareResult(): void {
    const shared = ShareService.share({
      title: this.shareTitle,
    });

    if (this.actionHintLabel) {
      this.actionHintLabel.string = shared ? "已触发分享能力。" : "当前环境不支持原生分享，已执行回退。";
    }
  }
}
