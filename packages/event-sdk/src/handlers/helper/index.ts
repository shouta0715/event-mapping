import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function transform(this: EventHandler, cb: () => void) {
  if (!this.terminal) return;
  const { startX, startY } = this.terminal;

  this.p.push();
  this.p.translate(-startX, -startY);
  this.p.scale(1);
  cb();
  this.p.pop();
}
