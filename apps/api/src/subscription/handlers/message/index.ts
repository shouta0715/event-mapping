import { AdminAction } from "@event-mapping/schema";
import { Subscription } from "@/subscription";

export function adminSendMessageHandler<T extends AdminAction>(
  this: Subscription,
  ws: WebSocket,
  message: T
) {
  ws.send(JSON.stringify(message));
}
