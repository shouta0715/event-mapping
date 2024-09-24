/* eslint-disable turbo/no-undeclared-env-vars */
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    /**
     * APIのURL
     */
    VITE_API_URL: z.string().url(),
    /**
     * WebSocketのURL
     */
    VITE_WS_URL: z.string().url(),
    /**
     * コンテンツのID（管理画面から取得）
     */
    VITE_SOURCE_ID: z.string().cuid2(),
  },
  runtimeEnv: {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_WS_URL: import.meta.env.VITE_WS_URL,
    VITE_SOURCE_ID: import.meta.env.VITE_SOURCE_ID,
  },
});
