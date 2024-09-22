"use client";

import { Event, Source } from "@event-mapping/db";
import React from "react";
import { IconPanel } from "@/features/panel/components/icon";
import { useOnline } from "@/hooks/online";

type Props = {
  event: Event;
  source: Source;
};

export function Panel({ event, source }: Props) {
  const isOnline = useOnline();

  return (
    <div>
      <IconPanel event={event} isOnline={isOnline} source={source} />
      <div className="mt-4">
        <div>
          <h1 className="line-clamp-1 flex-1 text-xl font-bold">
            {source.name}
          </h1>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {event.name}
        </p>
      </div>

      {/* TODO: 端末一覧を表示する */}
    </div>
  );
}
