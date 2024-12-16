/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProcessorAction, TerminalData } from "@event-mapping/schema";
import p5 from "p5";
import RWS from "reconnecting-websocket";
import { BaseHandler } from "@event-mapping/event-sdk/handlers/base";
import { createCapture } from "@event-mapping/event-sdk/handlers/capture/events";
import {
  transform,
  transformed,
} from "@event-mapping/event-sdk/handlers/helper";
import { setCanvasClipPath } from "@event-mapping/event-sdk/handlers/helper/clip-path";
import { initializeMarker } from "@event-mapping/event-sdk/handlers/helper/initialize-marker";
import { Images } from "@event-mapping/event-sdk/handlers/images";
import { registerMouseHandlers } from "@event-mapping/event-sdk/handlers/mouse";
import { EventWebRTC } from "@event-mapping/event-sdk/handlers/rtc/events";
import { EventShapes } from "@event-mapping/event-sdk/handlers/shapes/event";
import { trackStream } from "@event-mapping/event-sdk/handlers/stream";
import { getWebsocketClient } from "@event-mapping/event-sdk/handlers/websocket";
import { connectWebsocket } from "@event-mapping/event-sdk/handlers/websocket/connect";
import { handleEventAction } from "@event-mapping/event-sdk/handlers/websocket/handlers";
import { sendMessage } from "@event-mapping/event-sdk/handlers/websocket/send";
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
  protected ws: RWS;

  private _wsIsconnected = false;

  private wsStatusSubscribers = new Set<(value: boolean) => void>();

  get wsIsconnected() {
    return this._wsIsconnected;
  }

  set wsIsconnected(value: boolean) {
    this._wsIsconnected = value;

    for (const callback of this.wsStatusSubscribers) {
      callback(value);
    }
  }

  subscribeWsStatus(callback: (value: boolean) => void) {
    this.wsStatusSubscribers.add(callback);
  }

  unsubscribeWsStatus(callback: (value: boolean) => void) {
    this.wsStatusSubscribers.delete(callback);
  }

  protected terminal: TerminalData | null = null;

  protected restartTime: number = 0;

  protected readonly getWebSocketClient = getWebsocketClient.bind(this);

  protected readonly connectWebsocket = connectWebsocket.bind(this);

  protected readonly handleEventAction = handleEventAction.bind(this);

  protected readonly sendMessage = sendMessage.bind(this);

  protected readonly initializeMarker = initializeMarker.bind(this);

  protected readonly setCanvasClipPath = setCanvasClipPath.bind(this);

  protected readonly registerMouseHandlers = registerMouseHandlers.bind(this);

  protected readonly _createCapture = createCapture.bind(this);

  protected readonly trackStream = trackStream.bind(this);

  protected processed: unknown | null = null;

  protected rtc: EventWebRTC | null = null;

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

  protected _capture: p5.MediaElement | null = null;

  get capture() {
    return this._capture;
  }

  constructor(p: p5, options: EventClientOptions) {
    super(p, options);
    this.images = new Images(p, false, this.baseImageUrl);
    this.shapes = new EventShapes<TData, TrackingData>(this);
    this.ws = this.getWebSocketClient();
    this.init();
  }

  private init() {
    this.connectWebsocket();
    this.initializeMarker();
    this.registerMouseHandlers();
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

  createCapture: EventClient["createCapture"] = () => {
    this.rtc = this._createCapture(this.trackStream);

    this._capture?.hide?.();

    return this._capture;
  };

  processor<T extends ProcessorAction["data"]>(): T | null {
    return this.processed as T | null;
  }
}
