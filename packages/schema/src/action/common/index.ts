import { z } from "zod";

const mouseDataSchema = z.object({
  x: z.number(),
  y: z.number(),
  id: z.string(),
});

export const mousePressedActionSchema = z.object({
  action: z.literal("mousePressed"),
  data: mouseDataSchema,
});

export type MousePressedAction = z.infer<typeof mousePressedActionSchema>;

export const mouseReleasedActionSchema = z.object({
  action: z.literal("mouseReleased"),
  data: mouseDataSchema,
});

export type MouseReleasedAction = z.infer<typeof mouseReleasedActionSchema>;

export const mouseClickedActionSchema = z.object({
  action: z.literal("mouseClicked"),
  data: mouseDataSchema,
});

export type MouseClickedAction = z.infer<typeof mouseClickedActionSchema>;

export const mouseDoubleClickedActionSchema = z.object({
  action: z.literal("mouseDoubleClicked"),
  data: mouseDataSchema,
});

export type MouseDoubleClickedAction = z.infer<
  typeof mouseDoubleClickedActionSchema
>;

export const mouseMovedActionSchema = z.object({
  action: z.literal("mouseMoved"),
  data: mouseDataSchema,
});

export type MouseMovedAction = z.infer<typeof mouseMovedActionSchema>;

export const mouseDraggedActionSchema = z.object({
  action: z.literal("mouseDragged"),
  data: mouseDataSchema,
});

export type MouseDraggedAction = z.infer<typeof mouseDraggedActionSchema>;
