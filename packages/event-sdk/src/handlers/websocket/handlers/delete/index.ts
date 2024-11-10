import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleDeleteAction(this: EventHandler) {
  window.localStorage.removeItem("session_id");
  window.location.reload();
}
