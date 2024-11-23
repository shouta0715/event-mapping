import { MouseDoubleClickedAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleMouseDoubleClickedAction(
  this: EventHandler,
  data: MouseDoubleClickedAction["data"]
) {
  this.mouseX = data.x;
  this.mouseY = data.y;

  this.mouseDoubleClicked({ x: data.x, y: data.y });
}
