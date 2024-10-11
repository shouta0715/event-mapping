import { ComlinkHandlers } from "@event-mapping/event-sdk";
import { TerminalData } from "@event-mapping/schema";
import * as Comlink from "comlink";
import { useEffect, useRef } from "react";
import { IS_DEVELOPMENT } from "@/env";
import { useWebSocketMessage } from "@/features/message/hooks";
import { useSourceId, useTerminalState } from "@/global/store/provider";
import { assertTerminalNode } from "@/utils";

type UseComlinkProps = {
  url: string;
  dev_url: string;
};

export function useComlink({ url, dev_url }: UseComlinkProps) {
  const sourceId = useSourceId();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const comlinkRef = useRef<Comlink.Remote<ComlinkHandlers> | null>(null);
  const { nodes } = useTerminalState((state) => ({
    nodes: state.nodes,
  }));

  useWebSocketMessage({ sourceId, comlink: comlinkRef.current });

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return () => {};

    iframe.src = IS_DEVELOPMENT ? dev_url : url;

    iframe.onload = async () => {
      if (!iframe.contentWindow) return;

      comlinkRef.current = Comlink.wrap(
        Comlink.windowEndpoint(iframe.contentWindow)
      );

      const terminals: TerminalData[] = [];

      for (const node of nodes) {
        if (!assertTerminalNode(node)) continue;

        terminals.push(node.data);
      }

      await comlinkRef.current.initialize(terminals);
    };

    return () => {
      iframe.src = "";
      comlinkRef.current = null;
    };
  }, [url, dev_url, nodes]);

  const handleResize = async (width: number, height: number) => {
    if (!comlinkRef.current) return;

    await comlinkRef.current.resize(width, height);
  };

  return {
    iframeRef,
    handleResize,
  };
}
