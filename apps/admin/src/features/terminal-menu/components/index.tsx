"use client";

import { TerminalData } from "@event-mapping/schema";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@event-mapping/ui/components/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@event-mapping/ui/components/dialog";
import { Lock, Pointer, TimerReset, Unlock } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";
import { useTerminalMenu } from "@/features/terminal-menu/hooks";

type TerminalMenuProps = {
  data: TerminalData;
  id: string;
  keepAspectRatio: boolean;
  toggleKeepAspectRatio: () => void;
};

const DynamicTerminalMapping = dynamic(
  () => import("@/features/terminal-mapping/components"),
  {
    ssr: false,
    loading: () => (
      <div className="size-full animate-pulse rounded-lg border bg-muted" />
    ),
  }
);

export const TerminalMenu = ({
  data,
  id,
  keepAspectRatio,
  toggleKeepAspectRatio,
}: TerminalMenuProps) => {
  const { handleResetSize, open, setOpen } = useTerminalMenu({
    data,
    id,
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <ContextMenuContent>
        <ContextMenuItem className="cursor-pointer" onClick={handleResetSize}>
          <TimerReset className="mr-2 size-4" />
          デフォルトのサイズに戻す
        </ContextMenuItem>
        <ContextMenuSeparator />
        <p className="px-2 py-1 text-sm text-muted-foreground">
          端末の変更設定
        </p>
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
        <DialogTrigger className="w-full">
          <ContextMenuItem className="cursor-pointer">
            <Pointer className="mr-2 size-4" />
            マッピングを編集する
          </ContextMenuItem>
        </DialogTrigger>
      </ContextMenuContent>

      <DialogContent className="flex h-dvh max-h-none w-dvw max-w-none flex-col overflow-auto rounded-none">
        <DialogHeader>
          <DialogTitle>マッピングを編集する</DialogTitle>
          <DialogDescription>
            マッピングの頂点を編集できます。
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1">
          <DynamicTerminalMapping
            data={data}
            id={id}
            onClose={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
