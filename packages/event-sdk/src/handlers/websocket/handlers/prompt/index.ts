import { EventPrompt } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handlePromptAction(
  this: EventHandler,
  data: EventPrompt["data"]
) {
  const { timestamp } = data;

  if (timestamp < Date.now()) return;

  setTimeout(() => {
    this.prompt();
  }, timestamp - Date.now());
}
