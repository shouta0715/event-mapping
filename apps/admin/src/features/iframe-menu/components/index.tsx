"use client";

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
} from "@event-mapping/ui/components/context-menu";
import { ExternalLink, Move, RefreshCcw } from "lucide-react";
import React from "react";
import { IframeNodeData } from "@/features/iframe/types";
import { useIframeMenu } from "@/features/iframe-menu/hooks";

type Props = {
  onRestart: () => Promise<void>;
  data: IframeNodeData;
};

export function IframeMenu({ onRestart, data }: Props) {
  const { handleCenter, handleOpenContent, handleRestart } = useIframeMenu({
    onRestart,
    data,
  });

  return (
    <ContextMenuContent className="w-72">
      <ContextMenuItem className="cursor-pointer" onClick={handleRestart}>
        <RefreshCcw className="mr-2 size-4" />
        コンテンツを同期する
        <ContextMenuShortcut>⇧+⌘+R</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem className="cursor-pointer" onClick={handleCenter}>
        <Move className="mr-2 size-4" />
        真ん中に移動する
        <ContextMenuShortcut>⌘+M</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem className="cursor-pointer" onClick={handleOpenContent}>
        <ExternalLink className="mr-2 size-4 " />
        コンテンツを開く
        <ContextMenuShortcut>⇧+⌘+O</ContextMenuShortcut>
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
