import globalConfig from "@event-mapping/tailwind-config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "presets" | "content"> = {
  content: ["./index.html"],
  presets: [globalConfig],
};

export default config;
