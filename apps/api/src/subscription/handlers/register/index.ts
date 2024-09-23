import { createMiddleware } from "hono/factory";
import { Subscription } from "@/subscription";

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
    const { client, server } = getWebSocketPair();
    const session_id = c.req.query("session_id");

    if (!session_id) {
      return c.json({ message: "session_id is required" }, 400);
    }

    this.state.acceptWebSocket(server, ["session", session_id]);
    this.state.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair("ping", "pong")
    );

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

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  });
}
