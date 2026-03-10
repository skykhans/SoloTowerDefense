export type TutorialStep = "build" | "startWave" | "upgrade" | "complete";

export class TutorialGuideService {
  public static getHomeHint(tutorialCompleted: boolean): string {
    return tutorialCompleted
      ? "已载入存档，可以继续挑战更高关卡。"
      : "首次进入建议先放置一座塔，再开始第一波敌人。";
  }

  public static getBattleHint(step: TutorialStep, tutorialCompleted: boolean): string {
    if (tutorialCompleted || step === "complete") {
      return "教程已完成，自由布防并推进关卡。";
    }

    switch (step) {
      case "build":
        return "先选择一种炮塔，并在建造点放置第一座塔。";
      case "startWave":
        return "炮塔已就位，点击开始波次观察敌人路线。";
      case "upgrade":
        return "选中一座炮塔，尝试完成第一次升级。";
      default:
        return "";
    }
  }
}
