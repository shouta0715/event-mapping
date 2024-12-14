/* eslint-disable prefer-const */
import { Circle, Rectangle } from "@timohausmann/quadtree-ts";
import { Shape } from "@event-mapping/event-sdk/handlers/shape";
import { QuadtreeShape } from "@event-mapping/event-sdk/types";

export const circleRectangleCollision = <T>(
  circle: Circle<T>,
  rect: QuadtreeShape,
  isCenter: boolean,
  margin: number
): boolean => {
  let { x: circleX, y: circleY, r } = circle;
  let { x: rectX, y: rectY, width: rectWidth, height: rectHeight } = rect;

  if (isCenter) {
    circleX += r / 2;
    circleY += r / 2;
  }

  circleX -= margin;
  circleY -= margin;

  const closestX = Math.max(rectX, Math.min(circleX, rectX + rectWidth));
  const closestY = Math.max(rectY, Math.min(circleY, rectY + rectHeight));

  const distanceX = circleX - closestX;
  const distanceY = circleY - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  return distanceSquared <= r * r;
};

export const rectangleRectangleCollision = <T>(
  rect1: Rectangle<T>,
  rect2: QuadtreeShape
): boolean => {
  let { x: rect1X, y: rect1Y, width: rect1Width, height: rect1Height } = rect1;

  let { x: rect2X, y: rect2Y, width: rect2Width, height: rect2Height } = rect2;

  return (
    rect1X < rect2X + rect2Width &&
    rect1X + rect1Width > rect2X &&
    rect1Y < rect2Y + rect2Height &&
    rect1Y + rect1Height > rect2Y
  );
};

export function shapeIsColliding<T>(
  this: Shape,
  shape: Circle<T> | Rectangle<T>,
  rect: QuadtreeShape,
  margin: number
): boolean {
  if (shape instanceof Circle) {
    return circleRectangleCollision(shape, rect, this.options.isCenter, margin);
  }
  if (shape instanceof Rectangle) {
    return rectangleRectangleCollision(shape, rect);
  }

  return false;
}
