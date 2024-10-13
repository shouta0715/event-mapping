import { createId } from "@paralleldrive/cuid2";
import { Shape } from "@event-mapping/event-sdk/types";

export class Shapes<
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> {
  items: Shape<TMeta>[] = [];

  add(shape: Shape<TMeta>): void {
    const id = shape.id ?? createId();

    this.items.push({ ...shape, id });
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
