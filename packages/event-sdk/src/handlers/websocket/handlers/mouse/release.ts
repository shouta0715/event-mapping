import { MouseReleasedAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleMouseReleasedAction(
  this: EventHandler,
  data: MouseReleasedAction["data"]
) {
  this.mouseX = data.x;
  this.mouseY = data.y;
  this.mouseIsPressed = false;
  this.mouses.set(data.id, { x: data.x, y: data.y });
  this.mouseReleased({ x: data.x, y: data.y });
}
