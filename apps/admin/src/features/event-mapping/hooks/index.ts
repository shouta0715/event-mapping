import { useWebSocketMessage } from "@/features/message/hooks";
import { useTerminalState } from "@/global/store/provider";
import { useNodeHandler } from "@/hooks/node";

export const useEventMapping = ({ sourceId }: { sourceId: string }) => {
  const { nodes, edges, onEdgesChange, onNodesChange } = useTerminalState(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onEdgesChange: state.onEdgesChange,
      onNodesChange: state.onNodesChange,
    })
  );

  const { onNodeClick, onNodeDoubleClick, onPanClick } = useNodeHandler();
  useWebSocketMessage({ sourceId });

  return {
    nodes,
    edges,
    onEdgesChange,
    onNodesChange,
    onNodeClick,
    onNodeDoubleClick,
    onPanClick,
  };
};
