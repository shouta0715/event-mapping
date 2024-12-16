import { ProcessorAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleProcessorAction(
  this: EventHandler,
  data: ProcessorAction["data"]
) {
  this.processed = data;
}
