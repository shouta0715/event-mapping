import { EventMoveShape } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleMoveShapeAction(
  this: EventHandler,
  data: EventMoveShape["data"]
): void {
  const shape = this.shapes.get(data.id);
  if (!shape) return;

  shape.position.x = data.x;
  shape.position.y = data.y;
}
