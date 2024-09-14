"use client";

import { Background, Controls, ReactFlow } from "@xyflow/react";
import React from "react";

import "@xyflow/react/dist/style.css";
import { IFRAME_NODE_TYPE } from "@/constant/node";
import { useEventMapping } from "@/features/event-mapping/hooks";
import { IframeNode } from "@/features/iframe/components";

const nodeTypes = {
  [IFRAME_NODE_TYPE]: IframeNode,
};

export function EventMapping() {
  const { nodes, edges, onEdgesChange, onNodesChange } = useEventMapping();

  return (
    <div className="h-screen">
      <ReactFlow
        edges={edges}
        fitView
        minZoom={0.1}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
