import { EventInitialize } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { applyMatrix3d } from "@event-mapping/event-sdk/handlers/helper/apply-matrix";

export function handleInitializeAction(
  this: EventHandler,
  data: EventInitialize["data"]
) {
  if (this.initialized) return;
  this.terminal = data.terminal;
  this.global = data.global;

  const setupHandler = () => {
    this.setup(this.global, this.terminals, data.terminal);
    if (!this.canvas) this.canvas = document.querySelector("canvas");
    this.setCanvasClipPath();

    applyMatrix3d.call(this, data.terminal.positions);

    this.initialized = true;
  };

  if (this._p5_setup_called) {
    setupHandler();

    return;
  }

  this.p.setup = setupHandler;
}
