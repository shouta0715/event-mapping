import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { getSessionId } from "@event-mapping/event-sdk/utils";

export function getWebsocketClient(this: EventHandler): WebSocket {
  const session_id = getSessionId();

  const { wsUrl, eventId, sourceId } = this.options;

  const width = window.innerWidth;
  const height = window.innerHeight;

  const path = `/events/${eventId}/sources/${sourceId}/subscribe`;

  const url = new URL(path, wsUrl);

  url.searchParams.set("session_id", session_id);
  url.searchParams.set("width", width.toString());
  url.searchParams.set("height", height.toString());

  const ws = new WebSocket(url.toString());

  return ws;
}
