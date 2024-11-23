import { EventPrompt, EventRestart, PromptAction } from "@event-mapping/schema";
import { Subscription } from "@/subscription";
import { sendMessage } from "@/utils";
import { asyncify } from "@/utils/asyncify";

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

export async function promptHandler(
  this: Subscription,
  target: "all" | "admin" = "all",
  ms = 1000
): Promise<number> {
  if (!this.admin) return 0;

  const timestamp = Date.now() + ms;

  const data = {
    timestamp,
  };

  const promises: Promise<unknown>[] = [];

  if (target === "all") {
    const sessions = this.sessions.keys();
    for (const ws of sessions) {
      const promise = asyncify(() =>
        sendMessage<PromptAction>(ws, { action: "prompt", data })
      );

      promises.push(promise());
    }
  }

  const { admin } = this;

  const adminPromise = asyncify(() =>
    sendMessage<PromptAction>(admin, { action: "prompt", data })
  );

  promises.push(adminPromise());

  await Promise.all(promises);

  return timestamp;
}

export async function eventPromptHandler(
  this: Subscription,
  id: string,
  ms = 1000
): Promise<number> {
  if (!this.admin) return 0;

  const timestamp = Date.now() + ms;

  const data = {
    timestamp,
  };

  const target = this.getWsFromId(id);

  if (!target) return 0;

  sendMessage<EventPrompt>(target, { action: "prompt", data });

  return timestamp;
}
