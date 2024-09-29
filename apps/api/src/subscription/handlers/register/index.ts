import { createMiddleware } from "hono/factory";
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

    this.adminMessageHandlers.joinSessionHandler({
      sessionId: session_id,
      ws: server,
      ...parsed.data,
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  });

  this.app.get("/admin", sessionMiddleware, async () => {
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

    this.admin = server;

    this.adminMessageHandlers.initializeSessionHandler();

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  });
}
