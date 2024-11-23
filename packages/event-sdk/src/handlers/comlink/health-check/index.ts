import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";

export function healthCheckHandler(this: AdminHandler): boolean {
  return true;
}
