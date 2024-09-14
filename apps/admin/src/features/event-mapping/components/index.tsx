"use client";

import { Background, Controls, ReactFlow } from "@xyflow/react";
import React from "react";

import "@xyflow/react/dist/style.css";
import { useTerminalState } from "@/global/store/provider";

export function EventMapping() {
  const { nodes, edges, onEdgesChange, onNodesChange } = useTerminalState(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onEdgesChange: state.onEdgesChange,
      onNodesChange: state.onNodesChange,
    })
  );

  return (
    <div className="h-screen">
      <ReactFlow
        edges={edges}
        fitView
        minZoom={0.1}
        nodes={nodes}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
