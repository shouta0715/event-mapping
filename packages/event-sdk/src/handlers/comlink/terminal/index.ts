import { TerminalData } from "@event-mapping/schema";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";
import { GlobalData } from "@event-mapping/event-sdk/types/global";

export function joinHandler(this: AdminHandler, terminal: TerminalData) {
  this.join(terminal);

  this.insertTerminal(terminal);
}

export function leaveHandler(this: AdminHandler, id: string) {
  this.leave(id);
  this.removeTerminal(id);
}

export function initializeHandler(
  this: AdminHandler,
  terminals: TerminalData[],
  global: GlobalData
) {
  this.global = global;
  this.terminals = terminals;
  this.initializeQuadtree();
  this.setup(global, terminals, undefined);
  this.initialized = true;
}
