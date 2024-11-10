import { MAX_IFRAME_SIZE } from "@event-mapping/event-sdk/constants";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";

export function resizeHandler(
  this: AdminHandler,
  width: number,
  height: number
) {
  const w = Math.min(width, MAX_IFRAME_SIZE.width);
  const h = Math.min(height, MAX_IFRAME_SIZE.height);
  this.p.resizeCanvas(w, h);
  this.global = { width, height };
  this.updatedGlobal({ width, height });
}
