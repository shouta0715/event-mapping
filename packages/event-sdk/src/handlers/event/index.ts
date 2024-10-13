import { TerminalData } from "@event-mapping/schema";
import p5 from "p5";
import { BaseHandler } from "@event-mapping/event-sdk/handlers/base";
import { getWebsocketClient } from "@event-mapping/event-sdk/handlers/websocket";
import { connectWebsocket } from "@event-mapping/event-sdk/handlers/websocket/connect";
import { handleEventAction } from "@event-mapping/event-sdk/handlers/websocket/handlers";
import {
  EventClient,
  EventClientOptions,
} from "@event-mapping/event-sdk/types";

export class EventHandler<
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> extends BaseHandler<TMeta> {
  protected readonly ws: WebSocket;

  protected terminal: TerminalData | null = null;

  private readonly getWebSocketClient = getWebsocketClient.bind(this);

  private readonly connectWebsocket = connectWebsocket.bind(this);

  protected readonly handleEventAction = handleEventAction.bind(this);

  constructor(p: p5, options: EventClientOptions) {
    super(p, options);
    this.ws = this.getWebSocketClient();
    this.init();
  }

  private init() {
    this.connectWebsocket();
  }

  draw(): void {
    if (!this.initialized) return;
    if (!this.terminal) return;

    this.p.translate(-this.terminal.startX, -this.terminal.startY);
    this.p.scale(1);
  }

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
