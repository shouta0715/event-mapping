import { TerminalData } from "@event-mapping/schema";
import { Subscription } from "@/subscription";

export async function patchNodeHandler(
  this: Subscription,
  nodeId: string,
  data: TerminalData
) {
  const session = this.getWsFromId(nodeId);

  if (!session) return null;

  this.eventMessageHandlers.updateHandler(session, data);

  return { data };
}
