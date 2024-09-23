import { DurableObject } from "cloudflare:workers";
import { Hono } from "hono";
import { Env } from "@/env";
import { registerHandler } from "@/subscription/handlers/register";

type TEnv = Omit<Env["Bindings"], "DB">;

const basePath = "/events/:event_id/sources/:source_id/subscribe";

export class Subscription extends DurableObject {
  protected app: Hono<Env> = new Hono<Env>().basePath(basePath);

  protected readonly storage: DurableObjectStorage;

  private readonly registerHandler = registerHandler.bind(this);

  constructor(
    protected readonly state: DurableObjectState,
    protected readonly env: TEnv
  ) {
    super(state, env);
    this.storage = state.storage;
    this.registerHandler();
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    if (message === "ping") {
      ws.send("pong");

      return;
    }

    // TODO: handle message
    console.log(this);
  }

  fetch(req: Request) {
    return this.app.fetch(req);
  }
}
