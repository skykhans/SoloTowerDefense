export class HomeNoticeSession {
  private static notice = "";

  public static setNotice(text: string): void {
    this.notice = text;
  }

  public static consumeNotice(): string {
    const current = this.notice;
    this.notice = "";
    return current;
  }
}
