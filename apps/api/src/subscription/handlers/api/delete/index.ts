import { EventDelete, TerminalData } from "@event-mapping/schema";
import { Subscription } from "@/subscription";
import { sendMessage } from "@/utils";

export async function deleteNodeCacheHandler(
  this: Subscription,
  nodeId: string
) {
  const ws = this.getWsFromId(nodeId);
  if (!ws) return;

  const target = await this.storage.get<TerminalData>(nodeId);

  if (!target) return;

  await this.storage.delete(nodeId);

  this.sessions.delete(ws);

  ws.serializeAttachment(null);

  sendMessage<EventDelete>(ws, {
    action: "delete",
    id: nodeId,
  });
}
