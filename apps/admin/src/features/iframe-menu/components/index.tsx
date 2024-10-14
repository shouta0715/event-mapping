"use client";

import { SourceInsert } from "@event-mapping/db";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@event-mapping/ui/components/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@event-mapping/ui/components/dialog";
import { ExternalLink, Move, RefreshCcw } from "lucide-react";
import React from "react";
import { IframeNodeData } from "@/features/iframe/types";
import { IframeForm } from "@/features/iframe-form/components";
import { useIframeMenu } from "@/features/iframe-menu/hooks";

type Props = {
  onRestart: () => Promise<void>;
  data: IframeNodeData;
  onSubmitForm: (data: SourceInsert) => void;
};

export function IframeMenu({ onRestart, data, onSubmitForm }: Props) {
  const {
    handleCenter,
    handleOpenContent,
    handleRestart,
    openEditForm,
    setOpenEditForm,
  } = useIframeMenu({
    onRestart,
    data,
  });

  const handleSubmitForm = (d: SourceInsert) => {
    onSubmitForm(d);
    setOpenEditForm(false);
  };

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
        <ContextMenuItem className="cursor-pointer" onClick={handleOpenContent}>
          <ExternalLink className="mr-2 size-4 " />
          コンテンツを開く
          <ContextMenuShortcut>⇧+⌘+O</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />

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
