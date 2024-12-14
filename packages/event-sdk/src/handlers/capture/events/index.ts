/* eslint-disable @typescript-eslint/no-explicit-any */
import p5 from "p5";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function createCapture(
  this: EventHandler,
  type: "video" | "audio",
  options?: { flipped: boolean }
) {
  return this.p.createCapture(type, options as any) as p5.MediaElement;
}
