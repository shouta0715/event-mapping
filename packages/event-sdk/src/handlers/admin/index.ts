import p5 from "p5";
import { BaseHandler } from "@event-mapping/event-sdk/handlers/base";
import { EventClientOptions } from "@event-mapping/event-sdk/types";

export class AdminHandler extends BaseHandler {
  constructor(p: p5, options: EventClientOptions) {
    super(p, options);
  }
}
