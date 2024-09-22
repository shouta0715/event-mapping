import { Hono } from "hono";
import { Env } from "@/env";
import { registerHandler } from "@/subscription/handlers/register";

type TEnv = Omit<Env["Bindings"], "DB">;

const basePath = "/sources/:slug/subscribe";

export class Subscription implements DurableObject {
  protected app: Hono<Env> = new Hono<Env>().basePath(basePath);

  protected readonly storage: DurableObjectStorage;

  private readonly registerHandler = registerHandler.bind(this);

  constructor(
    protected readonly state: DurableObjectState,
    protected readonly env: TEnv
  ) {
    this.storage = state.storage;
    this.registerHandler();
  }

  fetch(req: Request) {
    return this.app.fetch(req);
  }
}
