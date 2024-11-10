import { EventRestart } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleRestartAction(
  this: EventHandler,
  time: EventRestart["time"]
) {
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
