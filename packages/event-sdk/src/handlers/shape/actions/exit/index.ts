import { Shape } from "@event-mapping/event-sdk/handlers/shape";

export function exitRectangle(this: Shape, rectId: string): void {
  const data = {
    id: this.id,
    position: this.position,
    velocity: this.velocity,
    size: this.size,
    data: this.data,
  };

  this.onLeave(rectId, data);
  this.collidingShapes.delete(rectId);
}
