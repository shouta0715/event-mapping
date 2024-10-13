import { z } from "zod";

export const globalDataSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export type GlobalData = z.infer<typeof globalDataSchema>;
