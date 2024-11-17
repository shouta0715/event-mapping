import { Shape } from "@event-mapping/event-sdk/handlers/shape";
import { IShapes, ShapeProps } from "@event-mapping/event-sdk/types/shape";

export class EventShapes<
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> implements IShapes<TMeta>
{
  items: Shape<TMeta>[] = [];

  add(_: ShapeProps<TMeta>): void {
    // Not Needed
    // This method is only used by the AdminShapes class
    // This method is only used by the AdminShapes class
    // to prevent type errors
  }

  /**
   * @description Adds a shape using the `add` method.
   * @param shape - The shape to add
   */
  _internal_add(data: ShapeProps<TMeta>): void {
    if (!data.id) throw new Error("Shape id is required");

    const shape = new Shape<TMeta>({
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

  [Symbol.iterator](): IterableIterator<Shape<TMeta>> {
    return this.items[Symbol.iterator]();
  }
}
