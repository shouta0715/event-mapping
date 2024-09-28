import { TerminalData } from "@event-mapping/schema";
import { DurableObject } from "cloudflare:workers";
import { Hono } from "hono";
import { patchNodeHandler } from "@/subscription/handlers/api/patch";
import { hibernationHandler } from "@/subscription/handlers/hibernation";
import { generateAdminMessageHandlers } from "@/subscription/handlers/message/admin";
import { generateEventMessageHandler } from "@/subscription/handlers/message/event";
import { registerHandler } from "@/subscription/handlers/register";

type TEnv = {
  SUBSCRIPTION: DurableObjectNamespace;
};

const basePath = "/sources/:id/subscribe";

export class Subscription extends DurableObject {
  protected app = new Hono().basePath(basePath);

  protected admin: WebSocket | null = null;

  protected sessions: Map<WebSocket, TerminalData> = new Map<
    WebSocket,
    TerminalData
  >();

  protected readonly storage: DurableObjectStorage;

  protected readonly adminMessageHandlers: ReturnType<
    typeof generateAdminMessageHandlers
  >;

  protected readonly eventMessageHandlers: ReturnType<
    typeof generateEventMessageHandler
  >;

  private readonly registerHandler = registerHandler.bind(this);

  private readonly hibernationHandler = hibernationHandler.bind(this);

  /**
   * API関連のHandlers
   */
  private readonly patchNodeHandler = patchNodeHandler.bind(this);

  constructor(
    protected readonly state: DurableObjectState,
    protected readonly env: TEnv
  ) {
    super(state, env);
    this.storage = state.storage;
    this.hibernationHandler();
    this.adminMessageHandlers = generateAdminMessageHandlers.bind(this)();
    this.eventMessageHandlers = generateEventMessageHandler.bind(this)();
    this.registerHandler();
  }

  async webSocketClose(ws: WebSocket) {
    this.adminMessageHandlers.leaveSessionHandler(ws);
  }

  async webSocketError(ws: WebSocket) {
    this.adminMessageHandlers.leaveSessionHandler(ws);
  }

  fetch(req: Request) {
    return this.app.fetch(req);
  }

  protected getWsFromId(id: string): WebSocket | null {
    const { sessions } = this;

    for (const [ws, data] of sessions) {
      if (!data.id) continue;

      if (data.id === id) return ws;
    }

    return null;
  }

  async patchNode(id: string, data: TerminalData) {
    return this.patchNodeHandler(id, data);
  }
}
