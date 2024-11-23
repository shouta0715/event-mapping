import { MouseReleasedAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function eventMouseReleased(this: EventHandler): void {
  this.p.mouseReleased = () => {
    const { terminal } = this;
    if (!terminal) return;

    const _x = this.p.mouseX;
    const _y = this.p.mouseY;

    const x = _x + terminal.startX;
    const y = _y + terminal.startY;

    const message: MouseReleasedAction = {
      action: "mouseReleased",
      data: { id: terminal.id, x, y },
    };

    this.mouseX = x;
    this.mouseY = y;

    this.mouses.set(terminal.id, { x, y });

    this.mouseReleased(message.data);
    this.sendMessage(message);
  };
}
