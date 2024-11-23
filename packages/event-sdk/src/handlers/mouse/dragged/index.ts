import { MouseDraggedAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function eventMouseDragged(this: EventHandler): void {
  this.p.mouseDragged = () => {
    const { terminal } = this;
    if (!terminal) return;

    const _x = this.p.mouseX;
    const _y = this.p.mouseY;

    const x = _x + terminal.startX;
    const y = _y + terminal.startY;

    const message: MouseDraggedAction = {
      action: "mouseDragged",
      data: { id: terminal.id, x, y },
    };

    this.mouseX = x;
    this.mouseY = y;

    this.mouses.set(terminal.id, { x, y });

    this.mouseDragged(message.data);
    this.sendMessage(message);
  };
}
