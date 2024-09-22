"use client";

import { Event, Source } from "@event-mapping/db";
import { ArrowLeft, Clapperboard, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import React from "react";
import { LoadingIcon } from "@/components/animation";
import { IconTooltip } from "@/components/icon-tooltip";
import { IS_DEVELOPMENT } from "@/env";
import { Status, useWSStatus } from "@/features/websocket/components";

type Props = {
  event: Event;
  source: Source;
  isOnline: boolean;
};

const statusIcon: Record<Status, React.ReactNode> = {
  connecting: (
    <LoadingIcon aria-labelledby="status-text" className="text-blue-600" />
  ),
  open: <Wifi aria-labelledby="status-text" className="text-blue-600" />,
  closing: <WifiOff aria-labelledby="status-text" className="text-red-500" />,
  closed: <WifiOff className="text-red-500" />,
  uninstantiated: (
    <LoadingIcon aria-labelledby="status-text" className="text-blue-600" />
  ),
};

const statusText: Record<Status, string> = {
  connecting: "接続中...",
  open: "正常に接続されています。",
  closing: "接続解除中...",
  closed: "接続が解除されました。",
  uninstantiated: "初期化中...",
};

export function IconPanel({ event, source, isOnline }: Props) {
  const { status } = useWSStatus();

  return (
    <div className="-mx-2 flex items-center justify-between">
      <Link
        className="flex items-center rounded-md p-2 transition-colors hover:bg-muted"
        href={`/events/${event.slug}`}
      >
        <IconTooltip
          icon={<ArrowLeft className="size-6" />}
          text="イベント一覧"
        />
      </Link>

      <div className="flex items-center gap-4">
        <IconTooltip
          icon={statusIcon[isOnline ? status : "closed"]}
          text={statusText[isOnline ? status : "closed"]}
        />
        <a
          className="flex items-center rounded-md p-2 transition-colors hover:bg-muted"
          href={IS_DEVELOPMENT ? source.dev_url : source.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <IconTooltip
            icon={<Clapperboard className="size-6" />}
            text="コンテンツを開く"
          />
        </a>
      </div>
    </div>
  );
}
