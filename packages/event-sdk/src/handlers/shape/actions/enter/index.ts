import { Shape } from "@event-mapping/event-sdk/handlers/shape";

export function enterRectangle(this: Shape, rectId: string): void {
  const data = {
    id: this.id,
    position: this.position,
    velocity: this.velocity,
    size: this.size,
    meta: this.meta,
    shareData: this.shareData,
  };

  this.collidingShapes.add(rectId);
  this.onEnter?.(rectId, data);
}
