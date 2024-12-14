import p5 from "p5";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function createCapture(
  this: AdminHandler,
  type: "video" | "audio",
  options?: { flipped: boolean }
) {
  return this.p.createCapture(type, options as any) as p5.MediaElement;
}
