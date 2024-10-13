import { Source } from "@event-mapping/db";
import { EventUpdateGlobal, TerminalData } from "@event-mapping/schema";
import { Subscription } from "@/subscription";
import { sendMessage } from "@/utils";

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

export async function patchSourceHandler(this: Subscription, data: Source) {
  const { source, admin } = this;
  if (!source || !admin) return;

  this.source = data;

  for (const ws of this.sessions.keys()) {
    sendMessage<EventUpdateGlobal>(ws, {
      action: "updateGlobal",
      data,
    });
  }
}
