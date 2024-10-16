import {
  EventAction,
  EventInitialize,
  EventRestart,
  EventUpdate,
  EventUpdateGlobal,
} from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

async function handleInitializeAction(
  this: EventHandler,
  data: EventInitialize["data"]
) {
  if (this.initialized) return;
  this.terminal = data.terminal;
  this.global = data.global;

  if (this._p5_setup_called) {
    this.setup(this.global, this.terminals, data.terminal);
    this.initialized = true;

    return;
  }

  this.p.setup = () => {
    this.setup(this.global, this.terminals, data.terminal);
    this.initialized = true;
  };
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
    if (!this.terminal) return;

    if (this._p5_setup_called) {
      this.setup(this.global, this.terminals, this.terminal);

      this.initialized = true;

      return;
    }

    this.p.setup = () => {
      if (!this.terminal) return;

      this.setup(this.global, this.terminals, this.terminal);
      this.initialized = true;
    };
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
