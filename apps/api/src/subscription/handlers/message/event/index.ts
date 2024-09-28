import { TerminalData } from "@event-mapping/schema";
import { Subscription } from "@/subscription";
import { sendMessage } from "@/utils";

export function eventUpdateHandler(
  this: Subscription,
  ws: WebSocket,
  data: TerminalData
) {
  sendMessage(ws, {
    action: "update",
    data,
  });

  this.sessions.set(ws, data);
  ws.serializeAttachment(data);
}

export function generateEventMessageHandler(this: Subscription) {
  return {
    updateHandler: eventUpdateHandler.bind(this),
  };
}
