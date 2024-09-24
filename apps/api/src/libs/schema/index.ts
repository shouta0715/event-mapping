import * as z from "zod";

export const sizeSchema = z.object({
  width: z.coerce.number({ message: "数値を入力してください" }),
  height: z.coerce.number({ message: "数値を入力してください" }),
});
