"use client";

import { Button } from "@event-mapping/ui/components/index";
import { Remote, windowEndpoint, wrap } from "comlink";
import { useCallback, useEffect, useRef } from "react";

type Functions = {
  addRipple: (x: number, y: number) => void;
  handleResize: (w: number, h: number) => void;
};

export default function Home() {
  const ref = useRef<HTMLIFrameElement>(null);
  const comlinkRef = useRef<Remote<Functions>>();

  const handleOnLoad = useCallback(() => {
    const iframe = ref.current;
    if (!iframe) return () => {};

    const { contentWindow } = iframe;
    if (!contentWindow) return () => {};

    comlinkRef.current = wrap<Functions>(windowEndpoint(contentWindow));

    return () => {
      comlinkRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (!ref.current) return () => {};
    const iframe = ref.current;

    iframe.src = "http://localhost:3001/";

    return () => {
      iframe.src = "";
    };
  }, []);

  return (
    <div className="relative h-dvh w-screen">
      <Button
        className="absolute left-10 top-10 z-10"
        onClick={async () => {
          comlinkRef.current?.handleResize(
            window.innerWidth / 2,
            window.innerHeight / 2
          );
        }}
        variant="secondary"
      >
        コンテンツの幅を変更
      </Button>

      <Button
        className="absolute left-10 top-40 z-10"
        onClick={async () => {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight;
          comlinkRef.current?.addRipple(x, y);
        }}
        variant="secondary"
      >
        波紋をランダムに表示
      </Button>

      <iframe
        ref={ref}
        className="absolute inset-0 size-full"
        onLoad={handleOnLoad}
        title="ripples"
      />
    </div>
  );
}
