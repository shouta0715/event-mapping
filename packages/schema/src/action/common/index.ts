import { z } from "zod";

export const mousePressedActionSchema = z.object({
  action: z.literal("mousePressed"),
  data: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export type MousePressedAction = z.infer<typeof mousePressedActionSchema>;

export const mouseReleasedActionSchema = z.object({
  action: z.literal("mouseReleased"),
  data: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export type MouseReleasedAction = z.infer<typeof mouseReleasedActionSchema>;

export const mouseClickedActionSchema = z.object({
  action: z.literal("mouseClicked"),
  data: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export type MouseClickedAction = z.infer<typeof mouseClickedActionSchema>;
