import globalConfig from "@event-mapping/tailwind-config";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Pick<Config, "presets" | "content" | "theme"> = {
  content: ["src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-zen-kaku-gothic)", ...defaultTheme.fontFamily.sans],
      },
      minHeight: {
        screen: "100dvh",
      },
      height: {
        screen: "100dvh",
      },
    },
  },
  presets: [globalConfig],
};

export default config;
