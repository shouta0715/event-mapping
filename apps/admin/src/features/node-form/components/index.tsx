"use client";

import { TerminalData, terminalDataSchema } from "@event-mapping/schema";
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
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateTerminalData } from "@/features/node-form/api";
import { useTerminalState } from "@/global/store/provider";

type NodeFormProps = {
  defaultValues: Partial<TerminalData>;
  nodeId: string;
  sourceId: string;
};

export function NodeForm({ defaultValues, nodeId, sourceId }: NodeFormProps) {
  const { updateNodeData } = useTerminalState((state) => ({
    updateNodeData: state.updateNodeData,
  }));
  const form = useForm<TerminalData>({
    resolver: zodResolver(terminalDataSchema),
    defaultValues,
  });

  const { mutateAsync } = useMutation({
    mutationFn: updateTerminalData,
    onSuccess: ({ data }) => {
      form.reset(data);
      updateNodeData(nodeId, data);
    },
  });

  const onSubmit = async (data: TerminalData) => {
    toast.promise(mutateAsync({ sourceId, nodeId, data }), {
      loading: "更新中...",
      success: "更新しました。",
      error: "更新できませんでした。",
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        {/* 表示名 */}
        <FormField
          control={form.control}
          name="displayname"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel required>表示名</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* コンテンツの幅と高さ */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">コンテンツの幅と高さ</p>
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl className="relative">
                    <div>
                      <span className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-xs text-muted-foreground">
                        H
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
                        W
                      </span>
                      <Input placeholder="1080" {...field} className="pl-6" />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* ポジションとスケール */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">座標</p>
          <div className="flex items-center space-x-4">
            <FormField
              control={form.control}
              name="startX"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl className="relative">
                    <div>
                      <span className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-xs text-muted-foreground">
                        X
                      </span>
                      <Input placeholder="0" {...field} className="pl-6" />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startY"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl className="relative">
                    <div>
                      <span className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-xs text-muted-foreground">
                        Y
                      </span>
                      <Input placeholder="0" {...field} className="pl-6" />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* マージン */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">マージン</p>
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <FormField
              control={form.control}
              name="margin.top"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl className="relative">
                    <div>
                      <span className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-xs text-muted-foreground">
                        T
                      </span>
                      <Input placeholder="0" {...field} className="pl-6" />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="margin.right"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl className="relative">
                    <div>
                      <span className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-xs text-muted-foreground">
                        R
                      </span>
                      <Input placeholder="0" {...field} className="pl-6" />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="margin.bottom"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl className="relative">
                    <div>
                      <span className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-xs text-muted-foreground">
                        B
                      </span>
                      <Input placeholder="0" {...field} className="pl-6" />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="margin.left"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl className="relative">
                    <div>
                      <span className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-xs text-muted-foreground">
                        L
                      </span>
                      <Input placeholder="0" {...field} className="pl-6" />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* <FormField
          control={form.control}
          name="scale"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel required>スケール</FormLabel>
              <FormControl>
                <Input placeholder="1" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        /> */}

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
  );
}
