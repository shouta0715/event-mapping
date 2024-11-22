import { Circle, NodeGeometry, Rectangle } from "@timohausmann/quadtree-ts";

import { Shape } from "@event-mapping/event-sdk/handlers/shape";

export function qtIndex(this: Shape, node: NodeGeometry): number[] {
  if (this.options?.isCircle) {
    return Circle.prototype.qtIndex.call(
      {
        x: this.position.x,
        y: this.position.y,
        r: this.size.w,
      },
      node
    );
  }

  return Rectangle.prototype.qtIndex.call(
    {
      x: this.position.x,
      y: this.position.y,
      width: this.size.w,
      height: this.size.h,
    },
    node
  );
}
