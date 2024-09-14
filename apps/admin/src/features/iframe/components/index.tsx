"use client";

import { cn } from "@event-mapping/ui/lib/utils";
import { NodeProps, NodeResizer } from "@xyflow/react";
import React, { memo, useId } from "react";
import { IframeNode as TIframeNode } from "@/features/iframe/types";
import { useNodeHandler } from "@/hooks/node";

export const IframeNode = memo(
  ({ data, width, height, id }: NodeProps<TIframeNode>) => {
    const title = useId();
    const { getIsNodeSelected } = useNodeHandler();

    const isSelected = getIsNodeSelected(id);

    return (
      <div className="group relative size-full">
        <NodeResizer
          handleStyle={{
            width: 32,
            height: 32,
            zIndex: 9999,
            backgroundColor: "hsl(var(--background))",
            borderWidth: 2,
            borderColor: "hsl(var(--primary))",
            borderRadius: "var(--radius)",
          }}
          lineStyle={{
            borderWidth: 4,
            borderColor: "hsl(var(--border))",
          }}
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
          <div className="relative top-1/3 ml-10 w-fit rounded-md bg-indigo-600 px-4 py-2 text-4xl text-white">
            {height}px
          </div>
        </div>

        <div
          className={cn(
            "absolute left-1/2 top-1/2 z-20 h-0.5 w-full -translate-x-1/2 -translate-y-1/2 bg-destructive opacity-0 transition-opacity group-hover:opacity-100",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="relative left-1/3 mt-10 w-fit rounded-md bg-indigo-600 px-4 py-2 text-4xl text-white">
            {width}px
          </div>
        </div>

        <iframe
          className="pointer-events-none absolute inset-0 -z-50 size-full cursor-not-allowed"
          sandbox="allow-scripts allow-same-origin"
          src={data.url}
          title={title}
        />
        <div
          className={cn(
            "absolute -bottom-32 left-1/2 z-10 flex -translate-x-1/2 flex-col gap-2 rounded-md border-indigo-600 bg-indigo-600 px-4 py-2 text-4xl text-white opacity-0 transition-opacity group-hover:opacity-100",
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
