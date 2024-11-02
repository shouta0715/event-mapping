import {
  EventAction,
  EventMoveVertex,
  GlobalData,
  MoveVertexAction,
  TerminalData,
} from "@event-mapping/schema";
import { Subscription } from "@/subscription";
import { createDefaultTerminalData, sendMessage } from "@/utils";

async function joinSessionHandler(
  this: Subscription,
  data: { sessionId: string; width: number; height: number; ws: WebSocket },
  global: GlobalData
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
  };

  await this.saveTerminal(sessionId, ws, terminalData);

  sendMessage(this.admin, {
    action: "join",
    data: terminalData,
  });

  sendMessage<EventAction>(ws, {
    action: "initialize",
    data: {
      terminal: terminalData,
      global,
    },
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

let timer: NodeJS.Timeout | null = null;
const SAVE_DURATION = 1000;

function moveVertexHandler(this: Subscription, data: MoveVertexAction["data"]) {
  if (!this.admin) return;
  const { id, positions, selectedIndex } = data;

  const ws = this.getWsFromId(id);

  if (!ws) return;

  const eventData: EventMoveVertex = {
    action: "moveVertex",
    data: {
      positions,
      selectedIndex,
    },
  };

  if (timer) clearTimeout(timer);

  timer = setTimeout(() => {
    const prevData = this.sessions.get(ws);
    if (!prevData) return;
    const newData = {
      ...prevData,
      positions: eventData.data.positions,
    };
    this.saveTerminal(id, ws, newData);
    if (!this.admin) return;
    sendMessage<MoveVertexAction>(this.admin, {
      action: "moveVertex",
      data: {
        id,
        ...eventData.data,
      },
    });
  }, SAVE_DURATION);

  sendMessage(ws, eventData);
}

function initializeSessionHandler(this: Subscription) {
  if (!this.admin || !this.source) return;

  const sessions = Array.from(this.sessions.values());
  const serializeData = {
    source: this.source,
    global: this.global,
  };
  this.admin.serializeAttachment(serializeData);
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
    moveVertexHandler: moveVertexHandler.bind(this),
  };
}
