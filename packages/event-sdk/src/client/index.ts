import p5 from "p5";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { EventClientOptions } from "@event-mapping/event-sdk/types";

export const createEventClient = <
  TMeta extends Record<string, unknown> = Record<string, unknown>,
>(
  p: p5,
  options: EventClientOptions
) => {
  const isIframe = window.self !== window.top;

  const handler = isIframe
    ? new AdminHandler<TMeta>(p, options)
    : new EventHandler<TMeta>(p, options);

  return handler;
};
