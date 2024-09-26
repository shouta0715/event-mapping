import { TerminalData } from "@event-mapping/schema";
import { Subscription } from "@/subscription";
import { createDefaultTerminalData, sendMessage } from "@/utils";

async function joinSessionHandler(
  this: Subscription,
  data: { sessionId: string; width: number; height: number; ws: WebSocket }
) {
  if (!this.admin) return;
  const { sessionId, width, height, ws } = data;
  const defaultTerminalData = createDefaultTerminalData({
    width,
    height,
    sessionId,
  });

  const prevTerminalData = await this.storage.get<TerminalData>(sessionId);

  if (!prevTerminalData) {
    await this.storage.put<TerminalData>(sessionId, defaultTerminalData);
  }

  const terminalData = {
    ...defaultTerminalData,
    ...prevTerminalData,
    width,
    height,
  };

  this.sessions.set(ws, terminalData);
  ws.serializeAttachment(terminalData);

  sendMessage(this.admin, {
    action: "join",
    data: terminalData,
  });
}

function leaveSessionHandler(this: Subscription, ws: WebSocket) {
  if (!this.admin) return;
  if (this.admin === ws) return;

  const target = this.sessions.get(ws);

  if (!target) throw new Error("target not found");

  const { sessionId } = target;
  this.sessions.delete(ws);

  sendMessage(this.admin, {
    action: "leave",
    sessionId,
  });

  ws.close();
}

function initializeSessionHandler(this: Subscription) {
  if (!this.admin) return;

  const sessions = Array.from(this.sessions.values());

  sendMessage(this.admin, {
    action: "initialize",
    sessions,
  });
}

export function generateAdminMessageHandlers(this: Subscription) {
  return {
    joinSessionHandler: joinSessionHandler.bind(this),
    leaveSessionHandler: leaveSessionHandler.bind(this),
    initializeSessionHandler: initializeSessionHandler.bind(this),
  };
}
