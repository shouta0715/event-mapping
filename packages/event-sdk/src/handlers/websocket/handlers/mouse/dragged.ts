import { MouseDraggedAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleMouseDraggedAction(
  this: EventHandler,
  data: MouseDraggedAction["data"]
) {
  this.mouseX = data.x;
  this.mouseY = data.y;
}
