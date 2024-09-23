import { z } from "zod";

const coerceNumber = z.coerce.number({ message: "数値を入力してください" });

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
  eventWidth: coerceNumber,
  eventHeight: coerceNumber,
  displayname: z.string().min(1).max(50),
  startX: coerceNumber.default(0),
  startY: coerceNumber.default(0),
  endX: coerceNumber.default(0),
  endY: coerceNumber.default(0),
  scale: coerceNumber.default(1),
  margin: z.object({
    top: coerceNumber.default(0),
    right: coerceNumber.default(0),
    bottom: coerceNumber.default(0),
    left: coerceNumber.default(0),
  }),
});

/**
 * @description: 端末のデータ
 */
export type TerminalData = z.infer<typeof terminalDataSchema>;
