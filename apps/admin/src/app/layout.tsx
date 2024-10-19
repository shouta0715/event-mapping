import { cn } from "@event-mapping/ui/lib/utils";
import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import "@event-mapping/ui/global.css";
import "./globals.css";
import { Providers } from "@/components/providers";

const zenkaku = Zen_Kaku_Gothic_New({
  display: "swap",
  weight: ["400", "500", "700"],
  preload: false,
  variable: "--font-zen-kaku-gothic",
});

export const metadata: Metadata = {
  title: "Event Mapping",
  description: "Event Mapping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          zenkaku.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
