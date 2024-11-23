import { MousePressedAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function eventMousePressed(this: EventHandler): void {
  this.p.mousePressed = () => {
    const message: MousePressedAction = {
      action: "mousePressed",
      data: { x: this.p.mouseX, y: this.p.mouseY },
    };

    this.sendMessage(message);
  };
}
