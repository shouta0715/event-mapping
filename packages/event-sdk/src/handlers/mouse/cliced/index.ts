import { MouseClickedAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function eventMouseClicked(this: EventHandler): void {
  this.p.mouseClicked = () => {
    const message: MouseClickedAction = {
      action: "mouseClicked",
      data: { x: this.p.mouseX, y: this.p.mouseY },
    };

    this.sendMessage(message);
  };
}
