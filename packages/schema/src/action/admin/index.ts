import z from "zod";
import { terminalDataSchema } from "@event-mapping/schema/terminal";

export const adminWarningSchema = z.object({
  action: z.literal("warning"),
  message: z.string(),
});

export type AdminWarning = z.infer<typeof adminWarningSchema>;

/**
 * adminの初期化時にに送信される
 */
export const initializeActionSchema = z.object({
  action: z.literal("initialize"),
  sessions: z.array(terminalDataSchema),
});

export type InitializeAction = z.infer<typeof initializeActionSchema>;

/**
 * ユーザーが参加した時に管理画面に送信される
 */
export const joinActionSchema = z.object({
  action: z.literal("join"),
  data: terminalDataSchema,
});

export type JoinAction = z.infer<typeof joinActionSchema>;

/**
 * ユーザーが退出した時に管理画面に送信される
 */
export const leaveActionSchema = z.object({
  action: z.literal("leave"),
  sessionId: z.string(),
});

export type LeaveAction = z.infer<typeof leaveActionSchema>;

export const uploadImageActionSchema = z.object({
  action: z.literal("uploadImage"),
  data: z.object({
    id: z.string(),
    timestamp: z.number(),
  }),
});

export type UploadImageAction = z.infer<typeof uploadImageActionSchema>;

export const moveVertexActionSchema = z.object({
  action: z.literal("moveVertex"),
  data: z.object({
    id: z.string(),
    positions: z
      .array(
        z.object({
          x: z.number(),
          y: z.number(),
        })
      )
      .length(4),
    selectedIndex: z.number(),
  }),
});

export type MoveVertexAction = z.infer<typeof moveVertexActionSchema>;

export const enterShapeActionSchema = z.object({
  action: z.literal("enterShape"),
  data: z.object({
    rectId: z.string(),
    id: z.string(),
    size: z.object({
      w: z.number(),
      h: z.number(),
    }),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
    velocity: z.object({
      x: z.number(),
      y: z.number(),
    }),
    meta: z.record(z.any()),
  }),
});

export type EnterShapeAction = z.infer<typeof enterShapeActionSchema>;

export const leaveShapeActionSchema = z.object({
  action: z.literal("leaveShape"),
  data: z.object({
    id: z.string(),
    rectId: z.string(),
  }),
});

export type LeaveShapeAction = z.infer<typeof leaveShapeActionSchema>;

export const promptActionSchema = z.object({
  action: z.literal("prompt"),
  data: z.object({
    timestamp: z.number(),
  }),
});

export type PromptAction = z.infer<typeof promptActionSchema>;

export const moveShapeActionSchema = z.object({
  action: z.literal("moveShape"),
  data: z.object({
    rectId: z.string(),
    id: z.string(),
    x: z.number(),
    y: z.number(),
    meta: z.record(z.any()),
  }),
});

export type MoveShapeAction = z.infer<typeof moveShapeActionSchema>;
