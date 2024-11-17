import { Circle, Rectangle } from "@timohausmann/quadtree-ts";
import { QuadtreeShape } from "@event-mapping/event-sdk/types";

export const circleRectangleCollision = <T>(
  circle: Circle<T>,
  rect: QuadtreeShape
): boolean => {
  const { x, y, r } = circle;
  const { x: rectX, y: rectY, width: rectWidth, height: rectHeight } = rect;

  return (
    x < rectX + rectWidth &&
    x + r > rectX &&
    y < rectY + rectHeight &&
    y + r > rectY
  );
};

export const rectangleRectangleCollision = <T>(
  rect1: Rectangle<T>,
  rect2: QuadtreeShape
): boolean => {
  const {
    x: rect1X,
    y: rect1Y,
    width: rect1Width,
    height: rect1Height,
  } = rect1;

  const {
    x: rect2X,
    y: rect2Y,
    width: rect2Width,
    height: rect2Height,
  } = rect2;

  return (
    rect1X < rect2X + rect2Width &&
    rect1X + rect1Width > rect2X &&
    rect1Y < rect2Y + rect2Height &&
    rect1Y + rect1Height > rect2Y
  );
};

export function shapeIsColliding<T>(
  shape: Circle<T> | Rectangle<T>,
  rect: QuadtreeShape
): boolean {
  if (shape instanceof Circle) {
    return circleRectangleCollision(shape, rect);
  }
  if (shape instanceof Rectangle) {
    return rectangleRectangleCollision(shape, rect);
  }

  return false;
}
