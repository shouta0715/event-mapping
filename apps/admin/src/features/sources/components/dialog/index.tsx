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
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import {
  createSource,
  deleteSource,
  updateSource,
} from "@/features/sources/api";
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

type SourceDeleteDialogProps = {
  sourceId: string;
  name: string;
};

export function SourceDeleteDialog({
  sourceId,
  name,
}: SourceDeleteDialogProps) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const { mutateAsync } = useMutation({
    mutationFn: deleteSource,
    onSuccess: () => {
      router.refresh();
      toast.success("コンテンツを削除しました。");
      setOpen(false);
    },
    onError: () => {
      toast.error("コンテンツを削除できませんでした。");
    },
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive">
          <TrashIcon className="size-4" />
          <span className="sr-only">コンテンツを削除</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>コンテンツの削除</DialogTitle>
          <DialogDescription>
            <span className="mr-2 inline-block rounded-md bg-muted px-4 py-0.5 font-semibold text-destructive">
              {name}
            </span>
            を削除します。この操作は取り消せません。
          </DialogDescription>
        </DialogHeader>
        <div className="mt-10 flex justify-between">
          <Button onClick={() => setOpen(false)} variant="outline">
            キャンセル
          </Button>
          <Button onClick={() => mutateAsync(sourceId)} variant="destructive">
            削除する
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
