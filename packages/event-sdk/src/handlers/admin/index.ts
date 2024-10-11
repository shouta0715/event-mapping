/* eslint-disable no-restricted-globals */
import * as Comlink from "comlink";
import p5 from "p5";
import { BaseHandler } from "@event-mapping/event-sdk/handlers/base";
import { generateComlinkHandlers } from "@event-mapping/event-sdk/handlers/comlink";
import { EventClientOptions } from "@event-mapping/event-sdk/types";

export class AdminHandler extends BaseHandler {
  private readonly comlinkHandlers = generateComlinkHandlers.bind(this);

  constructor(p: p5, options: EventClientOptions) {
    super(p, options);

    const handlers = this.comlinkHandlers();
    Comlink.expose(handlers, Comlink.windowEndpoint(self.parent));
  }
}
