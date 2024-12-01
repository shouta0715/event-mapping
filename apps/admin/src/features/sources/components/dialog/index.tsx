"use client";

import { Source, SourceInsert } from "@event-mapping/db";
import { Button } from "@event-mapping/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@event-mapping/ui/components/dialog";
import { useMutation } from "@tanstack/react-query";
import { EditIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { createSource, updateSource } from "@/features/sources/api";
import { SourceForm } from "@/features/sources/components/form";

type SourceFormDialogProps = {
  eventId: string;
};

export function SourceFormDialog({ eventId }: SourceFormDialogProps) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const { mutateAsync } = useMutation({
    mutationFn: createSource,
    onSuccess: () => {
      router.refresh();
      setOpen(false);
    },
  });

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
        <SourceForm
          eventId={eventId}
          handleSubmit={mutateAsync}
          messages={{
            loading: "作成中...",
            success: "コンテンツを作成しました。",
            error: "コンテンツを作成できませんでした。",
            submit: "作成する",
          }}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

type SourceEditDialogProps = {
  defaultValues: Source;
};

export function SourceEditDialog({ defaultValues }: SourceEditDialogProps) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const { mutateAsync } = useMutation({
    mutationFn: updateSource,
    onSuccess: () => {
      router.refresh();
      setOpen(false);
    },
  });

  const handleSubmit = async ({ data }: { data: SourceInsert }) => {
    const source: Source = {
      ...defaultValues,
      ...data,
    };
    mutateAsync({ data: source, sourceId: source.id });
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <EditIcon className="size-4" />
          <span className="sr-only">コンテンツを更新</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>コンテンツの更新</DialogTitle>
          <DialogDescription>
            イベントで表示するコンテンツを更新します。
          </DialogDescription>
        </DialogHeader>
        <SourceForm
          defaultValues={defaultValues}
          eventId={defaultValues.event_id}
          handleSubmit={handleSubmit}
          messages={{
            loading: "更新中...",
            success: "コンテンツを更新しました。",
            error: "コンテンツを更新できませんでした。",
            submit: "更新する",
          }}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
