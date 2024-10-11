import { TerminalData } from "@event-mapping/schema";

export type ComlinkHandlers = {
  resize: (width: number, height: number) => void;
  join: (terminal: TerminalData) => void;
  leave: (id: string) => void;
  initialize: (terminals: TerminalData[]) => void;
};
