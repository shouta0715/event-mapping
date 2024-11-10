import { EventUpdateGlobal } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleUpdateGlobalAction(
  this: EventHandler,
  data: EventUpdateGlobal["data"]
) {
  this.global = data;
  this.updatedGlobal(data);
}
