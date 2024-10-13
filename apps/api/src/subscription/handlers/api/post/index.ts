import { EventRestart } from "@event-mapping/schema";
import { Subscription } from "@/subscription";
import { sendMessage } from "@/utils";

export async function restartHandler(
  this: Subscription,
  ms = 100
): Promise<number> {
  if (!this.admin) return 0;

  const time = Date.now() + ms;

  for (const ws of this.sessions.keys()) {
    sendMessage<EventRestart>(ws, {
      action: "restart",
      time,
    });
  }

  return time;
}
