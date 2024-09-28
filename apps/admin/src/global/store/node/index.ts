import { applyNodeChanges, NodeChange } from "@xyflow/react";
import { type StateCreator } from "zustand";
import {
  FlowNodeActions,
  FlowNodeState,
  NodeType,
  TerminalNode,
} from "@/global/store/types";
import { assertTerminalNode } from "@/utils";

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
      const iframeNode = prevNodes.find((node) => node.type === "iframe");
      if (!iframeNode) return;

      set({ nodes: [iframeNode, ...nodes] });
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
    updateNodeData: (id, data) => {
      const prevNodes = get().nodes;

      const updatedNodes: NodeType[] = prevNodes.map((node) => {
        if (node.id !== id) return node;

        if (!assertTerminalNode(node)) return node;

        const { startX, startY, width, height } = data;
        const newNode: TerminalNode = {
          ...node,
          position: {
            x: startX,
            y: startY,
          },
          width,
          height,
          data,
        };

        return newNode;
      });

      set({ nodes: updatedNodes });
    },
  };
};
