import { addEdge, applyEdgeChanges, Connection } from "@xyflow/react";
import { type StateCreator } from "zustand";
import {
  FlowEdgeActions,
  FlowEdgeState,
  TerminalEdge,
} from "@/global/store/types";

type FlowEdgeStore = FlowEdgeState & FlowEdgeActions;

type EdgeStore = {
  initialEdges: TerminalEdge[];
  handlers: Parameters<StateCreator<FlowEdgeStore>>;
};

/**
 * @description: エッジのストアを作成する
 * @param {EdgeStore} { initialEdges, handlers }
 * @returns {FlowEdgeStore}
 */

export const createEdgeStore = ({
  initialEdges,
  handlers,
}: EdgeStore): FlowEdgeStore => {
  const [set] = handlers;

  return {
    edges: initialEdges,
    setEdges: (edges) => {
      set({ edges });
    },
    onEdgesChange: (changes) => {
      set((state) => ({
        edges: applyEdgeChanges<TerminalEdge>(changes, state.edges),
      }));
    },
    onConnect: (connection: Connection) => {
      set((state) => ({
        edges: addEdge<TerminalEdge>(connection, state.edges),
      }));
    },
  };
};
