import { TerminalData } from "@event-mapping/schema";
import p5 from "p5";
import { BaseHandler } from "@event-mapping/event-sdk/handlers/base";
import { transform } from "@event-mapping/event-sdk/handlers/helper";
import { setCanvasClipPath } from "@event-mapping/event-sdk/handlers/helper/clip-path";
import { initializeMarker } from "@event-mapping/event-sdk/handlers/helper/initialize-marker";
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

  protected restartTime: number = 0;

  private readonly getWebSocketClient = getWebsocketClient.bind(this);

  private readonly connectWebsocket = connectWebsocket.bind(this);

  protected readonly handleEventAction = handleEventAction.bind(this);

  protected readonly initializeMarker = initializeMarker.bind(this);

  protected readonly setCanvasClipPath = setCanvasClipPath.bind(this);

  protected canvas: HTMLCanvasElement | null = null;

  readonly transform = transform.bind(this);

  protected _p5_setup_called = false;

  protected markerContainer: HTMLDivElement | null = null;

  protected marker: HTMLDivElement | null = null;

  protected readonly markerSize = 100;

  constructor(p: p5, options: EventClientOptions) {
    super(p, options);
    this.ws = this.getWebSocketClient();
    this.init();
  }

  private init() {
    this.connectWebsocket();
    this.initializeMarker();
    this.p.setup = () => {
      this._p5_setup_called = true;
    };
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
