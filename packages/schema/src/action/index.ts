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
  streamingAnswerActionSchema,
  streamingCandidateActionSchema,
  streamingOfferActionSchema,
  uploadImageActionSchema,
} from "@event-mapping/schema/action/admin";
import {
  mouseClickedActionSchema,
  mouseDoubleClickedActionSchema,
  mouseDraggedActionSchema,
  mouseMovedActionSchema,
  mousePressedActionSchema,
  mouseReleasedActionSchema,
  processorActionSchema,
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
  eventStreamingAnswerSchema,
  eventStreamingCandidateSchema,
  eventStreamingOfferSchema,
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
  streamingOfferActionSchema,
  streamingAnswerActionSchema,
  streamingCandidateActionSchema,
  processorActionSchema,
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
  eventStreamingOfferSchema,
  eventStreamingAnswerSchema,
  eventStreamingCandidateSchema,
  processorActionSchema,
  // mouse
  mousePressedActionSchema,
  mouseReleasedActionSchema,
  mouseClickedActionSchema,
  mouseDoubleClickedActionSchema,
  mouseMovedActionSchema,
  mouseDraggedActionSchema,
]);

export type EventAction = z.infer<typeof eventActionSchema>;
