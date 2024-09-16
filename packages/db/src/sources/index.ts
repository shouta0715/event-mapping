import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";
import { sources } from "src/schema";

const sourceInsertSchema = createInsertSchema(sources, {
  url: z.string().min(1).url({ message: "URLの形式が正しくありません。" }),
  dev_url: z.string().min(1).url({ message: "URLの形式が正しくありません。" }),
  width: z.number().min(1, { message: "1以上の正の整数を入力してください。" }),
  height: z.number().min(1, { message: "1以上の正の整数を入力してください。" }),
}).pick({ url: true, dev_url: true, width: true, height: true });

type SourceInsert = z.infer<typeof sourceInsertSchema>;
type Source = typeof sources.$inferSelect;

export { sourceInsertSchema };
export { type SourceInsert, type Source };
