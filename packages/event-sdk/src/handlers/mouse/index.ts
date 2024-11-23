import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { eventMouseClicked } from "@event-mapping/event-sdk/handlers/mouse/cliced";
import { eventMousePressed } from "@event-mapping/event-sdk/handlers/mouse/pressed";
import { eventMouseReleased } from "@event-mapping/event-sdk/handlers/mouse/released";

export function registerMouseHandlers(this: EventHandler): void {
  eventMousePressed.call(this);
  eventMouseReleased.call(this);
  eventMouseClicked.call(this);
}
