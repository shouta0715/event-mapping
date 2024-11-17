import { z } from "zod";
import { globalDataSchema } from "@event-mapping/schema/global";
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

export const eventRestartSchema = z.object({
  action: z.literal("restart"),
  time: z.number(),
});

export type EventRestart = z.infer<typeof eventRestartSchema>;

export const eventUploadImageSchema = z.object({
  action: z.literal("uploadImage"),
  data: z.object({
    id: z.string(),
    timestamp: z.number(),
  }),
});

export type EventUploadImage = z.infer<typeof eventUploadImageSchema>;

export const eventMoveVertexSchema = z.object({
  action: z.literal("moveVertex"),
  data: z.object({
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

export type EventMoveVertex = z.infer<typeof eventMoveVertexSchema>;

export const eventDeleteSchema = z.object({
  action: z.literal("delete"),
  id: z.string(),
});

export type EventDelete = z.infer<typeof eventDeleteSchema>;

export const eventEnterShapeSchema = z.object({
  action: z.literal("enterShape"),
  data: z.object({
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
    meta: z.record(z.unknown()),
  }),
});

export type EventEnterShape = z.infer<typeof eventEnterShapeSchema>;

export const eventLeaveShapeSchema = z.object({
  action: z.literal("leaveShape"),
  data: z.object({
    id: z.string(),
  }),
});

export type EventLeaveShape = z.infer<typeof eventLeaveShapeSchema>;
