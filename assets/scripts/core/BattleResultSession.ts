export type BattleResultType = "victory" | "failure";

export interface BattleResultData {
  result: BattleResultType;
  levelId: number;
  reachedWave: number;
  kills: number;
  bestWave: number;
  stars: number;
  awardedCoins: number;
  firstClearReward: number;
  unlockedLevelId: number | null;
}

export class BattleResultSession {
  private static result: BattleResultData | null = null;

  public static setResult(result: BattleResultData): void {
    this.result = result;
  }

  public static consumeResult(): BattleResultData | null {
    const current = this.result;
    this.result = null;
    return current;
  }
}
