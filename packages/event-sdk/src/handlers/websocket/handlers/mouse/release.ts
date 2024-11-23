import { MouseReleasedAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleMouseReleasedAction(
  this: EventHandler,
  data: MouseReleasedAction["data"]
) {
  this.mouseIsPressed = false;
  this.mouseReleased({ x: data.x, y: data.y });
}
