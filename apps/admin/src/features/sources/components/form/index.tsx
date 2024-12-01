/* eslint-disable react/no-unstable-nested-components */

"use client";

import { SourceInsert, sourceInsertSchema } from "@event-mapping/db";
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
import React from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ToastError } from "@/components/error";

type SourceFormProps = {
  onClose: () => void;
  eventId: string;
  defaultValues?: DefaultValues<SourceInsert>;
  handleSubmit: ({
    data,
  }: {
    data: SourceInsert;
    eventId: string;
  }) => Promise<unknown>;
  messages: {
    loading: string;
    success: string;
    error: string;
    submit: string;
  };
};

const fallbackDefaultValues: DefaultValues<SourceInsert> = {
  name: "",
  slug: "",
  url: "",
  dev_url: "",
  width: 1920,
  height: 1080,
};

export function SourceForm({
  eventId,
  defaultValues,
  onClose,
  handleSubmit,
  messages,
}: SourceFormProps) {
  const form = useForm<SourceInsert>({
    resolver: zodResolver(sourceInsertSchema),
    defaultValues: {
      ...fallbackDefaultValues,
      ...defaultValues,
    },
  });

  const onSubmit = async (data: SourceInsert) => {
    toast.promise(handleSubmit({ data, eventId }), {
      loading: messages.loading,
      success: messages.success,
      error: (error) => <ToastError error={error} title={messages.error} />,
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>コンテンツ名</FormLabel>
                <FormControl>
                  <Input placeholder="コンテンツの名前" {...field} />
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
          <div>
            <div className="flex gap-x-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>本番用URL</FormLabel>
                    <FormControl>
                      <Input placeholder="本番用URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dev_url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>開発用URL</FormLabel>
                    <FormControl>
                      <Input placeholder="開発用URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              iframeに表示するコンテンツのURLを入力してください。
            </p>
          </div>
          <div className="flex gap-x-4">
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel required={false}>コンテンツの初期幅</FormLabel>
                  <FormControl>
                    <Input placeholder="1920" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-xs">
                    コンテンツの初期幅を入力してください。
                    <br />
                    iframeの幅に利用されます。
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel required={false}>コンテンツの初期高さ</FormLabel>
                  <FormControl>
                    <Input placeholder="1080" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="text-xs">
                    コンテンツの初期高さを入力してください。
                    <br />
                    iframeの高さに利用されます。
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button onClick={onClose} type="button" variant="outline">
            キャンセル
          </Button>
          <Button type="submit">{messages.submit}</Button>
        </div>
      </form>
    </Form>
  );
}
