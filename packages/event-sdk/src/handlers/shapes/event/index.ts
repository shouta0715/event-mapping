import { Shape } from "@event-mapping/event-sdk/handlers/shape";
import { TTData } from "@event-mapping/event-sdk/types";
import { IShapes, ShapeProps } from "@event-mapping/event-sdk/types/shape";

export class EventShapes<TData extends TTData = TTData>
  implements IShapes<TData>
{
  items: Shape<TData>[] = [];

  add(_: ShapeProps<TData>): void {
    // Not Needed
    // This method is only used by the AdminShapes class
    // to prevent type errors
  }

  /**
   * @description Adds a shape using the `add` method.
   * @param shape - The shape to add
   */
  _internal_add(data: ShapeProps<TData>): void {
    if (!data.id) throw new Error("Shape id is required");

    const shape = new Shape<TData>({
      isAdmin: false,
      data,
    });

    this.items.push(shape);
  }

  remove(id: string): void {
    this.items = this.items.filter((shape) => shape.id !== id);
  }

  clear(): void {
    this.items = [];
  }

  [Symbol.iterator](): IterableIterator<Shape<TData>> {
    return this.items[Symbol.iterator]();
  }
}
