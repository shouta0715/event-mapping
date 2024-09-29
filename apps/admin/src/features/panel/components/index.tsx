"use client";

import { Event, Source } from "@event-mapping/db";
import {
  Accordion,
  AccordionItem,
} from "@event-mapping/ui/components/accordion";
import { Button } from "@event-mapping/ui/components/button";
import { useNodes } from "@xyflow/react";
import copy from "copy-to-clipboard";
import { Clipboard, ClipboardCheck } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { NodePanel } from "@/features/node-panel/components";
import { IconPanel } from "@/features/panel/components/icon";
import { NodeType } from "@/global/store/types";
import { useNodeHandler } from "@/hooks/node";
import { useOnline } from "@/hooks/online";
import { assertTerminalNode } from "@/utils";

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

  const nodes = useNodes<NodeType>();
  const { node: selectedNodeId } = useNodeHandler();

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
      <Accordion defaultValue={[selectedNodeId ?? ""]} type="multiple">
        {nodes.map((node) => {
          if (!assertTerminalNode(node)) return null;

          const data = {
            ...node.data,
            width: node.width ?? 1920,
            height: node.height ?? 1080,
            startX: Math.floor(node.position.x ?? 0),
            startY: Math.floor(node.position.y ?? 0),
          };

          return (
            <AccordionItem key={node.id} value={node.id}>
              <NodePanel
                data={data}
                isSelected={node.id === selectedNodeId}
                nodeId={node.id}
              />
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
