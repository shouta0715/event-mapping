/* eslint-disable no-restricted-globals */
import * as Comlink from "comlink";
import p5 from "p5";
import { BaseHandler } from "@event-mapping/event-sdk/handlers/base";
import { generateComlinkHandlers } from "@event-mapping/event-sdk/handlers/comlink";
import {
  adminTransform,
  adminTransformed,
} from "@event-mapping/event-sdk/handlers/helper";
import {
  EventClientOptions,
  EventClient,
} from "@event-mapping/event-sdk/types";

export class AdminHandler<
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> extends BaseHandler<TMeta> {
  private readonly comlinkHandlers = generateComlinkHandlers.bind(this);

  readonly transform = adminTransform.bind(this);

  readonly transformed = adminTransformed.bind(this);

  constructor(p: p5, options: EventClientOptions) {
    super(p, options);
    this.init();
  }

  private init() {
    const handlers = this.comlinkHandlers();
    Comlink.expose(handlers, Comlink.windowEndpoint(self.parent));
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
