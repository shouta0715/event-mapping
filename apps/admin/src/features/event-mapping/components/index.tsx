import { Background, Controls, ReactFlow } from "@xyflow/react";
import React from "react";

import "@xyflow/react/dist/style.css";

export function EventMapping() {
  return (
    <div className="h-screen">
      <ReactFlow>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
