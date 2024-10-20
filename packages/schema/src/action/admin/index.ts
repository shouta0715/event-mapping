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
  id: z.string(),
});

export type UploadImageAction = z.infer<typeof uploadImageActionSchema>;
