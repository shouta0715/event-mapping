import { Source } from "@event-mapping/db";
import {
  GlobalData,
  parseActionMessage,
  TerminalData,
} from "@event-mapping/schema";
import { DurableObject } from "cloudflare:workers";
import { Hono } from "hono";
import { Env } from "@/env";
import { deleteNodeCacheHandler } from "@/subscription/handlers/api/delete";
import {
  patchNodeHandler,
  patchSourceHandler,
} from "@/subscription/handlers/api/patch";
import { restartHandler } from "@/subscription/handlers/api/post";
import { saveAdmin } from "@/subscription/handlers/helper/save-admin";
import { saveTerminal } from "@/subscription/handlers/helper/save-terminal";
import { hibernationHandler } from "@/subscription/handlers/hibernation";

import { getImageHandler } from "@/subscription/handlers/images/get";
import { uploadImageHandler } from "@/subscription/handlers/images/upload";
import { generateAdminMessageHandlers } from "@/subscription/handlers/message/admin";

import { registerHandler } from "@/subscription/handlers/register";

const basePath = "/sources/:id/subscribe";

export class Subscription extends DurableObject<Env["Bindings"]> {
  protected app = new Hono().basePath(basePath);

  protected admin: WebSocket | null = null;

  protected source: Source | null = null;

  protected global: GlobalData | null = null;

  protected sessions: Map<WebSocket, TerminalData> = new Map<
    WebSocket,
    TerminalData
  >();

  protected readonly storage: DurableObjectStorage;

  protected readonly adminMessageHandlers: ReturnType<
    typeof generateAdminMessageHandlers
  >;

  private readonly registerHandler = registerHandler.bind(this);

  private readonly hibernationHandler = hibernationHandler.bind(this);

  /**
   * API関連のHandlers
   */
  private readonly patchNodeHandler = patchNodeHandler.bind(this);

  private readonly patchSourceHandler = patchSourceHandler.bind(this);

  private readonly restartHandler = restartHandler.bind(this);

  /**
   * 画像関連のHandlers
   */
  private readonly uploadImageHandler = uploadImageHandler.bind(this);

  protected readonly getImageHandler = getImageHandler.bind(this);

  private readonly deleteNodeCacheHandler = deleteNodeCacheHandler.bind(this);

  /**
   * Helper Functions
   */
  protected readonly saveTerminal = saveTerminal.bind(this);

  protected readonly saveAdmin = saveAdmin.bind(this);

  constructor(
    protected readonly state: DurableObjectState,
    protected readonly env: Env["Bindings"]
  ) {
    super(state, env);
    this.storage = state.storage;
    this.hibernationHandler();
    this.adminMessageHandlers = generateAdminMessageHandlers.call(this);
    this.registerHandler();
  }

  async webSocketClose(ws: WebSocket) {
    this.adminMessageHandlers.leaveSessionHandler(ws);
  }

  async webSocketError(ws: WebSocket) {
    this.adminMessageHandlers.leaveSessionHandler(ws);
  }

  async webSocketMessage(_: WebSocket, message: string) {
    const parsed = parseActionMessage("admin", message);

    if (!parsed) return;
    if (parsed.action !== "moveVertex") return;

    this.adminMessageHandlers.moveVertexHandler(parsed.data);
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

  async patchSource(data: Source) {
    return this.patchSourceHandler(data);
  }

  async deleteNodeCache(id: string) {
    return this.deleteNodeCacheHandler(id);
  }

  async restart(ms = 100) {
    return this.restartHandler(ms);
  }

  async uploadImage(req: Request) {
    return this.uploadImageHandler(req);
  }

  async getImage(id: string) {
    return this.getImageHandler(id);
  }
}
