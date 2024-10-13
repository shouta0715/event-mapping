import { TerminalData } from "@event-mapping/schema";
import { GlobalData } from "@event-mapping/event-sdk/types/global";

export type ComlinkHandlers = {
  resize: (width: number, height: number) => void;
  join: (terminal: TerminalData) => void;
  leave: (id: string) => void;
  initialize: (terminals: TerminalData[], global: GlobalData) => void;
};
