/* eslint-disable @typescript-eslint/no-explicit-any */
import { TerminalData } from "@event-mapping/schema";
import p5 from "p5";
import { BaseHandler } from "@event-mapping/event-sdk/handlers/base";
import {
  transform,
  transformed,
} from "@event-mapping/event-sdk/handlers/helper";
import { setCanvasClipPath } from "@event-mapping/event-sdk/handlers/helper/clip-path";
import { initializeMarker } from "@event-mapping/event-sdk/handlers/helper/initialize-marker";
import { Images } from "@event-mapping/event-sdk/handlers/images";
import { EventShapes } from "@event-mapping/event-sdk/handlers/shapes/event";
import { getWebsocketClient } from "@event-mapping/event-sdk/handlers/websocket";
import { connectWebsocket } from "@event-mapping/event-sdk/handlers/websocket/connect";
import { handleEventAction } from "@event-mapping/event-sdk/handlers/websocket/handlers";
import {
  EventClient,
  EventClientOptions,
  TTData,
  TTrackingData,
} from "@event-mapping/event-sdk/types";

export class EventHandler<
  TData extends TTData = any,
  TrackingData extends TTrackingData = any,
> extends BaseHandler {
  protected ws: WebSocket;

  protected terminal: TerminalData | null = null;

  protected restartTime: number = 0;

  protected readonly getWebSocketClient = getWebsocketClient.bind(this);

  protected readonly connectWebsocket = connectWebsocket.bind(this);

  protected readonly handleEventAction = handleEventAction.bind(this);

  protected readonly initializeMarker = initializeMarker.bind(this);

  protected readonly setCanvasClipPath = setCanvasClipPath.bind(this);

  protected canvas: HTMLCanvasElement | null = null;

  readonly transform = transform.bind(this);

  readonly transformed = transformed.bind(this);

  protected _p5_setup_called = false;

  protected markerContainer: HTMLDivElement | null = null;

  protected marker: HTMLDivElement | null = null;

  protected readonly markerSize = 100;

  shapes: EventShapes<TData, TrackingData>;

  readonly images: Images;

  readonly __is_admin__ = false;

  constructor(p: p5, options: EventClientOptions) {
    super(p, options);
    this.shapes = new EventShapes<TData>();
    this.images = new Images(p, false, this.baseImageUrl);
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
