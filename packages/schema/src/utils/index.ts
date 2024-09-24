import {
  AdminAction,
  adminActionSchema,
  EventAction,
  eventActionSchema,
} from "@event-mapping/schema/action";

export const parseActionMessage = <T extends "admin" | "event">(
  type: T,
  message: unknown
): (T extends "admin" ? AdminAction : EventAction) | null => {
  if (typeof message !== "string") return null;

  const jsonV = JSON.parse(message);

  const schema = type === "admin" ? adminActionSchema : eventActionSchema;

  const parsed = schema.safeParse(jsonV);

  if (!parsed.success) return null;

  return parsed.data as T extends "admin" ? AdminAction : EventAction;
};
