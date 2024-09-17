"use client";

import { Button } from "@event-mapping/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@event-mapping/ui/components/dialog";
import { PlusIcon } from "lucide-react";
import React from "react";
import { SourceForm } from "@/features/sources/components/form";

type SourceFormDialogProps = {
  eventId: string;
};

export function SourceFormDialog({ eventId }: SourceFormDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-x-2" variant="outline">
          <PlusIcon className="size-4" />
          コンテンツを追加
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>コンテンツの作成</DialogTitle>
          <DialogDescription>
            イベントで表示する新しいコンテンツを作成します。
          </DialogDescription>
        </DialogHeader>
        <SourceForm eventId={eventId} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
