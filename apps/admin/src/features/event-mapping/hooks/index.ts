import { TerminalData } from "@event-mapping/schema";
import { OnNodeDrag } from "@xyflow/react";
import { useWebSocketMessage } from "@/features/message/hooks";
import { useTerminalState } from "@/global/store/provider";
import { NodeType } from "@/global/store/types";
import { useNodeHandler, useUpdateNodeData } from "@/hooks/node";
import { assertTerminalNode } from "@/utils";

export const useEventMapping = ({ sourceId }: { sourceId: string }) => {
  const { nodes, edges, onEdgesChange, onNodesChange } = useTerminalState(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onEdgesChange: state.onEdgesChange,
      onNodesChange: state.onNodesChange,
      updateNodeData: state.updateNodeData,
    })
  );

  const { mutate } = useUpdateNodeData();

  const { onNodeClick, onNodeDoubleClick, onPanClick } = useNodeHandler();
  useWebSocketMessage({ sourceId });

  const onNodeDragStop: OnNodeDrag<NodeType> = (_, node) => {
    if (!assertTerminalNode(node)) return;

    const { id, position } = node;
    const { x, y } = position;

    const newNodeData: TerminalData = {
      ...node.data,
      startX: x,
      startY: y,
    };

    mutate({
      nodeId: id,
      data: newNodeData,
    });
  };

  return {
    nodes,
    edges,
    onEdgesChange,
    onNodesChange,
    onNodeClick,
    onNodeDoubleClick,
    onPanClick,
    onNodeDragStop,
  };
};
