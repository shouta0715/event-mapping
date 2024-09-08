import globalConfig from "@event-mapping/tailwind-config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "presets" | "content"> = {
  content: ["./src/**/*.tsx"],
  presets: [globalConfig],
};

export default config;
