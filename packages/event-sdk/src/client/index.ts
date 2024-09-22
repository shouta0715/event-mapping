import p5 from "p5";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { EventClientOptions } from "@event-mapping/event-sdk/types";

export const createEventClient = (p: p5, options: EventClientOptions) => {
  const isIframe = window.self !== window.top;

  const handler = isIframe
    ? new AdminHandler(p, options)
    : new EventHandler(p, options);

  return handler;
};
