import { Circle, Rectangle } from "@timohausmann/quadtree-ts";
import { Shape } from "@event-mapping/event-sdk/handlers/shape";

export function getShape<TData>(this: Shape): Rectangle<TData> | Circle<TData> {
  let shape: Rectangle<TData> | Circle<TData>;

  if (this.options?.isCircle) {
    shape = new Circle<TData>({
      x: this.position.x,
      y: this.position.y,
      r: this.size.w,
      data: this.meta,
    });
  } else {
    shape = new Rectangle<TData>({
      x: this.position.x,
      y: this.position.y,
      width: this.size.w,
      height: this.size.h,
    });
  }

  return shape;
}
