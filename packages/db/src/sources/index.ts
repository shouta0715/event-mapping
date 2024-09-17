import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";
import { sources } from "src/schema";

const sourceInsertSchema = createInsertSchema(sources, {
  url: z
    .string()
    .min(1, { message: "必須入力です。" })
    .url({ message: "URLの形式が正しくありません。" }),
  slug: z
    .string()
    .min(1, { message: "必須入力です。" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "英数字とハイフン、アンダースコアのみ使用できます。",
    }),
  dev_url: z
    .string()
    .min(1, { message: "必須入力です。" })
    .url({ message: "URLの形式が正しくありません。" }),
  width: z.number().min(1, { message: "整数を入力してください。" }),
  height: z.number().min(1, { message: "整数を入力してください。" }),
}).pick({ url: true, dev_url: true, width: true, height: true });

type SourceInsert = z.infer<typeof sourceInsertSchema>;
type Source = typeof sources.$inferSelect;

export { sourceInsertSchema };
export { type SourceInsert, type Source };
