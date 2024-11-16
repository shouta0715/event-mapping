import { Quadtree } from "@timohausmann/quadtree-ts";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";
import { Shape } from "@event-mapping/event-sdk/types/shape";

export function initializeQuadtree<TMeta extends Record<string, unknown>>(
  this: AdminHandler<TMeta>
) {
  if (this.global.width === 0 || this.global.height === 0) return;

  this.quadtree = new Quadtree<Shape<TMeta>>({
    maxObjects: 1000,
    maxLevels: 5,
    x: 0,
    y: 0,
    width: this.global.width,
    height: this.global.height,
  });
}
