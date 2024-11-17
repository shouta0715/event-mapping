import { createId } from "@paralleldrive/cuid2";
import { Quadtree } from "@timohausmann/quadtree-ts";
import { Shape } from "@event-mapping/event-sdk/handlers/shape";
import { QuadtreeShape, TTData } from "@event-mapping/event-sdk/types";
import { IShapes, ShapeProps } from "@event-mapping/event-sdk/types/shape";

export class AdminShapes<TData extends TTData = TTData>
  implements IShapes<TData>
{
  items: Shape<TData>[] = [];

  qt: Quadtree<QuadtreeShape> | null;

  private readonly onEnter: (rectId: string, data: ShapeProps<TData>) => void;

  private readonly onExit: (rectId: string, id: string) => void;

  constructor(
    qt: Quadtree<QuadtreeShape> | null,
    onEnter: (rectId: string, data: ShapeProps<TData>) => void,
    onExit: (rectId: string, id: string) => void
  ) {
    this.qt = qt;
    this.onEnter = onEnter;
    this.onExit = onExit;
  }

  add(data: ShapeProps<TData>): void {
    const id = data.id ?? createId();
    const shape = new Shape<TData>({
      isAdmin: true,
      data: { ...data, id },
      onEnter: this.onEnter,
      onExit: this.onExit,
      qt: this.qt,
    });
    this.items.push(shape);
  }

  remove(id: string): void {
    this.items = this.items.filter((shape) => shape.id !== id);
  }

  clear(): void {
    this.items = [];
  }

  _updateQuadtree(newQt: Quadtree<QuadtreeShape>): void {
    this.qt = newQt;
  }

  [Symbol.iterator](): IterableIterator<Shape<TData>> {
    return this.items[Symbol.iterator]();
  }
}
