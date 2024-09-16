import { cn } from "@event-mapping/ui/lib/utils";
import React from "react";

type ContainerProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">;

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn("container mx-auto px-6", className)} {...props}>
      {children}
    </div>
  );
}
