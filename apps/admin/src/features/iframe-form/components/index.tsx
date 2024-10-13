"use client";

import { SourceInsert, sourceInsertSchema } from "@event-mapping/db";
import { Button } from "@event-mapping/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@event-mapping/ui/components/form";
import { Input } from "@event-mapping/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateIframeData } from "@/hooks/iframe";

type IframeFormProps = {
  defaultValues: SourceInsert;
};

export function IframeForm({ defaultValues }: IframeFormProps) {
  const form = useForm<SourceInsert>({
    resolver: zodResolver(sourceInsertSchema),
    defaultValues,
  });

  const { mutateAsync } = useUpdateIframeData(false);

  const onSubmit = (data: SourceInsert) => {
    toast.promise(mutateAsync({ data }), {
      loading: "更新中...",
      success: "更新しました。",
      error: "更新できませんでした。",
    });
  };

  return (
    <div>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
          {/* コンテンツの幅と高さ */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              コンテンツの幅と高さ
            </p>
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl className="relative">
                      <div>
                        <span className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-xs text-muted-foreground">
                          W
                        </span>
                        <Input placeholder="1920" {...field} className="pl-6" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl className="relative">
                      <div>
                        <span className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-xs text-muted-foreground">
                          H
                        </span>
                        <Input placeholder="1080" {...field} className="pl-6" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="text-center">
            <Button
              className="font-bold"
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
              type="submit"
            >
              変更する
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
