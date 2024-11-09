import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";

const MAX_WIDTH = 1000;
const MAX_HEIGHT = 1000;

export function resizeHandler(
  this: AdminHandler,
  width: number,
  height: number
) {
  const w = Math.min(width, MAX_WIDTH);
  const h = Math.min(height, MAX_HEIGHT);
  this.p.resizeCanvas(w, h);
  this.global = { width, height };
}
