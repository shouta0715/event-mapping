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

export function Panel({ event, source }: Props) {
  const isOnline = useOnline();
  const [copied, setCopied] = useState(false);

  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = () => {
    copy(source.slug);
    setCopied(true);
    timer.current = setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);

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

      <div className="items-center text-sm text-muted-foreground ">
        <span className="font-semibold text-black">識別子</span>
        <p className="flex items-center">
          <span className="font-mono">{source.slug}</span>
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
                <span className="sr-only">{source.slug}をコピーしました</span>
              </>
            ) : (
              <>
                <Clipboard />
                <span className="sr-only">{source.slug}をコピーする</span>
              </>
            )}
          </Button>
        </p>
      </div>

      {/* TODO: 端末一覧を表示する */}
    </div>
  );
}
