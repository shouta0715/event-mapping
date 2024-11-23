"use client";

import { Event, Source } from "@event-mapping/db";

import { useAtomValue } from "jotai/react";
import { ArrowLeft, Clapperboard, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import React from "react";
import { LoadingIcon } from "@/components/animation";
import { IconTooltip } from "@/components/icon-tooltip";
import { IS_DEVELOPMENT } from "@/env";
import { Status, useWSStatus } from "@/features/websocket/components";
import { HealthCheckStatus, isHealthyAtom } from "@/global/health-check";

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

const iframeStatusText: Record<HealthCheckStatus, string> = {
  connecting: "接続状態を確認中...",
  open: "正常に接続されています。",
  closed: "接続が解除されました。",
};

const iframeStatusIcon: Record<HealthCheckStatus, React.ReactNode> = {
  connecting: (
    <LoadingIcon aria-labelledby="status-text" className="text-blue-600" />
  ),
  open: <Wifi className="size-6 text-blue-600" />,
  closed: <WifiOff className="size-6 text-red-500" />,
};

export function IconPanel({ event, source, isOnline }: Props) {
  const { status } = useWSStatus();
  const isHealthy = useAtomValue(isHealthyAtom);

  return (
    <div className="-mx-2 flex items-center justify-between">
      <IconTooltip asChild text="イベント一覧">
        <Link
          className="flex items-center rounded-md p-2 transition-colors hover:bg-muted"
          href={`/events/${event.slug}`}
        >
          <ArrowLeft className="size-6" />
        </Link>
      </IconTooltip>

      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1">
          <IconTooltip text={iframeStatusText[isHealthy]}>
            {iframeStatusIcon[isHealthy]}
          </IconTooltip>
          <span className="text-xs text-orange-500">iframe</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <IconTooltip text={statusText[isOnline ? status : "closed"]}>
            {statusIcon[isOnline ? status : "closed"]}
          </IconTooltip>
          <span className="text-xs text-orange-500">websocket</span>
        </div>

        <IconTooltip asChild text="コンテンツを開く">
          <a
            href={IS_DEVELOPMENT ? source.dev_url : source.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Clapperboard className="size-6" />
          </a>
        </IconTooltip>
      </div>
    </div>
  );
}
