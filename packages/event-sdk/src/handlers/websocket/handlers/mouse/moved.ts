import { MouseMovedAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleMouseMovedAction(
  this: EventHandler,
  data: MouseMovedAction["data"]
) {
  this.mouseX = data.x;
  this.mouseY = data.y;

  this.mouseMoved({ x: data.x, y: data.y });
}
