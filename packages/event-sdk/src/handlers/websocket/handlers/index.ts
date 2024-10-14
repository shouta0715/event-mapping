import {
  EventAction,
  EventInitialize,
  EventRestart,
  EventUpdate,
  EventUpdateGlobal,
} from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

function handleInitializeAction(
  this: EventHandler,
  data: EventInitialize["data"]
) {
  this.terminal = data.terminal;
  this.global = data.global;

  this.initialized = true;
}

function handleUpdateGlobalAction(
  this: EventHandler,
  data: EventUpdateGlobal["data"]
) {
  this.global = data;
}

function handleUpdateAction(this: EventHandler, data: EventUpdate["data"]) {
  this.terminal = data;

  if (!this.canvas) return;

  const { left, top, right, bottom } = this.terminal.margin;

  this.canvas.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
}

function handleRestartAction(this: EventHandler, time: EventRestart["time"]) {
  this.restartTime = time;

  setTimeout(() => {
    window.location.reload();

    this.initialized = true;
  }, time - Date.now());
}

export function handleEventAction(this: EventHandler, action: EventAction) {
  switch (action.action) {
    case "initialize":
      handleInitializeAction.call(this, action.data);
      break;
    case "updateGlobal":
      handleUpdateGlobalAction.call(this, action.data);
      break;
    case "update":
      handleUpdateAction.call(this, action.data);
      break;
    case "restart":
      handleRestartAction.call(this, action.time);
      break;
    default:
      break;
  }
}
