import { z } from "zod";

// 整数に変換
const coerceNumber = z.coerce
  .number({ message: "数値を入力してください" })
  .transform(Math.floor);

/**
 * @description: 端末のデータ
 */
export const terminalDataSchema = z.object({
  id: z.string(),
  sessionId: z.string().cuid2(),
  width: coerceNumber,
  height: coerceNumber,
  windowWidth: coerceNumber,
  windowHeight: coerceNumber,
  displayname: z.string().min(1).max(50),
  startX: coerceNumber,
  startY: coerceNumber,
  endX: coerceNumber,
  endY: coerceNumber,
  scale: coerceNumber,
  margin: z.object({
    top: coerceNumber,
    right: coerceNumber,
    bottom: coerceNumber,
    left: coerceNumber,
  }),
});

/**
 * @description: 端末のデータ
 */
export type TerminalData = z.infer<typeof terminalDataSchema>;
