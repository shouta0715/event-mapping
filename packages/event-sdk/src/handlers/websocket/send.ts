import { EventAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function sendMessage(this: EventHandler, action: EventAction) {
  const message = JSON.stringify(action);
  this.ws.send(message);
}
