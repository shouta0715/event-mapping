import p5 from "p5";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";
import { AdminWebRTC } from "@event-mapping/event-sdk/handlers/rtc/admin";

type ReturnType = {
  media: p5.MediaElement;
  rtc?: AdminWebRTC;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export function createCapture(
  this: AdminHandler,
  type: "video" | "audio",
  options?: { flipped: boolean }
): ReturnType {
  if (!this.adminComlinkHandlers) {
    // eslint-disable-next-line no-console
    console.warn("No adminComlinkHandlers found");

    return {
      media: this.p.createCapture(type, options as any) as p5.MediaElement,
    };
  }

  const rtc = new AdminWebRTC({
    sessions: this.terminals,
    streamingCandidate: this.adminComlinkHandlers?.streamingCandidate,
    streamingOffer: this.adminComlinkHandlers?.streamingOffer,
  });

  rtc.startStreaming(this.terminals);

  return {
    media: this.p.createCapture(type, options as any) as p5.MediaElement,
    rtc,
  };
}
