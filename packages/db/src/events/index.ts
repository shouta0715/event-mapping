import { createInsertSchema } from "drizzle-zod";
import { events } from "src/schema";

import * as z from "zod";

const eventInsertSchema = createInsertSchema(events, {
  name: z
    .string({ message: "名前は1文字以上255文字以下で入力してください" })
    .min(1, { message: "名前は1文字以上255文字以下で入力してください" })
    .max(255, { message: "名前は1文字以上255文字以下で入力してください" }),
}).pick({ name: true });

type EventInsert = z.infer<typeof eventInsertSchema>;

export { eventInsertSchema, type EventInsert };
