import type { SharePayload } from "./PlatformTypes";

type WeChatLike = {
  shareAppMessage?: (payload: { title: string; imageUrl?: string; query?: string }) => void;
};

declare const wx: WeChatLike | undefined;

export class ShareService {
  public static share(payload: SharePayload): boolean {
    if (typeof wx !== "undefined" && typeof wx.shareAppMessage === "function") {
      wx.shareAppMessage({
        title: payload.title,
        imageUrl: payload.imageUrl,
        query: payload.query,
      });
      return true;
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(payload.title);
      return false;
    }

    return false;
  }
}
