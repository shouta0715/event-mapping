/* eslint-disable no-restricted-globals */
import * as Comlink from "comlink";
import p5 from "p5";
import { BaseHandler } from "@event-mapping/event-sdk/handlers/base";
import { generateComlinkHandlers } from "@event-mapping/event-sdk/handlers/comlink";
import {
  EventClientOptions,
  EventClient,
} from "@event-mapping/event-sdk/types";

export class AdminHandler<
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> extends BaseHandler<TMeta> {
  private readonly comlinkHandlers = generateComlinkHandlers.bind(this);

  constructor(p: p5, options: EventClientOptions) {
    super(p, options);

    const handlers = this.comlinkHandlers();
    Comlink.expose(handlers, Comlink.windowEndpoint(self.parent));
  }

  // eslint-disable-next-line class-methods-use-this
  draw(): void {}

  circle: EventClient["circle"] = (x, y, d) => {
    this.p.circle(x, y, d);
  };

  ellipse: EventClient["ellipse"] = (x, y, w, h) => {
    this.p.ellipse(x, y, w, h);
  };

  line: EventClient["line"] = (x1, y1, x2, y2) => {
    this.p.line(x1, y1, x2, y2);
  };

  point: EventClient["point"] = (x, y, z) => {
    this.p.point(x, y, z);
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
    this.p.quad(x1, y1, x2, y2, x3, y3, x4, y4, detailX, detailY);
  };

  rect: EventClient["rect"] = (x, y, w, h, tl, tr, br, bl) => {
    this.p.rect(x, y, w, h, tl, tr, br, bl);
  };

  square: EventClient["square"] = (x, y, s, tl, tr, br, bl) => {
    this.p.square(x, y, s, tl, tr, br, bl);
  };

  triangle: EventClient["triangle"] = (x1, y1, x2, y2, x3, y3) => {
    this.p.triangle(x1, y1, x2, y2, x3, y3);
  };
}
