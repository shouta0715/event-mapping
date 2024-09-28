import { TerminalData } from "@event-mapping/schema";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@event-mapping/ui/components/accordion";
import { cn } from "@event-mapping/ui/lib/utils";
import React from "react";
import { NodeForm } from "@/features/node-form/components";

type NodePanelProps = {
  data: TerminalData;
  nodeId: string;
  sourceId: string;
  isSelected: boolean;
};

export function NodePanel({
  data,
  nodeId,
  sourceId,
  isSelected,
}: NodePanelProps) {
  return (
    <div>
      <AccordionItem value={data.id}>
        <AccordionTrigger className={cn(isSelected && "text-primary")}>
          {data.displayname}
        </AccordionTrigger>
        <AccordionContent>
          <NodeForm
            key={JSON.stringify(data)}
            defaultValues={data}
            nodeId={nodeId}
            sourceId={sourceId}
          />
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}
