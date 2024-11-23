import { MousePressedAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleMousePressedAction(
  this: EventHandler,
  data: MousePressedAction["data"]
) {
  this.mouseIsPressed = true;
  this.mousePressed({ x: data.x, y: data.y });
}
