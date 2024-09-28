import { z } from "zod";
import { terminalDataSchema } from "@event-mapping/schema/terminal";

/**
 * 警告用のアクション
 */
export const eventWarningSchema = z.object({
  action: z.literal("warning"),
  message: z.string(),
});

export type EventWarning = z.infer<typeof eventWarningSchema>;

export const eventInitializeSchema = z.object({
  action: z.literal("initialize"),
  data: terminalDataSchema,
});

export type EventInitialize = z.infer<typeof eventInitializeSchema>;

export const eventUpdateSchema = z.object({
  action: z.literal("update"),
  data: terminalDataSchema,
});

export type EventUpdate = z.infer<typeof eventUpdateSchema>;
