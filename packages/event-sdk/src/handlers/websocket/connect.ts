/* eslint-disable no-console */
import { parseActionMessage } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { getSessionId } from "@event-mapping/event-sdk/utils";

const PING_INTERVAL = 10000;
const RECONNECT_DELAY = 5000;

export function connectWebsocket(this: EventHandler) {
  let timer: number | null = null;
  let pong = true;

  const setupWebSocket = () => {
    this.ws = this.getWebSocketClient();

    this.ws.onopen = () => {
      const { ws } = this;
      if (!ws) return;

      const id = getSessionId();
      console.log(`session_id: ${id} connected`);

      timer = setInterval(() => {
        if (!pong) {
          console.warn("No pong response, attempting to reconnect...");

          ws.close();
          if (timer) clearInterval(timer);

          return;
        }

        pong = false;
        ws.send("ping");
      }, PING_INTERVAL);
    };

    this.ws.onmessage = (event) => {
      if (event.data === "pong") {
        pong = true;
        console.log("pong received");

        return;
      }

      const action = parseActionMessage("event", event.data);
      if (!action) return;

      this.handleEventAction(action);
    };

    this.ws.onclose = () => {
      console.warn("Connection closed, retrying...");
      if (timer) clearInterval(timer);

      setTimeout(() => {
        setupWebSocket();
      }, RECONNECT_DELAY);
    };

    this.ws.onerror = (e) => {
      console.error("WebSocket error", e);
    };
  };

  setupWebSocket();
}
