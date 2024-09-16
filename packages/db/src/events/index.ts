import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";
import { events, sources } from "src/schema";

const eventInsertSchema = createInsertSchema(events, {
  name: z
    .string({ message: "名前は1文字以上255文字以下で入力してください" })
    .min(1, { message: "名前は1文字以上255文字以下で入力してください" })
    .max(255, { message: "名前は1文字以上255文字以下で入力してください" }),
}).pick({ name: true });

type EventInsert = z.infer<typeof eventInsertSchema>;
type Event = typeof events.$inferSelect;

type EventWithSources = typeof events.$inferSelect & {
  sources: (typeof sources.$inferSelect)[];
};

export { eventInsertSchema };
export { type EventInsert, type Event, type EventWithSources };
