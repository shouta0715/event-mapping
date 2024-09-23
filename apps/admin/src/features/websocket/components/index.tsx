"use client";

import React, { useMemo } from "react";
import { Loader } from "@/components/animation";
import { useWs } from "@/features/websocket/hooks";

export type Status =
  | "connecting"
  | "open"
  | "closing"
  | "closed"
  | "uninstantiated";

type WebSocketStatus = {
  isOpen: boolean;
  isClosing: boolean;
  isClosed: boolean;
  isUninstantiated: boolean;
  status: Status;
};

const INITIAL_STATE: WebSocketStatus = {
  isOpen: false,
  isClosing: false,
  isClosed: false,
  isUninstantiated: false,
  status: "uninstantiated",
};

const WSStatusContext = React.createContext<WebSocketStatus>(INITIAL_STATE);

type Props = Readonly<{
  eventId: string;
  sourceId: string;
  children: React.ReactNode;
}>;

export function WSStatusProvider({ eventId, sourceId, children }: Props) {
  const { status } = useWs(eventId, sourceId);

  const statusValue: WebSocketStatus = useMemo(
    () => ({
      isOpen: status === "open",
      isClosing: status === "closing",
      isClosed: status === "closed",
      isUninstantiated: status === "uninstantiated",
      status,
    }),
    [status]
  );

  if (status === "connecting") return <Loader />;

  return (
    <WSStatusContext.Provider value={statusValue}>
      {children}
    </WSStatusContext.Provider>
  );
}

export function useWSStatus() {
  return React.useContext(WSStatusContext);
}
