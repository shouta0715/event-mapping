import { Shape } from "@event-mapping/event-sdk/handlers/shape";

export function trackingShape(this: Shape): void {
  if (!this.qt) return;
  if (!this.isTracking) return;

  const shape = this.getShape();

  const potentialCollisions = this.qt.retrieve(shape);

  for (const rect of potentialCollisions) {
    const terminalData = rect.data;
    const rectId = terminalData?.id;
    if (!rectId) continue;

    const isColliding = this.shapeIsColliding(shape, rect);

    if (isColliding) {
      if (this.collidingShapes.has(rectId)) continue;

      this.enterRectangle(rectId);
    } else {
      const shouldExit = this.collidingShapes.has(rectId);
      if (!shouldExit) continue;

      this.exitRectangle(rectId);
    }
  }
}
