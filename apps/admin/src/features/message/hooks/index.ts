import { ComlinkHandlers } from "@event-mapping/event-sdk";
import {
  InitializeAction,
  JoinAction,
  LeaveAction,
  UploadImageAction,
} from "@event-mapping/schema";
import Comlink from "comlink";
import { useCallback, useEffect } from "react";
import { useWs } from "@/features/websocket/hooks";
import { useTerminalState } from "@/global/store/provider";
import { TerminalNode } from "@/global/store/types";

type UseWebSocketMessageProps = {
  sourceId: string;
  comlink: Comlink.Remote<ComlinkHandlers> | null;
};

export const useWebSocketMessage = ({
  sourceId,
  comlink,
}: UseWebSocketMessageProps) => {
  const { lastJsonMessage } = useWs(sourceId);
  const { addNode, setNodes, removeNode } = useTerminalState((state) => ({
    addNode: state.addNode,
    setNodes: state.setNodes,
    removeNode: state.removeNode,
  }));

  const initializeHandler = useCallback(
    (data: InitializeAction["sessions"]) => {
      const nodes: TerminalNode[] = data.map((session) => ({
        id: session.id,
        type: "terminal",
        position: {
          x: session.startX,
          y: session.startY,
        },
        width: session.width,
        height: session.height,
        data: session,
      }));

      setNodes(nodes);
    },
    [setNodes]
  );

  const joinHandler = useCallback(
    (data: JoinAction["data"]) => {
      const { width, height, id, startX, startY } = data;
      const node: TerminalNode = {
        id,
        type: "terminal",
        position: {
          x: startX,
          y: startY,
        },
        width,
        height,
        data,
      };

      addNode(node);
      comlink?.join(data);
    },
    [addNode, comlink]
  );

  const leaveHandler = useCallback(
    (sessionId: LeaveAction["sessionId"]) => {
      removeNode(sessionId);
      comlink?.leave(sessionId);
    },
    [removeNode, comlink]
  );

  const uploadImageHandler = useCallback(
    (id: UploadImageAction["id"]) => {
      comlink?.uploaded(id);
    },
    [comlink]
  );

  useEffect(() => {
    if (!lastJsonMessage) return;
    const { action } = lastJsonMessage;

    switch (action) {
      case "initialize":
        initializeHandler(lastJsonMessage.sessions);
        break;
      case "join":
        joinHandler(lastJsonMessage.data);
        break;
      case "leave":
        leaveHandler(lastJsonMessage.sessionId);
        break;
      case "uploadImage":
        uploadImageHandler(lastJsonMessage.id);
        break;
      default:
        throw new Error(action satisfies never);
    }
  }, [
    initializeHandler,
    joinHandler,
    lastJsonMessage,
    leaveHandler,
    uploadImageHandler,
  ]);
};
