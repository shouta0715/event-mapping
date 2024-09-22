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
  this.app.get("/", sessionMiddleware, async () => {
    const { client } = getWebSocketPair();

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  });

  this.app.get("/admin", sessionMiddleware, async () => {
    const { client } = getWebSocketPair();

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  });
}
