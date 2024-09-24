"use client";

import React, { useRef } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { createTerminalState, ReturnCreateTerminalState } from "@/global/store";
import { FlowGlobalState, FlowState } from "@/global/store/types";

type EventMappingProviderProps = {
  children: React.ReactNode;
  defaultState?: FlowState;
};

const Context = React.createContext<ReturnCreateTerminalState | null>(null);

const fallbackState: FlowState = {
  nodes: [],
  edges: [],
};

export const TerminalStateProvider = ({
  children,
  defaultState = fallbackState,
}: EventMappingProviderProps) => {
  const store = useRef<ReturnCreateTerminalState | null>(null);

  if (!store.current) {
    store.current = createTerminalState(defaultState);
  }

  return <Context.Provider value={store.current}>{children}</Context.Provider>;
};

const useTerminalStateContext = () => {
  const context = React.useContext(Context);

  if (!context) throw new Error("Provider is not found");

  return context;
};

export const useTerminalState = <T extends Partial<FlowGlobalState>>(
  selector: (state: FlowGlobalState) => T
) => {
  const store = useTerminalStateContext();

  return useStore(store, useShallow(selector));
};
