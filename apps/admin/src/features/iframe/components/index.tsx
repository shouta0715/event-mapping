"use client";

import { Button } from "@event-mapping/ui/components/button";
import { cn } from "@event-mapping/ui/lib/utils";
import { NodeProps, NodeResizer, OnResizeEnd } from "@xyflow/react";
import React, { memo, useId } from "react";
import { toast } from "sonner";
import { useComlink } from "@/features/iframe/hooks";
import { IframeNode as TIframeNode } from "@/features/iframe/types";
import { useUpdateIframeData } from "@/hooks/iframe";
import { useNodeHandler } from "@/hooks/node";

type IframeProps = React.ComponentPropsWithoutRef<"iframe">;
export const Iframe = memo(
  React.forwardRef<HTMLIFrameElement, IframeProps>((props, ref) => {
    const title = useId();

    return (
      <iframe
        ref={ref}
        sandbox="allow-scripts allow-same-origin"
        title={title}
        {...props}
      />
    );
  })
);

export const IframeNode = memo(
  ({ data, width, height, id }: NodeProps<TIframeNode>) => {
    const { getIsNodeSelected } = useNodeHandler();

    const isSelected = getIsNodeSelected(id);

    const { mutate } = useUpdateIframeData();
    const { iframeRef, handleResize, handleOnload, handleRestart, refreshKey } =
      useComlink({
        url: data.url,
        dev_url: data.dev_url,
        global: { width: width ?? 0, height: height ?? 0 },
      });

    const handleResizeEnd: OnResizeEnd = async (_, params) => {
      mutate({ data: { ...data, width: params.width, height: params.height } });
      await handleResize(params.width, params.height);
    };

    return (
      <div className="group relative size-full">
        <NodeResizer
          handleStyle={{
            width: 32,
            height: 32,
            zIndex: 9999,
            backgroundColor: "hsl(var(--background))",
            borderWidth: 2,
            borderColor: isSelected
              ? "hsl(var(--primary))"
              : "hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
          lineStyle={{
            borderWidth: isSelected ? 6 : 4,
            borderColor: isSelected
              ? "hsl(var(--primary))"
              : "hsl(var(--border))",
          }}
          onResizeEnd={handleResizeEnd}
        />
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 z-10 size-full bg-white/70 opacity-0 transition-opacity group-hover:opacity-100",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          className={cn(
            "absolute left-1/2 z-20 h-full w-0.5 -translate-x-1/2 bg-destructive opacity-0 transition-opacity group-hover:opacity-100",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="relative top-1/3 ml-10 w-fit rounded-md bg-primary px-4 py-2 text-4xl text-white">
            {height}px
          </div>
        </div>

        <div
          className={cn(
            "absolute left-1/2 top-1/2 z-20 h-0.5 w-full -translate-x-1/2 -translate-y-1/2 bg-destructive opacity-0 transition-opacity group-hover:opacity-100",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="relative left-1/3 mt-10 w-fit rounded-md bg-primary px-4 py-2 text-4xl text-white">
            {width}px
          </div>
        </div>

        <Button
          className={cn(
            "absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100",
            isSelected ? "opacity-100" : "opacity-0"
          )}
          onClick={() =>
            toast.promise(handleRestart(), {
              loading: "再同期中...",
              success: "同期しました。",
              error: "同期を行えませんでした。",
            })
          }
          size="lg"
        >
          再同期
        </Button>

        <Iframe
          key={refreshKey}
          ref={iframeRef}
          className="pointer-events-none absolute inset-0 -z-50 size-full cursor-not-allowed"
          onLoad={handleOnload}
        />
        <div
          className={cn(
            "absolute -bottom-32 left-1/2 z-10 flex -translate-x-1/2 flex-col gap-2 rounded-md border-primary bg-primary px-4 py-2 text-4xl text-white opacity-0 transition-opacity group-hover:opacity-100",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        >
          <p>
            <span className="inline-block w-32 font-semibold">Width</span>
            {width?.toFixed(0)}
            px
          </p>
          <p>
            <span className="inline-block w-32 font-semibold">Height</span>
            {height?.toFixed(0)}px
          </p>
        </div>
      </div>
    );
  }
);
