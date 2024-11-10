import { EventUpdate } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleUpdateAction(
  this: EventHandler,
  data: EventUpdate["data"]
) {
  this.terminal = data;

  if (!this.canvas) return;

  this.setCanvasClipPath();
}
