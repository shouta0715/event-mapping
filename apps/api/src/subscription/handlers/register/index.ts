import { Source } from "@event-mapping/db";
import { GlobalData } from "@event-mapping/schema";
import { createMiddleware } from "hono/factory";
import { z } from "zod";
import { sizeSchema } from "@/libs/schema";
import { Subscription } from "@/subscription";
import { sendMessage } from "@/utils";

const sessionMiddleware = createMiddleware(async (c, next) => {
  const upgrade = c.req.header("Upgrade");

  if (upgrade !== "websocket") {
    return c.json({ message: "Upgrade header must be websocket" }, 426);
  }

  return next();
});

const getWebSocketPair = () => {
  const pair = new WebSocketPair();
  const [client, server] = Object.values(pair);

  return { pair, client, server };
};

export function registerHandler(this: Subscription) {
  this.app.get("/", sessionMiddleware, async (c) => {
    if (!this.admin) {
      return c.json({ message: "Admin websocket is not connected" }, 500);
    }

    const { client, server } = getWebSocketPair();
    const session_id = c.req.query("session_id");
    const width = c.req.query("width");
    const height = c.req.query("height");

    if (!session_id || !width || !height) {
      let msg = "";

      if (!session_id) msg += "session_id ";
      if (!width) msg += "width ";
      if (!height) msg += "height ";

      return c.json({ message: `${msg.trim()} is required` }, 400);
    }

    const parsed = sizeSchema.safeParse({
      width,
      height,
    });

    if (!parsed.success) {
      return c.json({ message: "Invalid size" }, 400);
    }

    this.state.acceptWebSocket(server, ["session", session_id]);
    this.state.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair("ping", "pong")
    );

    if (!this.global) {
      return c.json({ message: "Global not found" }, 404);
    }

    const global: GlobalData = {
      width: this.global.width,
      height: this.global.height,
    };

    this.adminMessageHandlers.joinSessionHandler(
      {
        sessionId: session_id,
        ws: server,
        ...parsed.data,
      },
      global
    );

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  });

  this.app.get("/admin", sessionMiddleware, async (c) => {
    const sourceId = c.req.param("id");
    const parsed = z.string().cuid2().safeParse(sourceId);

    if (!parsed.success) {
      return c.json({ message: "Invalid source_id" }, 400);
    }

    const { client, server } = getWebSocketPair();

    this.state.acceptWebSocket(server, ["admin"]);
    this.state.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair("ping", "pong")
    );

    if (this.admin !== null) {
      sendMessage(this.admin, {
        action: "warning",
        message: "新しい管理者が参加しました。",
      });
    }

    let source: Source | null = null;

    if (this.source === null) {
      source = await this.env.DB.prepare("SELECT * FROM sources WHERE id = ?")
        .bind(sourceId)
        .first<Source>();

      if (!source) {
        return c.json({ message: "Source not found" }, 404);
      }

      this.source = source;
    }

    this.admin = server;
    this.global = {
      width: this.source.width,
      height: this.source.height,
    };

    this.adminMessageHandlers.initializeSessionHandler();

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  });
}
