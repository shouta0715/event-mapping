import { TerminalData } from "@event-mapping/schema";
import { Subscription } from "@/subscription";

export async function saveTerminal(
  this: Subscription,
  sessionId: string,
  ws: WebSocket,
  data: TerminalData
) {
  await this.storage.put<TerminalData>(sessionId, data);

  this.sessions.set(ws, data);
  ws.serializeAttachment(data);
}
