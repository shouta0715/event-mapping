import { TerminalData } from "@event-mapping/schema";
import React from "react";
import { NodeForm } from "@/features/node-form/components";

type NodePanelProps = {
  data: TerminalData;
  nodeId: string;
  sourceId: string;
};

export function NodePanel({ data, nodeId, sourceId }: NodePanelProps) {
  return (
    <div>
      <NodeForm
        key={JSON.stringify(data)}
        defaultValues={data}
        nodeId={nodeId}
        sourceId={sourceId}
      />
    </div>
  );
}
