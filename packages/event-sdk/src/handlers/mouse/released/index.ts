import { MouseReleasedAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function eventMouseReleased(this: EventHandler): void {
  this.p.mouseReleased = () => {
    const message: MouseReleasedAction = {
      action: "mouseReleased",
      data: { x: this.p.mouseX, y: this.p.mouseY },
    };

    this.sendMessage(message);
  };
}
