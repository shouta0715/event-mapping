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

  if (!this.global) return null;

  sendMessage(session, {
    action: "update",
    data,
  });

  this.sessions.set(session, data);
  session.serializeAttachment(data);
  await this.storage.put<TerminalData>(data.sessionId, data);

  return { data };
}

export async function patchSourceHandler(this: Subscription, data: Source) {
  const { source, admin } = this;
  if (!source || !admin) return;

  this.source = data;
  this.global = {
    width: data.width,
    height: data.height,
  };

  for (const ws of this.sessions.keys()) {
    sendMessage<EventUpdateGlobal>(ws, {
      action: "updateGlobal",
      data: this.global,
    });
  }
}
