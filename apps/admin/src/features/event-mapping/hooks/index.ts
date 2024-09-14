import { useTerminalState } from "@/global/store/provider";
import { useNodeHandler } from "@/hooks/node";

export const useEventMapping = () => {
  const { nodes, edges, onEdgesChange, onNodesChange } = useTerminalState(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onEdgesChange: state.onEdgesChange,
      onNodesChange: state.onNodesChange,
    })
  );

  const { onNodeClick, onNodeDoubleClick, onPanClick } = useNodeHandler();

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
