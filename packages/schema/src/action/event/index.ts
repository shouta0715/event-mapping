import { z } from "zod";
import { terminalDataSchema } from "@event-mapping/schema/terminal";
import { globalDataSchema } from "@event-mapping/schema/global";

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
  data: z.object({
    terminal: terminalDataSchema,
    global: globalDataSchema,
  }),
});

export type EventInitialize = z.infer<typeof eventInitializeSchema>;

export const eventUpdateSchema = z.object({
  action: z.literal("update"),
  data: terminalDataSchema,
});

export type EventUpdate = z.infer<typeof eventUpdateSchema>;

export const eventUpdateGlobalSchema = z.object({
  action: z.literal("updateGlobal"),
  data: globalDataSchema,
});

export type EventUpdateGlobal = z.infer<typeof eventUpdateGlobalSchema>;
