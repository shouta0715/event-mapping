import { parseActionMessage } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { getSessionId } from "@event-mapping/event-sdk/utils";

export function connectWebsocket(this: EventHandler) {
  this.ws.onopen = () => {
    const id = getSessionId();
    // eslint-disable-next-line no-console
    console.log(`session_id: ${id} connected`);
  };

  this.ws.onmessage = (event) => {
    const action = parseActionMessage("event", event.data);

    if (!action) return;

    this.handleEventAction(action);
  };

  this.ws.onclose = () => {};
}
