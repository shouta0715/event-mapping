import { MouseMovedAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function eventMouseMoved(this: EventHandler): void {
  this.p.mouseMoved = () => {
    const { terminal } = this;
    if (!terminal) return;

    const _x = this.p.mouseX;
    const _y = this.p.mouseY;

    const x = _x + terminal.startX;
    const y = _y + terminal.startY;

    const message: MouseMovedAction = {
      action: "mouseMoved",
      data: { id: terminal.id, x, y },
    };

    this.mouseX = x;
    this.mouseY = y;

    this.mouses.set(terminal.id, { x, y });

    this.mouseMoved(message.data);
    this.sendMessage(message);
  };
}
