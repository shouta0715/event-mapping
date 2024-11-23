import { ComlinkHandlers } from "@event-mapping/event-sdk";
import {
  InitializeAction,
  JoinAction,
  LeaveAction,
  MouseClickedAction,
  MousePressedAction,
  MouseReleasedAction,
  MoveVertexAction,
  PromptAction,
  UploadImageAction,
  MouseDoubleClickedAction,
  MouseMovedAction,
  MouseDraggedAction,
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
  const { lastJsonMessage, sendJsonMessage } = useWs(sourceId);
  const { addNode, setNodes, removeNode, updateNodeData, getNodeData } =
    useTerminalState((state) => ({
      addNode: state.addNode,
      setNodes: state.setNodes,
      removeNode: state.removeNode,
      updateNodeData: state.updateNodeData,
      getNodeData: state.getNodeData,
    }));

  const initializeHandler = useCallback(
    (data: InitializeAction["sessions"]) => {
      const set = new Set<string>();

      const nodes: TerminalNode[] = [];

      for (const session of data) {
        if (set.has(session.id)) continue;
        const node: TerminalNode = {
          id: session.id,
          type: "terminal",
          position: {
            x: session.startX,
            y: session.startY,
          },
          width: session.width,
          height: session.height,
          data: session,
        };

        nodes.push(node);
        set.add(session.id);
      }

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
    (data: UploadImageAction["data"]) => {
      comlink?.uploaded(data);
    },
    [comlink]
  );

  const moveVertexHandler = useCallback(
    (data: MoveVertexAction["data"]) => {
      const nodeData = getNodeData(data.id);
      if (!nodeData) return;

      updateNodeData(data.id, {
        ...nodeData,
        positions: data.positions,
      });
    },
    [updateNodeData, getNodeData]
  );

  const promptHandler = useCallback(
    (data: PromptAction["data"]) => {
      comlink?.prompt(data);
    },
    [comlink]
  );

  const mouseClickedHandler = useCallback(
    (data: MouseClickedAction["data"]) => {
      comlink?.mouseClicked(data);
    },
    [comlink]
  );

  const mousePressedHandler = useCallback(
    (data: MousePressedAction["data"]) => {
      comlink?.mousePressed(data);
    },
    [comlink]
  );

  const mouseReleasedHandler = useCallback(
    (data: MouseReleasedAction["data"]) => {
      comlink?.mouseReleased(data);
    },
    [comlink]
  );

  const mouseDoubleClickedHandler = useCallback(
    (data: MouseDoubleClickedAction["data"]) => {
      comlink?.mouseDoubleClicked(data);
    },
    [comlink]
  );

  const mouseMovedHandler = useCallback(
    (data: MouseMovedAction["data"]) => {
      comlink?.mouseMoved(data);
    },
    [comlink]
  );

  const mouseDraggedHandler = useCallback(
    (data: MouseDraggedAction["data"]) => {
      comlink?.mouseDragged(data);
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
        uploadImageHandler(lastJsonMessage.data);
        break;
      case "moveVertex":
        moveVertexHandler(lastJsonMessage.data);
        break;
      case "enterShape":
        break;
      case "leaveShape":
        break;
      case "prompt":
        promptHandler(lastJsonMessage.data);
        break;
      case "mouseClicked":
        mouseClickedHandler(lastJsonMessage.data);
        break;
      case "mousePressed":
        mousePressedHandler(lastJsonMessage.data);
        break;
      case "mouseReleased":
        mouseReleasedHandler(lastJsonMessage.data);
        break;
      case "mouseDoubleClicked":
        mouseDoubleClickedHandler(lastJsonMessage.data);
        break;
      case "mouseMoved":
        mouseMovedHandler(lastJsonMessage.data);
        break;
      case "mouseDragged":
        mouseDraggedHandler(lastJsonMessage.data);
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
    moveVertexHandler,
    promptHandler,
    mouseClickedHandler,
    mousePressedHandler,
    mouseReleasedHandler,
    mouseDoubleClickedHandler,
    mouseMovedHandler,
    mouseDraggedHandler,
  ]);

  return {
    sendJsonMessage,
  };
};
