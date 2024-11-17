/* eslint-disable no-restricted-globals */
import { EnterShapeAction, TerminalData } from "@event-mapping/schema";
import { Quadtree, Rectangle } from "@timohausmann/quadtree-ts";
import * as Comlink from "comlink";
import p5 from "p5";
import { BaseHandler } from "@event-mapping/event-sdk/handlers/base";
import { generateComlinkHandlers } from "@event-mapping/event-sdk/handlers/comlink";
import { adminTransform } from "@event-mapping/event-sdk/handlers/helper";
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
  ShapeProps,
  AdminComlinkHandlers,
} from "@event-mapping/event-sdk/types";
import { p5VectorToObject } from "@event-mapping/event-sdk/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class AdminHandler<TData extends TTData = any> extends BaseHandler {
  private readonly comlinkHandlers = generateComlinkHandlers.bind(this);

  /**
   * @description Quadtree handlers
   */
  protected readonly initializeQuadtree = initializeQuadtree.bind(this);

  protected readonly insertTerminal = insertTerminal.bind(this);

  protected readonly removeTerminal = removeTerminal.bind(this);

  protected terminalRects: Map<string, Rectangle<TerminalData>> = new Map();

  transform = adminTransform.bind(this);

  protected quadtree: Quadtree<QuadtreeShape> | null = null;

  shapes: AdminShapes<TData>;

  protected adminComlinkHandlers: AdminComlinkHandlers | null = null;

  constructor(p: p5, options: EventClientOptions) {
    super(p, options);

    this.shapes = new AdminShapes<TData>(
      this.quadtree,
      this.onEnter,
      this.onLeave
    );
    this.init();
  }

  private onEnter = async (rectId: string, data: ShapeProps<TData>) => {
    if (!data.id) return;

    const sendData: EnterShapeAction["data"] = {
      rectId,
      id: data.id,
      size: data.size,
      position: p5VectorToObject(data.position),
      velocity: p5VectorToObject(data.velocity),
      meta: data.data,
    };

    this.adminComlinkHandlers?.enterShape(rectId, sendData);
  };

  private onLeave = async (rectId: string, id: string) => {
    this.adminComlinkHandlers?.leaveShape(rectId, id);
  };

  private init() {
    const handlers = this.comlinkHandlers();
    Comlink.expose(handlers, Comlink.windowEndpoint(self.parent));
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
}
