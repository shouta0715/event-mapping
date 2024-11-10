import { EventWarning } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleWarningAction(
  this: EventHandler,
  message: EventWarning["message"]
) {
  // eslint-disable-next-line no-console
  console.warn(message);
}
