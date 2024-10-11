import { TerminalData } from "@event-mapping/schema";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";

export function joinHandler(this: AdminHandler, terminal: TerminalData) {
  if (this.terminals.find((t) => t.id === terminal.id)) return;

  this.terminals.push(terminal);
}

export function leaveHandler(this: AdminHandler, id: string) {
  const newTerminals = this.terminals.filter((t) => t.id !== id);

  this.terminals = newTerminals;
}

export function initializeHandler(
  this: AdminHandler,
  terminals: TerminalData[]
) {
  this.terminals = terminals;
}
