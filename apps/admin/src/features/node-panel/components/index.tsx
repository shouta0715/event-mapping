import { TerminalData } from "@event-mapping/schema";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@event-mapping/ui/components/accordion";
import { cn } from "@event-mapping/ui/lib/utils";
import React from "react";
import { NodeForm } from "@/features/node-form/components";
import { useNodeHandler } from "@/hooks/node";

type NodePanelProps = {
  data: TerminalData;
  nodeId: string;
  isSelected: boolean;
};

export function NodePanel({ data, nodeId, isSelected }: NodePanelProps) {
  const { setNode } = useNodeHandler();

  return (
    <div>
      <AccordionItem value={data.id}>
        <AccordionTrigger
          className={cn("px-2", isSelected && "text-primary")}
          onClick={() => setNode(data.id)}
        >
          {data.displayname}
        </AccordionTrigger>
        <AccordionContent className="px-2">
          <NodeForm
            key={JSON.stringify(data)}
            defaultValues={data}
            nodeId={nodeId}
          />
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}
