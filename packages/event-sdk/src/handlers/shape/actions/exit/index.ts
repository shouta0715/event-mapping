import { Shape } from "@event-mapping/event-sdk/handlers/shape";

export function exitRectangle(this: Shape, rectId: string): void {
  this.onExit(rectId, this.id);
  this.collidingShapes.delete(rectId);
}
