import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { eventMouseClicked } from "@event-mapping/event-sdk/handlers/mouse/clicked";

import { eventMouseDoubleClicked } from "@event-mapping/event-sdk/handlers/mouse/double-clicked";
import { eventMouseDragged } from "@event-mapping/event-sdk/handlers/mouse/dragged";
import { eventMouseMoved } from "@event-mapping/event-sdk/handlers/mouse/moved";
import { eventMousePressed } from "@event-mapping/event-sdk/handlers/mouse/pressed";
import { eventMouseReleased } from "@event-mapping/event-sdk/handlers/mouse/released";

export function registerMouseHandlers(this: EventHandler): void {
  eventMousePressed.call(this);
  eventMouseReleased.call(this);
  eventMouseClicked.call(this);
  eventMouseDoubleClicked.call(this);
  eventMouseMoved.call(this);
  eventMouseDragged.call(this);
}
