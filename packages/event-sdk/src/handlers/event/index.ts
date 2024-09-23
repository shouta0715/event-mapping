import p5 from "p5";
import { BaseHandler } from "@event-mapping/event-sdk/handlers/base";
import { getWebsocketClient } from "@event-mapping/event-sdk/handlers/event/websocket";
import { connectWebsocket } from "@event-mapping/event-sdk/handlers/event/websocket/connect";
import { EventClientOptions } from "@event-mapping/event-sdk/types";

export class EventHandler extends BaseHandler {
  protected readonly ws: WebSocket;

  private readonly getWebSocketClient = getWebsocketClient.bind(this);

  private readonly connectWebsocket = connectWebsocket.bind(this);

  constructor(p: p5, options: EventClientOptions) {
    super(p, options);
    this.ws = this.getWebSocketClient();
    this.init();
  }

  private init() {
    this.connectWebsocket();
  }
}
