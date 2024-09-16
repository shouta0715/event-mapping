import { cn } from "@event-mapping/ui/lib/utils";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@event-mapping/ui/global.css";
import "./globals.css";

const robot = Roboto({
  display: "swap",
  weight: ["400", "500", "700"],
  preload: false,
  variable: "--font-roboto",
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
          robot.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
