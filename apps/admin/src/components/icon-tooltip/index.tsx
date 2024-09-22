import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@event-mapping/ui/components/tooltip";
import React from "react";

interface IconTooltipProps {
  icon: React.ReactNode;
  text: string;
  iconProps?: React.ComponentProps<typeof TooltipTrigger>;
  textProps?: React.ComponentProps<typeof TooltipContent>;
}

export function IconTooltip({
  icon,
  text,
  iconProps,
  textProps,
}: IconTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger {...iconProps}>
          {icon}
          <span className="sr-only">{text}</span>
        </TooltipTrigger>
        <TooltipContent
          {...textProps}
          className="border-black bg-black text-xs font-bold text-white"
          side={textProps?.side ?? "bottom"}
        >
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
