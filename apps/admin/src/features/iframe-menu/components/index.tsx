"use client";

import { SourceInsert } from "@event-mapping/db";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@event-mapping/ui/components/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@event-mapping/ui/components/dialog";
import {
  ExternalLink,
  Lock,
  Move,
  RefreshCcw,
  SquareTerminal,
  Unlock,
} from "lucide-react";
import React from "react";
import { IframeNodeData } from "@/features/iframe/types";
import { IframeForm } from "@/features/iframe-form/components";
import { useIframeMenu } from "@/features/iframe-menu/hooks";

type Props = {
  onRestart: () => Promise<void>;
  data: IframeNodeData;
  onSubmitForm: (data: SourceInsert) => void;
  keepAspectRatio: boolean;
  setKeepAspectRatio: (keepAspectRatio: boolean) => void;
  handlePrompt: (target: "admin" | "all") => void;
};

export function IframeMenu({
  onRestart,
  data,
  onSubmitForm,
  keepAspectRatio,
  setKeepAspectRatio,
  handlePrompt,
}: Props) {
  const {
    handleCenter,
    handleOpenContent,
    handleRestart,
    openEditForm,
    setOpenEditForm,
    handleSubmitForm,
    toggleKeepAspectRatio,
  } = useIframeMenu({
    onRestart,
    data,
    onSubmitForm,
    keepAspectRatio,
    setKeepAspectRatio,
  });

  return (
    <Dialog onOpenChange={setOpenEditForm} open={openEditForm}>
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
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>
            <SquareTerminal className="mr-2 size-4" />
            プロンプトの実行
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-80">
            <ContextMenuItem
              className="cursor-pointer"
              onClick={() => handlePrompt("admin")}
            >
              管理画面のプロンプトを実行する
              <ContextMenuShortcut>⌘+P</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem
              className="cursor-pointer"
              onClick={() => handlePrompt("all")}
            >
              全端末のプロンプトを実行する
              <ContextMenuShortcut>⇧+⌘+P</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem className="cursor-pointer" onClick={handleOpenContent}>
          <ExternalLink className="mr-2 size-4 " />
          コンテンツを開く
          <ContextMenuShortcut>⇧+⌘+O</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />
        <p className="px-2 py-1 text-sm text-muted-foreground">
          コンテンツの変更設定
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
            コンテンツの設定を編集する
            <ContextMenuShortcut>⌘+E</ContextMenuShortcut>
          </ContextMenuItem>
        </DialogTrigger>
      </ContextMenuContent>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>コンテンツの設定を編集する</DialogTitle>
          <DialogDescription>
            コンテンツのURLやサイズなどを編集できます。
          </DialogDescription>
        </DialogHeader>
        <IframeForm
          key={JSON.stringify(data)}
          defaultValues={data}
          onSubmitForm={handleSubmitForm}
        />
      </DialogContent>
    </Dialog>
  );
}
