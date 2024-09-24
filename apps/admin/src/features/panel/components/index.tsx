"use client";

import { Event, Source } from "@event-mapping/db";
import { Button } from "@event-mapping/ui/components/button";
import copy from "copy-to-clipboard";
import { Clipboard, ClipboardCheck } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { IconPanel } from "@/features/panel/components/icon";
import { useOnline } from "@/hooks/online";

type Props = {
  event: Event;
  source: Source;
};

const IdPanel = ({ id, label }: { id: string; label: string }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = () => {
    copy(id);
    setCopied(true);
  };

  useEffect(() => {
    const t = timer.current;

    return () => {
      if (!t) return;
      clearTimeout(t);
    };
  }, []);

  return (
    <div className="items-center text-sm text-muted-foreground ">
      <span className="font-semibold text-black">{label}</span>
      <p className="flex items-center">
        <span className="line-clamp-1 font-mono">{id}</span>
        <Button
          className="relative ml-2 shrink-0 text-xs text-muted-foreground"
          onClick={handleCopy}
          size="icon"
          type="button"
          variant="ghost"
        >
          {copied && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-green-600">
              Copied!
            </span>
          )}
          {copied ? (
            <>
              <ClipboardCheck className="rotate-12 text-green-600" />
              <span className="sr-only">{id}をコピーしました</span>
            </>
          ) : (
            <>
              <Clipboard />
              <span className="sr-only">{id}をコピーする</span>
            </>
          )}
        </Button>
      </p>
    </div>
  );
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

      <hr className="my-4" />

      <div className="space-y-2">
        <IdPanel id={source.id} label="コンテンツID" />
      </div>

      {/* TODO: 端末一覧を表示する */}
    </div>
  );
}
