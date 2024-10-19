import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function transform(this: EventHandler, cb: () => void) {
  if (!this.terminal) return;
  const { startX, startY, width, height, windowHeight, windowWidth } =
    this.terminal;

  const scaleX = windowWidth / width;
  const scaleY = windowHeight / height;

  const x = -startX * scaleX;
  const y = -startY * scaleY;

  this.p.push();
  this.p.translate(x, y);
  this.p.scale(scaleX, scaleY);
  cb();
  this.p.pop();
}
