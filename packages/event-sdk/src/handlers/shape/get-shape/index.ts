import { Circle, Rectangle } from "@timohausmann/quadtree-ts";
import { Shape } from "@event-mapping/event-sdk/handlers/shape";

export function getShape<TData>(this: Shape): Circle<TData> | Rectangle<TData> {
  let shape: Circle<TData> | Rectangle<TData>;

  if ("d" in this.size) {
    shape = new Circle<TData>({
      x: this.position.x,
      y: this.position.y,
      r: this.size.d,
      data: this.data,
    });
  } else {
    shape = new Rectangle<TData>({
      x: this.position.x,
      y: this.position.y,
      width: this.size.w,
      height: this.size.h,
      data: this.data,
    });
  }

  return shape;
}
