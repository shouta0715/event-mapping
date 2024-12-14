import { Shape } from "@event-mapping/event-sdk/handlers/shape";

export function collidingShape(this: Shape, rectId: string): void {
  const data = {
    id: this.id,
    position: this.position,
    velocity: this.velocity,
    size: this.size,
    meta: this.meta,
    shareData: this.shareData,
  };

  this.onColliding?.(rectId, data);
}
