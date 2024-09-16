import React from "react";
import { handleApiError } from "@/errors";

type ToastErrorProps = {
  error: unknown;
  title: string;
};

export function ToastError({ error, title }: ToastErrorProps) {
  const { message } = handleApiError({ error });

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-bold text-destructive">{title}</p>
      <p className="text-xs text-muted-foreground">{message}</p>
    </div>
  );
}
