import { Source } from "@event-mapping/db";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@event-mapping/ui/components/accordion";
import { cn } from "@event-mapping/ui/lib/utils";
import React from "react";
import { IframeForm } from "@/features/iframe-form/components";
import { useNodeHandler } from "@/hooks/node";

type IframePanelProps = {
  data: Source;
  nodeId: string;
  isSelected: boolean;
};

export function IframePanel({ data, nodeId, isSelected }: IframePanelProps) {
  const { setNode } = useNodeHandler();

  return (
    <div>
      <AccordionItem value={nodeId}>
        <AccordionTrigger
          className={cn("px-2", isSelected && "text-primary")}
          onClick={() => setNode(nodeId)}
        >
          <p className="font-semibold">コンテンツの詳細</p>
        </AccordionTrigger>
        <AccordionContent className="px-2">
          <IframeForm key={JSON.stringify(data)} defaultValues={data} />
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}
