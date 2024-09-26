import {
  InitializeAction,
  JoinAction,
  LeaveAction,
} from "@event-mapping/schema";
import { useCallback, useEffect } from "react";
import { useWs } from "@/features/websocket/hooks";
import { useTerminalState } from "@/global/store/provider";
import { TerminalNode } from "@/global/store/types";

export const useWebSocketMessage = ({ sourceId }: { sourceId: string }) => {
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
    },
    [addNode]
  );

  const leaveHandler = useCallback(
    (sessionId: LeaveAction["sessionId"]) => {
      removeNode(sessionId);
    },
    [removeNode]
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
      default:
        throw new Error(action satisfies never);
    }
  }, [initializeHandler, joinHandler, lastJsonMessage, leaveHandler]);
};
