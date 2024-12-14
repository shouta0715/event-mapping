/* eslint-disable @typescript-eslint/no-explicit-any */
import { createId } from "@paralleldrive/cuid2";
import { Quadtree } from "@timohausmann/quadtree-ts";
import p5 from "p5";
import { collidingShape } from "@event-mapping/event-sdk/handlers/shape/actions/colliding";
import { enterRectangle } from "@event-mapping/event-sdk/handlers/shape/actions/enter";
import { exitRectangle } from "@event-mapping/event-sdk/handlers/shape/actions/exit";
import { shapeIsColliding } from "@event-mapping/event-sdk/handlers/shape/colliding";
import {
  fallbackOnEnter,
  fallbackOnExit,
} from "@event-mapping/event-sdk/handlers/shape/fallback";
import { getShape } from "@event-mapping/event-sdk/handlers/shape/get-shape";
import { qtIndex } from "@event-mapping/event-sdk/handlers/shape/qt";
import { trackingShape } from "@event-mapping/event-sdk/handlers/shape/tracking";
import {
  QuadtreeShape,
  TTData,
  TTrackingData,
} from "@event-mapping/event-sdk/types";
import {
  defaultTrackingShapeOptions,
  IShape,
  ShapeProps,
  ShapeSize,
  TrackingShapeOptions,
  TrackingShapeProps,
} from "@event-mapping/event-sdk/types/shape";

type ConstructorProps<
  TData extends TTData = any,
  TrackingData extends TTrackingData = TTrackingData,
  TIsTracking extends boolean = boolean,
> = TIsTracking extends true
  ? {
      isTracking: true;
      shape: ShapeProps<TData>;
      onEnter: (
        rectId: string,
        shape: TrackingShapeProps<TData, TrackingData>
      ) => void;
      onExit: (rectId: string, shape_id: string) => void;
      onColliding: (
        rectId: string,
        shape: TrackingShapeProps<TData, TrackingData>
      ) => void;
      qt: Quadtree<QuadtreeShape> | null;
      shareData?: TrackingData;
      options: TrackingShapeOptions;
      wsIsconnected: boolean;
    }
  : {
      isTracking: false;
      shape: ShapeProps<TData>;
      wsIsconnected: boolean;
    };

export class Shape<
  TData extends TTData = any,
  TrackingData extends TTrackingData = any,
  TIsTracking extends boolean = boolean,
> implements IShape<TData, TrackingData>
{
  readonly id: string;

  readonly position: p5.Vector;

  readonly velocity: p5.Vector;

  readonly size: ShapeSize;

  readonly shareData?: TrackingData;

  readonly isTracking: boolean;

  readonly meta: TData;

  readonly qt?: Quadtree<QuadtreeShape> | null;

  private wsIsconnected = false;

  public setWsIsconnected(value: boolean) {
    this.wsIsconnected = value;
  }

  protected readonly onEnter?: (
    rectId: string,
    shape: TrackingShapeProps<TData, TrackingData>
  ) => void;

  protected readonly onExit?: (rectId: string, id: string) => void;

  protected readonly shapeIsColliding = shapeIsColliding.bind(this);

  protected enterRectangle = enterRectangle.bind(this);

  protected exitRectangle = exitRectangle.bind(this);

  protected collidingShape = collidingShape.bind(this);

  /**
   * トラッキングしている場合、現在の位置を変更します。
   * クライアント側の位置情報は、管理画面と動悸されます。
   *
   * @param x - 現在の位置に設定または追加するx座標。
   * @param y - 現在の位置に設定または追加するy座標。
   * @param options - 移動のための設定オプション。
   * @param options.operation - 実行する操作を決定します。位置を設定するには `"set"` を使用します。現在の位置に追加するには `"add"` を使用します。
   */
  move(
    x: number,
    y: number,
    { operation = "add" }: { operation?: "set" | "add" } = {}
  ) {
    if (!this.isTracking && this.wsIsconnected) return;

    if (operation === "set") {
      this.position.set(x, y);
    } else {
      this.position.add(x, y);
    }
  }

  protected onColliding?: (
    rectId: string,
    shape: TrackingShapeProps<TData, TrackingData>
  ) => void;

  protected collidingShapes: Set<string> = new Set();

  protected readonly options: NonNullable<TrackingShapeOptions>;

  readonly tracking = trackingShape.bind(this);

  protected readonly getShape = getShape.bind(this);

  readonly qtIndex = qtIndex.bind(this);

  constructor(props: ConstructorProps<TData, TrackingData, TIsTracking>) {
    this.isTracking = props.isTracking;
    this.wsIsconnected = props.wsIsconnected;

    if (props.isTracking) {
      this.id = props.shape.id || createId();
      this.position = props.shape.position;
      this.velocity = props.shape.velocity;
      this.size = props.shape.size;
      this.meta = props.shape.meta;
      this.options = props.options;

      this.shareData = props.shareData;
      this.qt = props.qt;
      this.onEnter = props.onEnter ?? fallbackOnEnter;
      this.onExit = props.onExit ?? fallbackOnExit;
      this.onColliding = props.onColliding;
    } else {
      this.id = props.shape.id || createId();
      this.position = props.shape.position;
      this.velocity = props.shape.velocity;
      this.size = props.shape.size;
      this.meta = props.shape.meta;
      this.options = defaultTrackingShapeOptions;
    }
  }
}
