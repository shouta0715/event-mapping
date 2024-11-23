import { MouseClickedAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleMouseClickedAction(
  this: EventHandler,
  data: MouseClickedAction["data"]
) {
  this.mouseClicked({ x: data.x, y: data.y });
}
