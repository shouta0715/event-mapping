import { TerminalData } from "@event-mapping/schema";
import { OnNodeDrag, OnNodesDelete } from "@xyflow/react";
import { useTerminalState } from "@/global/store/provider";
import { NodeType } from "@/global/store/types";
import { useDeleteNode, useNodeHandler, useUpdateNodeData } from "@/hooks/node";
import { assertTerminalNode } from "@/utils";

export const useEventMapping = () => {
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
  const { mutateAsync: deleteNode } = useDeleteNode();
  const { onNodeClick, onNodeDoubleClick, onPanClick } = useNodeHandler();

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

  const onNodeDelete: OnNodesDelete<NodeType> = async (targets) => {
    if (targets.length !== 1) return;

    const target = targets[0];

    if (!assertTerminalNode(target)) return;

    deleteNode({ nodeId: target.id });
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
    onNodeDelete,
  };
};
