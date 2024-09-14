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
  const [set] = handlers;

  return {
    nodes: initialNodes,
    setNodes: (nodes: NodeType[]) => {
      set({ nodes });
    },
    onNodesChange: (changes: NodeChange<NodeType>[]) => {
      set((state) => ({
        nodes: applyNodeChanges<NodeType>(changes, state.nodes),
      }));
    },
  };
};
