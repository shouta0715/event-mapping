/* eslint-disable @typescript-eslint/no-explicit-any */
import { createId } from "@paralleldrive/cuid2";
import { Quadtree } from "@timohausmann/quadtree-ts";
import p5 from "p5";
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
      qt: Quadtree<QuadtreeShape> | null;
      shareData?: TrackingData;
      options: TrackingShapeOptions;
    }
  : {
      isTracking: false;
      shape: ShapeProps<TData>;
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

  protected readonly onEnter?: (
    rectId: string,
    shape: TrackingShapeProps<TData, TrackingData>
  ) => void;

  protected readonly onExit?: (rectId: string, id: string) => void;

  protected readonly shapeIsColliding = shapeIsColliding.bind(this);

  protected enterRectangle = enterRectangle.bind(this);

  protected exitRectangle = exitRectangle.bind(this);

  protected collidingShapes: Set<string> = new Set();

  protected readonly options: NonNullable<TrackingShapeOptions>;

  tracking = trackingShape.bind(this);

  getShape = getShape.bind(this);

  qtIndex = qtIndex.bind(this);

  constructor(props: ConstructorProps<TData, TrackingData, TIsTracking>) {
    this.isTracking = props.isTracking;

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
