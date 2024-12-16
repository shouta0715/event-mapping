import {
  EnterShapeAction,
  EventAction,
  EventEnterShape,
  EventLeaveShape,
  EventMoveShape,
  EventMoveVertex,
  EventStreamingCandidate,
  EventStreamingOffer,
  GlobalData,
  LeaveShapeAction,
  MoveShapeAction,
  MoveVertexAction,
  ProcessorAction,
  StreamingAnswerAction,
  StreamingCandidateAction,
  StreamingOfferAction,
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

  if (!target) return;

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

function enterShapeHandler(this: Subscription, data: EnterShapeAction["data"]) {
  if (!this.admin) return;
  const { rectId } = data;

  const ws = this.getWsFromId(rectId);

  if (!ws) return;

  const eventData: EventEnterShape = {
    action: "enterShape",
    data,
  };

  sendMessage(ws, eventData);
}

function leaveShapeHandler(this: Subscription, data: LeaveShapeAction["data"]) {
  if (!this.admin) return;
  const { id, rectId } = data;
  const ws = this.getWsFromId(rectId);
  if (!ws) return;

  const eventData: EventLeaveShape = {
    action: "leaveShape",
    data: {
      rectId,
      id,
    },
  };

  sendMessage(ws, eventData);
}

function moveShapeHandler(this: Subscription, data: MoveShapeAction["data"]) {
  if (!this.admin) return;
  const { id, x, y, meta, rectId } = data;

  const ws = this.getWsFromId(rectId);
  if (!ws) return;

  const eventData: EventMoveShape = {
    action: "moveShape",
    data: {
      id,
      x,
      y,
      meta,
    },
  };

  sendMessage(ws, eventData);
}

function streamingOfferHandler(
  this: Subscription,
  data: StreamingOfferAction["data"]
) {
  if (!this.admin) return;
  const { id, session: offer } = data;

  const ws = this.getWsFromId(id);
  if (!ws) return;

  const eventData: EventStreamingOffer = {
    action: "streamingOffer",
    data: {
      id,
      offer,
    },
  };

  sendMessage<EventStreamingOffer>(ws, eventData);
}

function streamingCandidateHandler(
  this: Subscription,
  data: StreamingCandidateAction["data"]
) {
  const { id, candidate } = data;
  const ws = this.getWsFromId(id);
  if (!ws) return;

  const eventData: EventStreamingCandidate = {
    action: "streamingCandidate",
    data: candidate,
  };

  sendMessage(ws, eventData);
}

function streamingAnswerHandler(
  this: Subscription,
  data: StreamingAnswerAction["data"]
) {
  if (!this.admin) return;

  sendMessage<StreamingAnswerAction>(this.admin, {
    action: "streamingAnswer",
    data,
  });
}

function processorHandler(this: Subscription, data: ProcessorAction["data"]) {
  if (!this.admin) return;

  for (const session of this.sessions.keys()) {
    sendMessage<ProcessorAction>(session, {
      action: "processor",
      data,
    });
  }
}

export function generateAdminMessageHandlers(this: Subscription) {
  return {
    joinSessionHandler: joinSessionHandler.bind(this),
    leaveSessionHandler: leaveSessionHandler.bind(this),
    initializeSessionHandler: initializeSessionHandler.bind(this),
    moveVertexHandler: moveVertexHandler.bind(this),
    enterShapeHandler: enterShapeHandler.bind(this),
    leaveShapeHandler: leaveShapeHandler.bind(this),
    moveShapeHandler: moveShapeHandler.bind(this),
    streamingOfferHandler: streamingOfferHandler.bind(this),
    streamingCandidateHandler: streamingCandidateHandler.bind(this),
    streamingAnswerHandler: streamingAnswerHandler.bind(this),
    processorHandler: processorHandler.bind(this),
  };
}
