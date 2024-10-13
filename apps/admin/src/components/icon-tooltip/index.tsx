import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@event-mapping/ui/components/tooltip";
import React from "react";

type IconTooltipProps = {
  children: React.ReactNode;
  asChild?: boolean;
  text: string;
  textProps?: React.ComponentProps<typeof TooltipContent>;
};

export function IconTooltip({
  asChild,
  children,
  text,
  textProps,
}: IconTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
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
