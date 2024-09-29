import { cn } from "@event-mapping/ui/lib/utils";
import { NodeProps, NodeResizer, OnResizeEnd } from "@xyflow/react";
import React, { memo } from "react";
import { TerminalNode as TTerminalNode } from "@/global/store/types";
import { useNodeHandler, useUpdateNodeData } from "@/hooks/node";

export const TerminalNode = memo(
  ({ data, id, width, height }: NodeProps<TTerminalNode>) => {
    const { getIsNodeSelected } = useNodeHandler();
    const { mutate } = useUpdateNodeData();

    const isSelected = getIsNodeSelected(id);

    const handleResizeEnd: OnResizeEnd = (_, params) => {
      const newData = {
        ...data,
        startX: params.x,
        startY: params.y,
        width: params.width,
        height: params.height,
      };
      mutate({
        nodeId: id,
        data: newData,
      });
    };

    return (
      <div
        className={cn(
          "group",
          isSelected ? "bg-background/80" : "bg-background/40"
        )}
        style={{ width, height }}
      >
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
            borderWidth: isSelected ? 6 : 4,
            borderColor: isSelected
              ? "hsl(var(--primary))"
              : "hsl(var(--border))",
          }}
          onResizeEnd={handleResizeEnd}
        />

        <div className="flex size-full items-center justify-center">
          <div
            className="relative size-full"
            style={{
              paddingTop: data.margin.top,
              paddingRight: data.margin.right,
              paddingBottom: data.margin.bottom,
              paddingLeft: data.margin.left,
            }}
          >
            <div className="size-full bg-primary/50 p-10">
              <p className="text-center text-4xl font-semibold">
                <span className="font-semibold text-white">
                  {data.displayname}
                </span>
              </p>
              <div className="flex size-full items-center justify-center">
                <div className="flex flex-col gap-10 text-4xl text-white">
                  <p className="flex flex-col items-center gap-2 font-semibold">
                    倍率
                    <span className="tabular-nums">{data.scale}倍</span>
                  </p>
                </div>
              </div>
            </div>

            {/* margin top */}
            {data.margin.top > 0 && (
              <div
                className={cn(
                  "absolute left-1/2 top-0 w-0.5 transition-opacity -translate-x-1/2 bg-destructive",
                  isSelected
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                )}
                style={{
                  height: data.margin.top,
                }}
              >
                <div className="relative top-1/2 w-fit -translate-y-1/2 pl-4 text-lg font-semibold">
                  {data.margin.top}px
                </div>
              </div>
            )}

            {/* margin bottom */}
            {data.margin.bottom > 0 && (
              <div
                className={cn(
                  "absolute bottom-0 left-1/2 w-0.5 transition-opacity -translate-x-1/2 bg-destructive",
                  isSelected
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                )}
                style={{
                  height: data.margin.bottom,
                }}
              >
                <div className="relative top-1/2 w-fit -translate-y-1/2 pl-4 text-lg font-semibold">
                  {data.margin.bottom}px
                </div>
              </div>
            )}

            {/* margin left */}
            {data.margin.left > 0 && (
              <div
                className={cn(
                  "absolute left-0 top-1/2 h-0.5 transition-opacity -translate-y-1/2 bg-destructive",
                  isSelected
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                )}
                style={{
                  width: data.margin.left,
                }}
              >
                <div className="relative left-1/2 mt-4 w-fit -translate-x-1/2 text-lg font-semibold">
                  {data.margin.left}px
                </div>
              </div>
            )}

            {/* margin right */}
            {data.margin.right > 0 && (
              <div
                className={cn(
                  "absolute right-0 top-1/2 h-0.5 transition-opacity -translate-y-1/2 bg-destructive",
                  isSelected
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                )}
                style={{
                  width: data.margin.right,
                }}
              >
                <div className="relative left-1/2 mt-4 w-fit -translate-x-1/2 text-lg font-semibold">
                  {data.margin.right}px
                </div>
              </div>
            )}
          </div>
        </div>

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
