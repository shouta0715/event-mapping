import z from "zod";
import {
  adminWarningSchema,
  enterShapeActionSchema,
  initializeActionSchema,
  joinActionSchema,
  leaveActionSchema,
  leaveShapeActionSchema,
  moveVertexActionSchema,
  promptActionSchema,
  uploadImageActionSchema,
} from "@event-mapping/schema/action/admin";
import {
  mouseClickedActionSchema,
  mousePressedActionSchema,
  mouseReleasedActionSchema,
} from "@event-mapping/schema/action/common";
import {
  eventDeleteSchema,
  eventEnterShapeSchema,
  eventInitializeSchema,
  eventLeaveShapeSchema,
  eventMoveVertexSchema,
  eventPromptSchema,
  eventRestartSchema,
  eventUpdateGlobalSchema,
  eventUpdateSchema,
  eventUploadImageSchema,
  eventWarningSchema,
} from "@event-mapping/schema/action/event";

export * from "@event-mapping/schema/action/admin";
export * from "@event-mapping/schema/action/common";
export * from "@event-mapping/schema/action/event";

export const adminActionSchema = z.union([
  initializeActionSchema,
  joinActionSchema,
  leaveActionSchema,
  uploadImageActionSchema,
  adminWarningSchema,
  moveVertexActionSchema,
  enterShapeActionSchema,
  leaveShapeActionSchema,
  promptActionSchema,
  // mouse
  mousePressedActionSchema,
  mouseReleasedActionSchema,
  mouseClickedActionSchema,
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
  eventEnterShapeSchema,
  eventLeaveShapeSchema,
  eventPromptSchema,
  // mouse
  mousePressedActionSchema,
  mouseReleasedActionSchema,
  mouseClickedActionSchema,
]);

export type EventAction = z.infer<typeof eventActionSchema>;
