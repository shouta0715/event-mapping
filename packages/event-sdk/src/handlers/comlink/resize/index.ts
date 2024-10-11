import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";

export function resizeHandler(
  this: AdminHandler,
  width: number,
  height: number
) {
  this.p.resizeCanvas(width, height);
  this.p.redraw();
}
