import { Source } from "@event-mapping/db";
import {
  AdminComlinkHandlers,
  ComlinkHandlers,
  GlobalData,
} from "@event-mapping/event-sdk";
import {
  EnterShapeAction,
  LeaveShapeAction,
  TerminalData,
} from "@event-mapping/schema";
import { OnResize } from "@xyflow/react";
import * as Comlink from "comlink";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { IS_DEVELOPMENT } from "@/env";
import { usePrompt } from "@/features/iframe/hooks/use-prompt";
import { useRestart } from "@/features/iframe/hooks/use-restart";
import { useWebSocketMessage } from "@/features/message/hooks";
import { mappingModalAtom } from "@/global/modal";
import { useSourceId, useTerminalState } from "@/global/store/provider";
import { useUpdateIframeData } from "@/hooks/iframe";
import { assertTerminalNode } from "@/utils";

type UseComlinkProps = {
  data: Source;
};

const TIMEOUT = 30000;

export function useComlink({ data }: UseComlinkProps) {
  const sourceId = useSourceId();
  const isOpenModal = useAtomValue(mappingModalAtom);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const comlinkRef = useRef<Comlink.Remote<ComlinkHandlers> | null>(null);
  const { nodes, updateIframeData } = useTerminalState((state) => ({
    nodes: state.nodes,
    updateIframeData: state.updateIframeData,
  }));

  const { mutateAsync, refreshKey, setRefreshKey } = useRestart(sourceId);
  const { mutateAsync: mutateAsyncUpdateIframeData } =
    useUpdateIframeData(false);

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

  const { sendJsonMessage } = useWebSocketMessage({
    sourceId,
    comlink: comlinkRef.current,
  });

  const enterShapeHandler: AdminComlinkHandlers["enterShape"] = useCallback(
    (rectId, shape) => {
      if (!rectId || !shape.id) return;

      const sendData: EnterShapeAction["data"] = {
        rectId,
        id: shape.id,
        size: shape.size,
        position: shape.position,
        velocity: shape.velocity,
        meta: shape.meta,
      };

      sendJsonMessage<EnterShapeAction>({
        action: "enterShape",
        data: sendData,
      });
    },
    [sendJsonMessage]
  );

  const leaveShapeHandler: AdminComlinkHandlers["leaveShape"] = useCallback(
    (rectId, id) => {
      if (!rectId || !id) return;

      sendJsonMessage<LeaveShapeAction>({
        action: "leaveShape",
        data: { rectId, id },
      });
    },
    [sendJsonMessage]
  );

  const exposeHandlers = useCallback((): AdminComlinkHandlers => {
    return {
      enterShape: enterShapeHandler,
      leaveShape: leaveShapeHandler,
    };
  }, [enterShapeHandler, leaveShapeHandler]);

  const handleOnload = useCallback(async () => {
    const iframe = iframeRef.current;

    if (!iframe || !iframe.contentWindow || iframe.src === "") return;

    const handlers = exposeHandlers();

    Comlink.expose(handlers, Comlink.windowEndpoint(iframe.contentWindow));
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
  }, [exposeHandlers, data.width, data.height, nodes]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return () => {};

    const url = IS_DEVELOPMENT ? data.dev_url : data.url;
    iframe.src = isOpenModal ? "" : url;

    return () => {
      iframe.src = "";
    };
  }, [data.dev_url, data.url, refreshKey, isOpenModal]);

  const handleResized = async (width: number, height: number) => {
    if (!comlinkRef.current) return;

    try {
      await Promise.race([
        comlinkRef.current.resize(width, height),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error("timeout")), TIMEOUT);
        }),
      ]);
      await mutateAsyncUpdateIframeData({ data: { ...data, width, height } });
    } catch (error) {
      toast.error("サイズの変更を行えませんでした。");

      if (error instanceof Error && error.message === "timeout") {
        comlinkRef.current?.resize(data.width, data.height);
      }

      updateIframeData(data);
    }
  };

  const handleResize: OnResize = async (_, params) => {
    if (!comlinkRef.current) return;

    comlinkRef.current.resize(params.width, params.height);
  };

  const { mutateAsync: mutateAsyncPrompt } = usePrompt(sourceId);

  const handlePrompt = async (target: "admin" | "all") => {
    const targetMessage = target === "admin" ? "管理画面の" : "全端末の";

    toast.promise(mutateAsyncPrompt(target), {
      loading: `${targetMessage}プロンプトを実行しています...`,
      success: `${targetMessage}プロンプトを実行しました。`,
      error: `${targetMessage}プロンプトを実行できませんでした。`,
    });
  };

  return {
    iframeRef,
    refreshKey,
    handleResized,
    handleResize,
    handleOnload,
    handleRestart,
    handlePrompt,
  };
}
