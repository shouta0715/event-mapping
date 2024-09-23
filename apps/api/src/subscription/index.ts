import { DurableObject } from "cloudflare:workers";
import { Hono } from "hono";
import { handleMessage } from "@/subscription/handlers/message";
import { registerHandler } from "@/subscription/handlers/register";

type TEnv = {
  SUBSCRIPTION: DurableObjectNamespace;
};

const basePath = "/events/:event_id/sources/:source_id/subscribe";

export class Subscription extends DurableObject {
  protected app = new Hono().basePath(basePath);

  protected readonly storage: DurableObjectStorage;

  private readonly registerHandler = registerHandler.bind(this);

  private readonly handleMessage = handleMessage.bind(this);

  constructor(
    protected readonly state: DurableObjectState,
    protected readonly env: TEnv
  ) {
    super(state, env);
    this.storage = state.storage;
    this.registerHandler();
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    this.handleMessage(ws, message);
  }

  fetch(req: Request) {
    return this.app.fetch(req);
  }
}
