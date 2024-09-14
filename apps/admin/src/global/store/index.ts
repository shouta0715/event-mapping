import { createStore } from "zustand";
import { createEdgeStore } from "@/global/store/edge";
import { createNodeStore } from "@/global/store/node";
import { FlowGlobalState, FlowState } from "@/global/store/types";

/**
 * @description: 端末と接続状況を管理するストアを作成する
 * @param {FlowState} { nodes, edges } 初期のノードとエッジ
 */
export const createTerminalState = ({
  nodes: initialNodes,
  edges: initialEdges,
}: FlowState) => {
  return createStore<FlowGlobalState>()((...handlers) => ({
    ...createNodeStore({ initialNodes, handlers }),
    ...createEdgeStore({ initialEdges, handlers }),
  }));
};

export type ReturnCreateTerminalState = ReturnType<typeof createTerminalState>;
