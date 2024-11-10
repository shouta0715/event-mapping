import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function setCanvasClipPath(this: EventHandler) {
  if (!this.terminal) return;
  if (!this.canvas) return;

  const { left, top, right, bottom } = this.terminal.margin;

  this.canvas.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
}
