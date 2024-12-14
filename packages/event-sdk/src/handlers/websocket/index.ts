import RWS, { Options } from "reconnecting-websocket";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { getSessionId } from "@event-mapping/event-sdk/utils";

export function getWebsocketClient(this: EventHandler): RWS {
  const session_id = getSessionId();

  const { wsUrl, sourceId } = this.options;

  const width = window.innerWidth;
  const height = window.innerHeight;

  const path = `/sources/${sourceId}/subscribe`;

  const url = new URL(path, wsUrl);

  url.searchParams.set("session_id", session_id);
  url.searchParams.set("width", width.toString());
  url.searchParams.set("height", height.toString());

  const options: Options = {
    connectionTimeout: 1000,
    maxReconnectionDelay: 10000,
    maxRetries: Infinity,
    minReconnectionDelay: 1000,
  };

  const ws = new RWS(url.toString(), [], options);

  return ws;
}
