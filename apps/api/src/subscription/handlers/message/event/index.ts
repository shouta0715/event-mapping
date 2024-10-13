import { TerminalData } from "@event-mapping/schema";
import { Subscription } from "@/subscription";
import { sendMessage } from "@/utils";

export async function eventUpdateHandler(
  this: Subscription,
  ws: WebSocket,
  data: TerminalData
) {
  if (!this.global) return;

  sendMessage(ws, {
    action: "update",
    data,
  });

  this.sessions.set(ws, data);
  ws.serializeAttachment(data);
  await this.storage.put<TerminalData>(data.sessionId, data);
}

export function generateEventMessageHandler(this: Subscription) {
  return {
    updateHandler: eventUpdateHandler.bind(this),
  };
}
