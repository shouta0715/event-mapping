import { createId } from "@paralleldrive/cuid2";
import { Quadtree } from "@timohausmann/quadtree-ts";
import { Shape } from "@event-mapping/event-sdk/handlers/shape";
import {
  QuadtreeShape,
  TTData,
  TTrackingData,
} from "@event-mapping/event-sdk/types";
import {
  defaultTrackingShapeOptions,
  EnterShapeProps,
  IShapes,
  ShapeProps,
  TrackingShapeOptions,
  TrackingShapeProps,
} from "@event-mapping/event-sdk/types/shape";

export class AdminShapes<
  TData extends TTData = TTData,
  TrackingData extends TTrackingData = TTrackingData,
> implements IShapes<TData, TrackingData>
{
  items: Shape<TData, TrackingData>[] = [];

  qt: Quadtree<QuadtreeShape> | null;

  private readonly _cache_items: Map<string, Shape<TData, TrackingData>> =
    new Map();

  constructor(
    qt: Quadtree<QuadtreeShape> | null,
    private readonly onEnter: (
      rectId: string,
      shape: TrackingShapeProps<TData, TrackingData>
    ) => void,
    private readonly onExit: (rectId: string, shape_id: string) => void
  ) {
    this.qt = qt;
    this.onEnter = onEnter;
    this.onExit = onExit;
  }

  tracking(
    data: TrackingShapeProps<TData, TrackingData>,
    options: Partial<TrackingShapeOptions> = defaultTrackingShapeOptions
  ): void {
    const id = data.id ?? createId();
    const _options = { ...defaultTrackingShapeOptions, ...options };
    const shape = new Shape<TData, TrackingData>({
      isTracking: true,
      shape: { ...data, id },
      onEnter: this.onEnter,
      onExit: this.onExit,
      qt: this.qt,
      shareData: data.shareData,
      options: _options,
    });
    this.items.push(shape);
    this._cache_items.set(id, shape);
  }

  add(data: ShapeProps<TData>): void {
    const shape = new Shape<TData, TrackingData>({
      isTracking: false,
      shape: data,
    });
    this.items.push(shape);
    if (data.id) this._cache_items.set(data.id, shape);
  }

  remove(id: string): void {
    this.items = this.items.filter((shape) => shape.id !== id);
    this._cache_items.delete(id);
  }

  clear(): void {
    this.items = [];
    this._cache_items.clear();
  }

  enter: (id: string, data: EnterShapeProps<TrackingData>) => void = () => {};

  exit: (id: string) => void = () => {};

  get(id: string): Shape<TData, TrackingData> | undefined {
    return this._cache_items.get(id);
  }

  has(id: string): boolean {
    return this._cache_items.has(id);
  }

  _updateQuadtree(newQt: Quadtree<QuadtreeShape>): void {
    this.qt = newQt;
  }

  [Symbol.iterator](): IterableIterator<Shape<TData>> {
    return this.items[Symbol.iterator]();
  }
}
