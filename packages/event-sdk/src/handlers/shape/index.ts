/* eslint-disable @typescript-eslint/no-explicit-any */
import { createId } from "@paralleldrive/cuid2";
import { Quadtree } from "@timohausmann/quadtree-ts";
import p5 from "p5";
import { enterRectangle } from "@event-mapping/event-sdk/handlers/shape/actions/enter";
import { exitRectangle } from "@event-mapping/event-sdk/handlers/shape/actions/exit";
import { shapeIsColliding } from "@event-mapping/event-sdk/handlers/shape/colliding";
import {
  fallbackOnEnter,
  fallbackOnLeave,
} from "@event-mapping/event-sdk/handlers/shape/fallback";
import { getShape } from "@event-mapping/event-sdk/handlers/shape/get-shape";
import { qtIndex } from "@event-mapping/event-sdk/handlers/shape/qt";
import { trackingShape } from "@event-mapping/event-sdk/handlers/shape/tracking";
import { QuadtreeShape, TTData } from "@event-mapping/event-sdk/types";
import {
  IShape,
  ShapeProps,
  ShapeSize,
} from "@event-mapping/event-sdk/types/shape";

type ConstructorProps<TData extends TTData = any> = {
  isAdmin: boolean;
  data: ShapeProps<TData>;
  onEnter?: (rectId: string, data: ShapeProps<TData>) => void;
  onLeave?: (rectId: string, data: ShapeProps<TData>) => void;
  qt?: Quadtree<QuadtreeShape> | null;
};

export class Shape<TData extends TTData = any> implements IShape<TData> {
  readonly id: string;

  readonly position: p5.Vector;

  readonly velocity: p5.Vector;

  readonly size: ShapeSize;

  readonly data: TData;

  readonly isAdmin: boolean;

  readonly qt?: Quadtree<QuadtreeShape> | null;

  protected readonly onEnter: (rectId: string, data: ShapeProps<TData>) => void;

  protected readonly onLeave: (rectId: string, data: ShapeProps<TData>) => void;

  protected readonly shapeIsColliding = shapeIsColliding.bind(this);

  protected enterRectangle = enterRectangle.bind(this);

  protected exitRectangle = exitRectangle.bind(this);

  protected collidingShapes: Set<string> = new Set();

  protected tracking = trackingShape.bind(this);

  getShape = getShape.bind(this);

  qtIndex = qtIndex.bind(this);

  constructor({
    isAdmin,
    data,
    onEnter,
    onLeave,
    qt,
  }: ConstructorProps<TData>) {
    this.id = data.id || createId();
    this.position = data.position;
    this.velocity = data.velocity;
    this.size = data.size;
    this.data = data.data;
    this.isAdmin = isAdmin;
    this.qt = qt;
    this.onEnter = onEnter ?? fallbackOnEnter;
    this.onLeave = onLeave ?? fallbackOnLeave;
  }
}
