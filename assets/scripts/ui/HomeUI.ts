import { _decorator, Button, Component, Label } from "cc";
import { ConfigService } from "../config/ConfigService";
import { LocalStorageService } from "../core/LocalStorageService";
import { HomeNoticeSession } from "../core/HomeNoticeSession";
import { HomeProgressService } from "../core/HomeProgressService";
import { StartupLogService } from "../core/StartupLogService";
import { PlatformService } from "../platform/PlatformService";
import { ShareService } from "../platform/ShareService";
import { UILayoutService } from "../platform/UILayoutService";
import { SystemInfoService } from "../platform/SystemInfoService";
import { SceneNavigator } from "../core/SceneNavigator";
import { SCENE_NAMES } from "../core/SceneNames";
import { TutorialGuideService } from "../core/TutorialGuideService";
import type { LevelDefinition } from "../config/LevelConfig";

const { ccclass, property } = _decorator;

@ccclass("HomeUI")
export class HomeUI extends Component {
  @property(Label)
  public summaryLabel: Label | null = null;

  @property(Label)
  public levelLabel: Label | null = null;

  @property(Label)
  public levelDetailLabel: Label | null = null;

  @property(Label)
  public statusLabel: Label | null = null;

  @property(Button)
  public prevLevelButton: Button | null = null;

  @property(Button)
  public nextLevelButton: Button | null = null;

  @property(Button)
  public startLevelButton: Button | null = null;

  @property(Label)
  public startLevelButtonLabel: Label | null = null;

  @property(Button)
  public shareButton: Button | null = null;

  @property(Label)
  public shareButtonLabel: Label | null = null;

  private selectedLevelId = 1;
  private levels: LevelDefinition[] = [];

  start(): void {
    const save = LocalStorageService.loadPlayerSave();
    StartupLogService.log(save);
    const systemInfo = SystemInfoService.getSystemInfo();
    const layout = UILayoutService.getLayoutProfile();
    this.levels = ConfigService.getAllLevelConfigs().sort((a, b) => a.id - b.id);
    this.selectedLevelId = save.selectedLevel || HomeProgressService.getRecommendedLevelId(save, this.levels);
    const notice = HomeNoticeSession.consumeNotice();
    this.setStatus(
      notice ||
        `${TutorialGuideService.getHomeHint(save.tutorialCompleted)} 当前选择第 ${this.selectedLevelId} 关。当前平台：${systemInfo.platformName}，存储：${PlatformService.getProfile().storageName}，布局：${layout.mode}。`
    );
    this.render();
  }

  public onPrevLevel(): void {
    const currentIndex = this.levels.findIndex((level) => level.id === this.selectedLevelId);
    if (currentIndex <= 0) {
      this.setStatus("已经是第一关。");
      return;
    }

    this.selectedLevelId = this.levels[currentIndex - 1].id;
    this.persistSelectedLevel();
    this.render();
  }

  public onNextLevel(): void {
    const save = LocalStorageService.loadPlayerSave();
    const currentIndex = this.levels.findIndex((level) => level.id === this.selectedLevelId);
    const nextLevel = this.levels[currentIndex + 1];
    if (!nextLevel) {
      this.setStatus("已经是最后一关。");
      return;
    }
    if (!save.unlockedLevels.includes(nextLevel.id)) {
      this.setStatus("下一关尚未解锁。");
      return;
    }

    this.selectedLevelId = nextLevel.id;
    this.persistSelectedLevel();
    this.render();
  }

  public onSelectCurrentLevel(): void {
    this.persistSelectedLevel();
    this.setStatus(`已选择第 ${this.selectedLevelId} 关，可进入战斗场景。`);
    this.render();
  }

  public onStartSelectedLevel(): void {
    this.persistSelectedLevel();
    this.setStatus(`正在进入第 ${this.selectedLevelId} 关...`);
    SceneNavigator.goTo(SCENE_NAMES.battle);
  }

