import { MouseClickedAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function eventMouseClicked(this: EventHandler): void {
  this.p.mouseClicked = () => {
    const { terminal } = this;
    if (!terminal) return;

    const _x = this.p.mouseX;
    const _y = this.p.mouseY;

    const x = _x + terminal.startX;
    const y = _y + terminal.startY;

    const message: MouseClickedAction = {
      action: "mouseClicked",
      data: { x, y },
    };

    this.sendMessage(message);
  };
}
