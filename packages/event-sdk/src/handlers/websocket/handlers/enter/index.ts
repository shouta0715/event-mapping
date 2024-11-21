import { EventEnterShape } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { EnterShapeProps } from "@event-mapping/event-sdk/types";

export function handleEnterShapeAction(
  this: EventHandler,
  data: EventEnterShape["data"]
) {
  const position = this.p.createVector(data.position.x, data.position.y);
  const velocity = this.p.createVector(data.velocity.x, data.velocity.y);

  const props: EnterShapeProps = {
    id: data.id,
    position,
    velocity,
    size: data.size,
    meta: data.meta,
  };

  this.shapes.enter(data.id, props);
}
