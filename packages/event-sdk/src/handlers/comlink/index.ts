import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";
import { resizeHandler } from "@event-mapping/event-sdk/handlers/comlink/resize";
import { ComlinkHandlers } from "@event-mapping/event-sdk/types";

export function generateComlinkHandlers(this: AdminHandler): ComlinkHandlers {
  return {
    resize: resizeHandler.bind(this),
  };
}
