"use client";

import { Button } from "@event-mapping/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@event-mapping/ui/components/dialog";
import { PlusIcon } from "lucide-react";
import React from "react";
import { EventForm } from "@/features/events/components/form";

export function EventFormDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-x-2" variant="outline">
          <PlusIcon className="size-4" />
          イベントを追加
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>イベントの作成</DialogTitle>
        </DialogHeader>
        <EventForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
