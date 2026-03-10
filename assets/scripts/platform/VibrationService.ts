type WeChatLike = {
  vibrateShort?: () => void;
  vibrateLong?: () => void;
};

declare const wx: WeChatLike | undefined;

export class VibrationService {
  public static vibrateShort(): boolean {
    if (typeof wx !== "undefined" && typeof wx.vibrateShort === "function") {
      wx.vibrateShort();
      return true;
    }

    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(40);
      return true;
    }

    return false;
  }

  public static vibrateLong(): boolean {
    if (typeof wx !== "undefined" && typeof wx.vibrateLong === "function") {
      wx.vibrateLong();
      return true;
    }

    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(120);
      return true;
    }

    return false;
  }
}
