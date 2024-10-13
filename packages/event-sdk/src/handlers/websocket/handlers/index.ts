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
}

function handleRestartAction(this: EventHandler, time: EventRestart["time"]) {
  this.restartTime = time;

  setTimeout(() => {
    this.initialized = true;
    window.location.reload();
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
