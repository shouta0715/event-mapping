"use client";

import { SourceInsert } from "@event-mapping/db";
import { MAX_IFRAME_SIZE } from "@event-mapping/event-sdk";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@event-mapping/ui/components/context-menu";
import { cn } from "@event-mapping/ui/lib/utils";
import { NodeProps, NodeResizer, OnResizeEnd } from "@xyflow/react";
import React, { memo, useId, useState } from "react";
import { useComlink } from "@/features/iframe/hooks";
import { IframeNode as TIframeNode } from "@/features/iframe/types";

import { IframeMenu } from "@/features/iframe-menu/components";
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

const IframeInfo = memo(
  ({
    width,
    height,
    isSelected,
  }: {
    width: number;
    height: number;
    isSelected: boolean;
  }) => {
    return (
      <>
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
      </>
    );
  }
);

const MAX_WIDTH = MAX_IFRAME_SIZE.width;
const MAX_HEIGHT = MAX_IFRAME_SIZE.height;

export const IframeNode = memo(
  ({ data, width, height, id }: NodeProps<TIframeNode>) => {
    const { getIsNodeSelected } = useNodeHandler();
    const [keepAspectRatio, setKeepAspectRatio] = useState(false);

    const isSelected = getIsNodeSelected(id);

    const {
      iframeRef,
      refreshKey,
      handleResized,
      handleOnload,
      handleRestart,
      handleResize,
    } = useComlink({ data });

    const handleResizeEnd: OnResizeEnd = async (_, params) => {
      await handleResized(params.width, params.height);
    };

    const handleSubmitForm = async (d: SourceInsert) => {
      const w = d.width ?? data.width;
      const h = d.height ?? data.height;
      await handleResized(w, h);
    };

    const scaleW = (width ?? 0) / MAX_WIDTH;
    const scaleH = (height ?? 0) / MAX_HEIGHT;

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="group relative size-full">
            <NodeResizer
              handleStyle={{
                width: 60,
                height: 60,
                zIndex: 9999,
                backgroundColor: "hsl(var(--background))",
                borderWidth: 2,
                borderColor: "hsl(var(--primary))",
                borderRadius: keepAspectRatio ? "var(--radius)" : "9999px",
              }}
              keepAspectRatio={keepAspectRatio}
              lineClassName={cn(
                " [&.top]:!translate-y-[-100%]",
                isSelected
                  ? "[&.top]:!border-t-[20px]"
                  : "[&.top]:!border-t-[10px]",

                "[&.left]:!translate-x-[-100%]",
                isSelected
                  ? "[&.left]:!border-l-[20px]"
                  : "[&.left]:!border-l-[10px]",

                isSelected
                  ? "[&.right]:!border-r-[20px] [&.right]:!translate-x-[calc(-100%+20px)]"
                  : "[&.right]:!border-r-[10px] [&.right]:!translate-x-[calc(-100%+10px)]",

                isSelected
                  ? "[&.bottom]:!border-b-[20px] [&.bottom]:!translate-y-[calc(-100%+20px)]"
                  : "[&.bottom]:!border-b-[10px] [&.bottom]:!translate-y-[calc(-100%+10px)]"
              )}
              onResize={handleResize}
              onResizeEnd={handleResizeEnd}
            />

            <Iframe
              key={refreshKey}
              ref={iframeRef}
              className="pointer-events-none absolute inset-0 -z-50 size-full origin-top-left cursor-not-allowed"
              onLoad={handleOnload}
              style={{
                transform: `scale(${scaleW}, ${scaleH})`,
                maxWidth: MAX_WIDTH,
                maxHeight: MAX_HEIGHT,
              }}
            />

            <IframeInfo
              height={height ?? 0}
              isSelected={isSelected}
              width={width ?? 0}
            />
          </div>
          <IframeMenu
            data={data}
            keepAspectRatio={keepAspectRatio}
            onRestart={handleRestart}
            onSubmitForm={handleSubmitForm}
            setKeepAspectRatio={setKeepAspectRatio}
          />
        </ContextMenuTrigger>
      </ContextMenu>
    );
  }
);