  public onResetProgress(): void {
    LocalStorageService.clearPlayerSave();
    const save = LocalStorageService.loadPlayerSave();
    this.selectedLevelId = save.selectedLevel;
    this.setStatus("存档已重置。");
    this.render();
  }

  public onShareGame(): void {
    const shared = ShareService.share({
      title: "来试试这款塔防小游戏原型",
      query: `level=${this.selectedLevelId}`,
    });
    this.setStatus(shared ? "已触发分享能力。" : "当前环境不支持原生分享，已执行回退。");
  }

  private persistSelectedLevel(): void {
    LocalStorageService.updatePlayerSave((save) => ({
      ...save,
      selectedLevel: this.selectedLevelId,
    }));
  }

  private render(): void {
    const save = LocalStorageService.loadPlayerSave();
    const level = this.levels.find((item) => item.id === this.selectedLevelId) ?? this.levels[0];
    const chapter = ConfigService.getChapterConfig(level.chapterId);
    const currentIndex = this.levels.findIndex((item) => item.id === level.id);
    const isUnlocked = save.unlockedLevels.includes(level.id);
    const hasPrev = currentIndex > 0;
    const nextLevel = this.levels[currentIndex + 1];
    const canGoNext = !!nextLevel && save.unlockedLevels.includes(nextLevel.id);
    this.selectedLevelId = level.id;

    if (this.summaryLabel) {
      const tutorialState = save.tutorialCompleted ? "教程已完成" : "教程进行中";
      const clearedLevels = HomeProgressService.getClearedLevelCount(save);
      const totalStars = HomeProgressService.getTotalStars(save);
      const recommendedLevelId = HomeProgressService.getRecommendedLevelId(save, this.levels);
      this.summaryLabel.string =
        `最佳波次 ${save.bestWave} | 金币 ${save.coins} | 已解锁关卡 ${save.unlockedLevels.length} | 已通关 ${clearedLevels} | 总星级 ${totalStars} | 推荐关卡 ${recommendedLevelId} | ${tutorialState}`;
    }

    if (this.levelLabel) {
      const unlocked = isUnlocked ? "已解锁" : "未解锁";
      const progress = save.levelProgress[String(level.id)];
      const progressText = HomeProgressService.getLevelProgressText(progress);
      this.levelLabel.string = `第 ${chapter.id} 章 ${chapter.name} | 第 ${level.id} 关 ${level.name} | ${unlocked} | ${progressText}`;
    }

    if (this.levelDetailLabel) {
      const progress = save.levelProgress[String(level.id)];
      const clearText = progress?.cleared ? "已通关" : "未通关";
      const rewardStatus = progress?.firstClearClaimed ? "首次奖励已结算" : `首次奖励 ${level.firstClearCoinReward} 金币`;
      this.levelDetailLabel.string =
        `${chapter.description} | 初始生命 ${level.startingLives} | 初始金币 ${level.startingGold} | 起始波次 ${level.waveStart} | 目标波次 ${level.targetWave} | ${clearText} | ${rewardStatus}`;
    }

    if (this.prevLevelButton) {
      this.prevLevelButton.interactable = hasPrev;
    }

    if (this.nextLevelButton) {
      this.nextLevelButton.interactable = canGoNext;
    }

    if (this.startLevelButton) {
      this.startLevelButton.interactable = isUnlocked;
    }

    if (this.startLevelButtonLabel) {
      this.startLevelButtonLabel.string = HomeProgressService.getLevelActionText(
        level,
        isUnlocked,
        save.levelProgress[String(level.id)]
      );
    }

    if (this.shareButton) {
      this.shareButton.interactable = true;
    }

    if (this.shareButtonLabel) {
      this.shareButtonLabel.string = "分享游戏";
    }
  }

  private setStatus(text: string): void {
    if (this.statusLabel) {
      this.statusLabel.string = text;
    }
  }
}
