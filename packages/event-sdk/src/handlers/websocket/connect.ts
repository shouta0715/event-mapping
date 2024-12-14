/* eslint-disable no-console */
import { parseActionMessage } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { getSessionId } from "@event-mapping/event-sdk/utils";

export function connectWebsocket(this: EventHandler) {
  let pingInterval: number | undefined;
  let isPinged = false;

  this.ws.onopen = () => {
    const id = getSessionId();

    console.log(`session_id: ${id} connected`);

    pingInterval = setInterval(() => {
      if (this.ws.readyState !== WebSocket.OPEN) return;

      if (isPinged) {
        this.ws.reconnect();

        console.warn("Unreachable server");

        return;
      }

      this.ws.send("ping");
      isPinged = true;
    }, 1000);
  };

  this.ws.onmessage = (event) => {
    if (event.data === "pong") {
      console.log("Received pong from server");
      isPinged = false;

      return;
    }

    const action = parseActionMessage("event", event.data);

    if (!action) return;

    this.handleEventAction(action);
  };

  this.ws.onclose = () => {
    if (pingInterval !== undefined) {
      clearInterval(pingInterval);
    }
  };

  this.ws.onerror = () => {
    if (pingInterval !== undefined) {
      clearInterval(pingInterval);
    }
  };
}
