import { PromptAction } from "@event-mapping/schema";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";

export function promptHandler(
  this: AdminHandler,
  data: PromptAction["data"]
): void {
  const { timestamp } = data;

  if (timestamp < Date.now()) return;

  setTimeout(() => {
    this.prompt();
  }, timestamp - Date.now());
}
