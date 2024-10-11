import { ComlinkHandlers } from "@event-mapping/event-sdk";
import * as Comlink from "comlink";
import { useEffect, useRef } from "react";
import { IS_DEVELOPMENT } from "@/env";

type UseComlinkProps = {
  url: string;
  dev_url: string;
};

export function useComlink({ url, dev_url }: UseComlinkProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const comlinkRef = useRef<Comlink.Remote<ComlinkHandlers> | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return () => {};

    iframe.src = IS_DEVELOPMENT ? dev_url : url;

    iframe.onload = async () => {
      if (!iframe.contentWindow) return;

      comlinkRef.current = Comlink.wrap(
        Comlink.windowEndpoint(iframe.contentWindow)
      );
    };

    return () => {
      iframe.src = "";
      comlinkRef.current = null;
    };
  }, [url, dev_url]);

  const handleResize = async (width: number, height: number) => {
    if (!comlinkRef.current) return;

    await comlinkRef.current.resize(width, height);
  };

  return {
    iframeRef,
    handleResize,
  };
}
