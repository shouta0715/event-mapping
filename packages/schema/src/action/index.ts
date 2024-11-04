import z from "zod";
import {
  adminWarningSchema,
  initializeActionSchema,
  joinActionSchema,
  leaveActionSchema,
  moveVertexActionSchema,
  uploadImageActionSchema,
} from "@event-mapping/schema/action/admin";
import {
  eventDeleteSchema,
  eventInitializeSchema,
  eventMoveVertexSchema,
  eventRestartSchema,
  eventUpdateGlobalSchema,
  eventUpdateSchema,
  eventUploadImageSchema,
  eventWarningSchema,
} from "@event-mapping/schema/action/event";

export * from "@event-mapping/schema/action/admin";
export * from "@event-mapping/schema/action/event";

export const adminActionSchema = z.union([
  initializeActionSchema,
  joinActionSchema,
  leaveActionSchema,
  uploadImageActionSchema,
  adminWarningSchema,
  moveVertexActionSchema,
]);

export type AdminAction = z.infer<typeof adminActionSchema>;

export const eventActionSchema = z.union([
  eventWarningSchema,
  eventInitializeSchema,
  eventUpdateSchema,
  eventUpdateGlobalSchema,
  eventRestartSchema,
  eventUploadImageSchema,
  eventMoveVertexSchema,
  eventDeleteSchema,
]);

export type EventAction = z.infer<typeof eventActionSchema>;
