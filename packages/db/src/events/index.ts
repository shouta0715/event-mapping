import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";
import { events, sources } from "src/schema";

const eventInsertSchema = createInsertSchema(events, {
  name: z
    .string()
    .min(1, { message: "必須入力です。" })
    .max(255, { message: "255文字以内で入力してください。" }),
  slug: z
    .string()
    .min(1, { message: "必須入力です。" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "英数字とハイフン、アンダースコアのみ使用できます。",
    }),
}).pick({ name: true, slug: true });

type EventInsert = z.infer<typeof eventInsertSchema>;
type Event = typeof events.$inferSelect;

type EventWithSources = typeof events.$inferSelect & {
  sources: (typeof sources.$inferSelect)[];
};

export { eventInsertSchema };
export { type EventInsert, type Event, type EventWithSources };
