import { MAX_IFRAME_SIZE } from "@event-mapping/event-sdk/constants";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";
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

export function adminTransform(this: AdminHandler, cb: () => void) {
  const { width, height } = this.global;

  if (!width || !height) {
    cb();

    return;
  }

  const doNotScale =
    width <= MAX_IFRAME_SIZE.width && height <= MAX_IFRAME_SIZE.height;

  if (doNotScale) {
    cb();

    return;
  }

  let scaleW = 1;
  let scaleH = 1;

  if (width > MAX_IFRAME_SIZE.width) {
    scaleW = this.p.width / width;
  }

  if (height > MAX_IFRAME_SIZE.height) {
    scaleH = this.p.height / height;
  }

  this.p.push();
  this.p.scale(scaleW, scaleH);
  cb();
  this.p.pop();
}
