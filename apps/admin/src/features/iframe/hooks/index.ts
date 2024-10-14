import { Source } from "@event-mapping/db";
import { ComlinkHandlers, GlobalData } from "@event-mapping/event-sdk";
import { TerminalData } from "@event-mapping/schema";
import * as Comlink from "comlink";
import { useCallback, useEffect, useRef } from "react";
import { IS_DEVELOPMENT } from "@/env";
import { useRestart } from "@/features/iframe/hooks/use-restart";
import { useWebSocketMessage } from "@/features/message/hooks";
import { useSourceId, useTerminalState } from "@/global/store/provider";
import { useUpdateIframeData } from "@/hooks/iframe";
import { assertTerminalNode } from "@/utils";

type UseComlinkProps = {
  data: Source;
};

export function useComlink({ data }: UseComlinkProps) {
  const sourceId = useSourceId();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const comlinkRef = useRef<Comlink.Remote<ComlinkHandlers> | null>(null);
  const { nodes } = useTerminalState((state) => ({
    nodes: state.nodes,
  }));

  const { mutateAsync, refreshKey, setRefreshKey } = useRestart(sourceId);
  const { mutateAsync: mutateAsyncUpdateIframeData } = useUpdateIframeData();

  const handleRestart = async () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    if (!iframe.contentWindow) return;

    const { time } = await mutateAsync(2000);

    const delay = time - Date.now();

    await new Promise((resolve) => {
      setTimeout(() => {
        setRefreshKey(time);
        resolve(null);
      }, delay);
    });
  };

  useWebSocketMessage({ sourceId, comlink: comlinkRef.current });

  const handleOnload = useCallback(async () => {
    const iframe = iframeRef.current;

    if (!iframe || !iframe.contentWindow) return;

    comlinkRef.current = Comlink.wrap(
      Comlink.windowEndpoint(iframe.contentWindow)
    );

    const terminals: TerminalData[] = [];

    for (const node of nodes) {
      if (!assertTerminalNode(node)) continue;

      terminals.push(node.data);
    }

    const global: GlobalData = {
      width: data.width ?? 0,
      height: data.height ?? 0,
    };
    await comlinkRef.current.initialize(terminals, global);
  }, [nodes, data]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return () => {};
    iframe.src = IS_DEVELOPMENT ? data.dev_url : data.url;

    return () => {
      iframe.src = "";
    };
  }, [data.dev_url, data.url, refreshKey]);

  const handleResize = async (width: number, height: number) => {
    if (!comlinkRef.current) return;

    await comlinkRef.current.resize(width, height);
    await mutateAsyncUpdateIframeData({ data: { ...data, width, height } });
  };

  return {
    iframeRef,
    handleResize,
    handleOnload,
    handleRestart,
    refreshKey,
  };
}
