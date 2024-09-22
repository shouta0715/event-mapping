import p5 from "p5";
import { EventClientOptions } from "@event-mapping/event-sdk/types";

export class EventHandler {
  constructor(
    private readonly p: p5,
    private readonly options: EventClientOptions
  ) {}
}
