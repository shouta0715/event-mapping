import z from "zod";
import {
  adminWarningSchema,
  enterShapeActionSchema,
  initializeActionSchema,
  joinActionSchema,
  leaveActionSchema,
  leaveShapeActionSchema,
  moveShapeActionSchema,
  moveVertexActionSchema,
  promptActionSchema,
  uploadImageActionSchema,
} from "@event-mapping/schema/action/admin";
import {
  mouseClickedActionSchema,
  mouseDoubleClickedActionSchema,
  mouseDraggedActionSchema,
  mouseMovedActionSchema,
  mousePressedActionSchema,
  mouseReleasedActionSchema,
} from "@event-mapping/schema/action/common";
import {
  eventDeleteSchema,
  eventEnterShapeSchema,
  eventInitializeSchema,
  eventLeaveShapeSchema,
  eventMoveShapeSchema,
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
  moveShapeActionSchema,
  // mouse
  mousePressedActionSchema,
  mouseReleasedActionSchema,
  mouseClickedActionSchema,
  mouseDoubleClickedActionSchema,
  mouseMovedActionSchema,
  mouseDraggedActionSchema,
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
  eventMoveShapeSchema,
  // mouse
  mousePressedActionSchema,
  mouseReleasedActionSchema,
  mouseClickedActionSchema,
  mouseDoubleClickedActionSchema,
  mouseMovedActionSchema,
  mouseDraggedActionSchema,
]);

export type EventAction = z.infer<typeof eventActionSchema>;
