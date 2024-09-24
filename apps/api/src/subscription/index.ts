import { TerminalData } from "@event-mapping/schema";
import { DurableObject } from "cloudflare:workers";
import { Hono } from "hono";
import { generateAdminMessageHandlers } from "@/subscription/handlers/message/admin";
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

  private readonly registerHandler = registerHandler.bind(this);

  protected readonly adminMessageHandlers: ReturnType<
    typeof generateAdminMessageHandlers
  >;

  constructor(
    protected readonly state: DurableObjectState,
    protected readonly env: TEnv
  ) {
    super(state, env);
    this.storage = state.storage;
    this.adminMessageHandlers = generateAdminMessageHandlers.bind(this)();

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
}
