"use client";

import { TerminalData } from "@event-mapping/schema";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@event-mapping/ui/components/context-menu";
import { Lock, TimerReset, Unlock } from "lucide-react";
import React from "react";
import { useTerminalMenu } from "@/features/terminal-menu/hooks";

type TerminalMenuProps = {
  data: TerminalData;
  id: string;
  keepAspectRatio: boolean;
  toggleKeepAspectRatio: () => void;
};

export const TerminalMenu = ({
  data,
  id,
  keepAspectRatio,
  toggleKeepAspectRatio,
}: TerminalMenuProps) => {
  const { handleResetSize } = useTerminalMenu({
    data,
    id,
  });

  return (
    <ContextMenuContent>
      <ContextMenuItem className="cursor-pointer" onClick={handleResetSize}>
        <TimerReset className="mr-2 size-4" />
        デフォルトのサイズに戻す
      </ContextMenuItem>
      <ContextMenuSeparator />
      <p className="px-2 py-1 text-sm text-muted-foreground">端末の変更設定</p>
      <ContextMenuItem
        className="cursor-pointer"
        onClick={toggleKeepAspectRatio}
      >
        {keepAspectRatio ? (
          <Lock className="mr-2 size-4 text-primary" />
        ) : (
          <Unlock className="mr-2 size-4" />
        )}
        アスペクト比を{keepAspectRatio ? "解除" : "固定"}する
        <span className="text-xs text-muted-foreground">
          （{keepAspectRatio ? "固定中" : "解除中"}）
        </span>
      </ContextMenuItem>
    </ContextMenuContent>
  );
};
