import p5 from "p5";
import { EventClientOptions } from "@event-mapping/event-sdk/types";

export class BaseHandler {
  protected readonly isInIframe = window.self !== window.top;

  constructor(
    p: p5,
    protected readonly options: EventClientOptions
  ) {}
}
