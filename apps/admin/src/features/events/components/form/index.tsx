"use client";

import { EventInsert, eventInsertSchema } from "@event-mapping/db";
import { Button } from "@event-mapping/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@event-mapping/ui/components/form";
import { Input } from "@event-mapping/ui/components/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ToastError } from "@/components/error";
import { createEvent } from "@/features/events/api";

type EventFormProps = {
  onClose: () => void;
};

export function EventForm({ onClose }: EventFormProps) {
  const router = useRouter();
  const form = useForm<EventInsert>({
    resolver: zodResolver(eventInsertSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      router.refresh();
      onClose();
    },
  });

  const onSubmit = async (data: EventInsert) => {
    toast.promise(mutateAsync(data), {
      loading: "作成中...",
      success: () => {
        return "イベントを作成しました。";
      },
      // eslint-disable-next-line react/no-unstable-nested-components
      error: (error) => {
        return (
          <ToastError error={error} title="イベントを作成できませんでした。" />
        );
      },
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>イベント名</FormLabel>
                <FormControl>
                  <Input placeholder="イベント名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>識別子</FormLabel>
                <FormControl>
                  <Input placeholder="識別子" {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription className="text-xs">
                  識別子はURLに使用されます。
                  <br />
                  英数字とハイフン、アンダースコアのみ使用できます。
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between">
          <Button onClick={onClose} type="button" variant="outline">
            キャンセル
          </Button>
          <Button type="submit">作成する</Button>
        </div>
      </form>
    </Form>
  );
}
