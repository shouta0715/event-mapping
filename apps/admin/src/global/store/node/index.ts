import { applyNodeChanges, NodeChange } from "@xyflow/react";
import { type StateCreator } from "zustand";
import {
  FlowNodeActions,
  FlowNodeState,
  TerminalNode,
} from "@/global/store/types";

type FlowNodeStore = FlowNodeState & FlowNodeActions;

type NodeStore = {
  initialNodes: TerminalNode[];
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
    setNodes: (nodes: TerminalNode[]) => {
      set({ nodes });
    },
    onNodesChange: (changes: NodeChange<TerminalNode>[]) => {
      set((state) => ({
        nodes: applyNodeChanges<TerminalNode>(changes, state.nodes),
      }));
    },
  };
};
