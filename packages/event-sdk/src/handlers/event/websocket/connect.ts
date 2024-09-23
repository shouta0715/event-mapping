import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { getSessionId } from "@event-mapping/event-sdk/utils";

export function connectWebsocket(this: EventHandler) {
  this.ws.onopen = () => {
    const id = getSessionId();
    console.log(`session_id: ${id} connected`);
  };

  this.ws.onmessage = (event) => {
    console.log(event.data);
  };

  this.ws.onclose = () => {
    console.log("WebSocket connection closed");
  };
}
