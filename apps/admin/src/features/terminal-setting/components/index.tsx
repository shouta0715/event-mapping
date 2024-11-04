"use client";

import { TerminalData } from "@event-mapping/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@event-mapping/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@event-mapping/ui/components/dropdown-menu";
import { Ellipsis, Pointer, TimerReset, Trash } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useTerminalMenu } from "@/features/terminal-menu/hooks";
import { useDeleteNode } from "@/hooks/node";

const DynamicTerminalMapping = dynamic(
  () => import("@/features/terminal-mapping/components"),
  {
    ssr: false,
    loading: () => (
      <div className="size-full animate-pulse rounded-lg border bg-muted" />
    ),
  }
);

type TerminalSettingProps = {
  data: TerminalData;
  nodeId: string;
};

export const TerminalSetting = ({ nodeId, data }: TerminalSettingProps) => {
  const { mutate } = useDeleteNode();
  const { handleResetSize } = useTerminalMenu({
    data,
    id: nodeId,
  });
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="shrink-0 pl-4 pr-2" type="button">
            <Ellipsis className="size-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64">
          <DropdownMenuLabel>端末の設定</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            asChild
            className="w-full cursor-pointer"
            onClick={handleResetSize}
          >
            <button className="flex items-center justify-between" type="button">
              デフォルトのサイズに戻す
              <TimerReset className=" size-4" />
            </button>
          </DropdownMenuItem>

          <DialogTrigger className="w-full">
            <DropdownMenuItem className="flex cursor-pointer items-center justify-between">
              マッピングを編集する
              <Pointer className="size-4" />
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <button
              className="flex w-full cursor-pointer items-center justify-between font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => mutate({ nodeId })}
              type="button"
            >
              端末の設定を初期化する
              <Trash className="ml-2 size-4" />
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="flex h-dvh max-h-none w-dvw max-w-none flex-col overflow-auto rounded-none">
        <DialogHeader>
          <DialogTitle>マッピングを編集する</DialogTitle>
          <DialogDescription>
            マッピングの頂点を編集できます。
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1">
          <DynamicTerminalMapping
            key={nodeId}
            data={data}
            id={nodeId}
            onClose={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
