import { EventLeaveShape } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleLeaveShapeAction(
  this: EventHandler,
  data: EventLeaveShape["data"]
) {
  const isAlreadyRemoved = this.shapes.get(data.id);
  if (!isAlreadyRemoved) return;

  this.shapes.exit(data.id);
}
