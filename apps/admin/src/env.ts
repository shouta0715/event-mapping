/* eslint-disable n/no-process-env */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    /**
     * APIのエンドポイント
     */
    NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:8787"),
    /**
     * WebSocketのエンドポイント
     */
    NEXT_PUBLIC_WS_URL: z.string().url().default("ws://localhost:8787"),
    /**
     * NODE_ENV
     */
    NEXT_PUBLIC_NODE_ENV: z.enum(["development", "production", "test"]),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
  },
});

export const IS_DEVELOPMENT = env.NEXT_PUBLIC_NODE_ENV === "development";
