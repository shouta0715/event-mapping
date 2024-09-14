import { useTerminalState } from "@/global/store/provider";

export const useEventMapping = () => {
  const { nodes, edges, onEdgesChange, onNodesChange } = useTerminalState(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onEdgesChange: state.onEdgesChange,
      onNodesChange: state.onNodesChange,
    })
  );

  return {
    nodes,
    edges,
    onEdgesChange,
    onNodesChange,
  };
};
