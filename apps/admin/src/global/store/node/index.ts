import { applyNodeChanges, NodeChange } from "@xyflow/react";
import { type StateCreator } from "zustand";
import { FlowNodeActions, FlowNodeState, NodeType } from "@/global/store/types";

type FlowNodeStore = FlowNodeState & FlowNodeActions;

type NodeStore = {
  initialNodes: NodeType[];
  handlers: Parameters<StateCreator<FlowNodeStore>>;
};

/**
 * @description: ノードのストアを作成する
 * @param {NodeStore} { initialNodes, handlers }
 * @returns {FlowNodeStore}
 */
export const createNodeStore = ({
  initialNodes,
  handlers,
}: NodeStore): FlowNodeStore => {
  const [set, get] = handlers;

  return {
    nodes: initialNodes,
    setNodes: (nodes: NodeType[]) => {
      const prevNodes = get().nodes;
      set({ nodes: [...prevNodes, ...nodes] });
    },
    onNodesChange: (changes: NodeChange<NodeType>[]) => {
      set((state) => ({
        nodes: applyNodeChanges<NodeType>(changes, state.nodes),
      }));
    },
    addNode: (node: NodeType) => {
      const prevNodes = get().nodes;
      set({ nodes: [...prevNodes, node] });
    },
    removeNode: (id: string) => {
      const prevNodes = get().nodes;
      set({ nodes: prevNodes.filter((node) => node.id !== id) });
    },
  };
};
