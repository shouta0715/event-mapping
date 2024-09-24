import z from "zod";
import {
  adminWarningSchema,
  initializeActionSchema,
  joinActionSchema,
  leaveActionSchema,
} from "@event-mapping/schema/action/admin";
import {
  eventInitializeSchema,
  eventWarningSchema,
} from "@event-mapping/schema/action/event";

export const adminActionSchema = z.union([
  initializeActionSchema,
  joinActionSchema,
  leaveActionSchema,
  adminWarningSchema,
]);

export type AdminAction = z.infer<typeof adminActionSchema>;

export const eventActionSchema = z.union([
  eventWarningSchema,
  eventInitializeSchema,
]);

export type EventAction = z.infer<typeof eventActionSchema>;
