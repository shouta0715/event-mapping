import p5 from "p5";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import {
  EventClientOptions,
  TTrackingData,
} from "@event-mapping/event-sdk/types";

export const createEventClient = <
  TMeta extends Record<string, unknown> = Record<string, unknown>,
  TrackingData extends TTrackingData = TTrackingData,
>(
  p: p5,
  options: EventClientOptions
) => {
  const isIframe = window.self !== window.top;

  const handler = isIframe
    ? new AdminHandler<TMeta, TrackingData>(p, options)
    : new EventHandler<TMeta, TrackingData>(p, options);

  return handler;
};
