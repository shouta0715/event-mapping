import { TerminalData } from "@event-mapping/schema";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@event-mapping/ui/components/accordion";

import { cn } from "@event-mapping/ui/lib/utils";
import React from "react";
import { NodeForm } from "@/features/node-form/components";
import { TerminalSetting } from "@/features/terminal-setting/components";
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
        <div className="flex w-full items-center">
          <div className="flex-1">
            <AccordionTrigger
              className={cn("px-2 flex-1", isSelected && "text-primary")}
              onClick={() => setNode(data.id)}
            >
              {data.displayname}
            </AccordionTrigger>
          </div>
          <TerminalSetting data={data} nodeId={nodeId} />
        </div>
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
