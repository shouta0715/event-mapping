/* eslint-disable turbo/no-undeclared-env-vars */
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_API_URL: z.string().url(),
    VITE_WS_URL: z.string().url(),
    VITE_SOURCE_ID: z.string().cuid2(),
  },
  runtimeEnv: {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_WS_URL: import.meta.env.VITE_WS_URL,
    VITE_SOURCE_ID: import.meta.env.VITE_SOURCE_ID,
  },
});
