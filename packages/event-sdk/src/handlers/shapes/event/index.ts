import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { Shape } from "@event-mapping/event-sdk/handlers/shape";
import { TTData, TTrackingData } from "@event-mapping/event-sdk/types";
import {
  EnterShapeProps,
  IShapes,
  ShapeProps,
  TrackingShapeProps,
} from "@event-mapping/event-sdk/types/shape";

export class EventShapes<
  TData extends TTData = TTData,
  TrackingData extends TTrackingData = TTrackingData,
> implements IShapes<TData, TrackingData>
{
  items: Shape<TData>[] = [];

  private wsIsconnected = false;

  private readonly _cache_items: Map<string, Shape<TData>> = new Map();

  constructor(private readonly client: EventHandler) {
    this.client.subscribeWsStatus(this.notifyWsStatusChange.bind(this));
  }

  private notifyWsStatusChange(value: boolean) {
    this.wsIsconnected = value;
    for (const shape of this.items) {
      shape.setWsIsconnected(value);
    }
  }

  add(data: ShapeProps<TData>): void {
    if (!data.id) throw new Error("Shape id is required");

    const shape = new Shape<TData>({
      isTracking: false,
      shape: data,
      wsIsconnected: this.wsIsconnected,
    });

    this.items.push(shape);
    this._cache_items.set(data.id, shape);
  }

  tracking(_: TrackingShapeProps<TData, TrackingData>): void {
    // Not Needed
    // This method is only used by the AdminShapes class
    // to prevent type errors
  }

  remove(id: string): void {
    this.items = this.items.filter((shape) => shape.id !== id);
    this._cache_items.delete(id);
  }

  clear(): void {
    this.items = [];
    this._cache_items.clear();
  }

  get(id: string): Shape<TData> | undefined {
    return this._cache_items.get(id);
  }

  enter: (id: string, data: EnterShapeProps<TrackingData>) => void = () => {};

  exit: (id: string) => void = () => {};

  has(id: string): boolean {
    return this._cache_items.has(id);
  }

  [Symbol.iterator](): IterableIterator<Shape<TData>> {
    return this.items[Symbol.iterator]();
  }
}
