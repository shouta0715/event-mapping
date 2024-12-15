/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-globals */
import {
  EnterShapeAction,
  MoveShapeAction,
  TerminalData,
} from "@event-mapping/schema";
import { Quadtree, Rectangle } from "@timohausmann/quadtree-ts";
import * as Comlink from "comlink";
import p5 from "p5";
import { BaseHandler } from "@event-mapping/event-sdk/handlers/base";
import { createCapture } from "@event-mapping/event-sdk/handlers/capture/admin";
import { generateComlinkHandlers } from "@event-mapping/event-sdk/handlers/comlink";
import {
  adminTransform,
  adminTransformed,
} from "@event-mapping/event-sdk/handlers/helper";
import { Images } from "@event-mapping/event-sdk/handlers/images";
import {
  initializeQuadtree,
  insertTerminal,
  removeTerminal,
} from "@event-mapping/event-sdk/handlers/quadtree";
import { AdminShapes } from "@event-mapping/event-sdk/handlers/shapes/admin";
import {
  EventClientOptions,
  EventClient,
  QuadtreeShape,
  TTData,
  AdminComlinkHandlers,
  TTrackingData,
  TrackingShapeProps,
  ComlinkHandlers,
} from "@event-mapping/event-sdk/types";
import { p5VectorToObject } from "@event-mapping/event-sdk/utils";

export class AdminHandler<
  TData extends TTData = any,
  TrackingData extends TTrackingData = any,
> extends BaseHandler {
  private readonly comlinkHandlers = generateComlinkHandlers.bind(this);

  private handlers: ComlinkHandlers | null = null;

  /**
   * @description Quadtree handlers
   */
  protected readonly initializeQuadtree = initializeQuadtree.bind(this);

  protected readonly insertTerminal = insertTerminal.bind(this);

  protected readonly removeTerminal = removeTerminal.bind(this);

  protected terminalRects: Map<string, Rectangle<TerminalData>> = new Map();

  readonly transform = adminTransform.bind(this);

  readonly transformed = adminTransformed.bind(this);

  protected readonly _createCapture = createCapture.bind(this);

  protected quadtree: Quadtree<QuadtreeShape> | null = null;

  shapes: AdminShapes<TData, TrackingData>;

  protected adminComlinkHandlers: AdminComlinkHandlers | null = null;

  readonly __is_admin__ = true;

  readonly images: Images;

  private _capture: p5.MediaElement | null = null;

  get capture() {
    return this._capture;
  }

  constructor(p: p5, options: EventClientOptions) {
    super(p, options);

    this.shapes = new AdminShapes<TData, TrackingData>(
      this.quadtree,
      this.onEnter,
      this.onLeave,
      this.onColliding
    );
    this.images = new Images(p, true, this.baseImageUrl);
    this.init();
  }

  private onEnter = async (rectId: string, data: TrackingShapeProps<TData>) => {
    if (!data.id) return;

    const sendData: EnterShapeAction["data"] = {
      rectId,
      id: data.id,
      size: data.size,
      position: p5VectorToObject(data.position),
      velocity: p5VectorToObject(data.velocity),
      meta: data.shareData,
    };

    this.adminComlinkHandlers?.enterShape(rectId, sendData);
  };

  private onLeave = async (rectId: string, id: string) => {
    this.adminComlinkHandlers?.leaveShape(rectId, id);
  };

  private onColliding = async (
    rectId: string,
    shape: TrackingShapeProps<TData, TrackingData>
  ) => {
    if (!shape.id) return;

    const data: MoveShapeAction["data"] = {
      rectId,
      id: shape.id,
      x: shape.position.x,
      y: shape.position.y,
      meta: shape.shareData,
    };

    this.adminComlinkHandlers?.moveShape(rectId, data);
  };

  private init() {
    this.handlers = this.comlinkHandlers();
    Comlink.expose(this.handlers, Comlink.windowEndpoint(self.parent));
    this.adminComlinkHandlers = Comlink.wrap(
      Comlink.windowEndpoint(self.parent)
    );
  }

  circle: EventClient["circle"] = (x, y, d) => {
    this.transform(() => this.p.circle(x, y, d));
  };

  ellipse: EventClient["ellipse"] = (x, y, w, h) => {
    this.transform(() => this.p.ellipse(x, y, w, h));
  };

  line: EventClient["line"] = (x1, y1, x2, y2) => {
    this.transform(() => this.p.line(x1, y1, x2, y2));
  };

  point: EventClient["point"] = (x, y, z) => {
    this.transform(() => this.p.point(x, y, z));
  };

  quad: EventClient["quad"] = (
    x1,
    y1,
    x2,
    y2,
    x3,
    y3,
    x4,
    y4,
    detailX,
    detailY
  ) => {
    this.transform(() =>
      this.p.quad(x1, y1, x2, y2, x3, y3, x4, y4, detailX, detailY)
    );
  };

  rect: EventClient["rect"] = (x, y, w, h, tl, tr, br, bl) => {
    this.transform(() => this.p.rect(x, y, w, h, tl, tr, br, bl));
  };

  square: EventClient["square"] = (x, y, s, tl, tr, br, bl) => {
    this.transform(() => this.p.square(x, y, s, tl, tr, br, bl));
  };

  triangle: EventClient["triangle"] = (x1, y1, x2, y2, x3, y3) => {
    this.transform(() => this.p.triangle(x1, y1, x2, y2, x3, y3));
  };

  createCapture: EventClient["createCapture"] = (type, options) => {
    const { media, rtc } = this._createCapture(type, options);

    if (rtc) {
      if (!this.handlers) return media;

      this.handlers.streamingAnswer = rtc.onAnswer.bind(rtc);
    }

    this._capture = media;

    media.hide?.();

    return this._capture;
  };
}
