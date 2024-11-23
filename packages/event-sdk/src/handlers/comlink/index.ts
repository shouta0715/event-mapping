import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";
import { uploadedImageHandler } from "@event-mapping/event-sdk/handlers/comlink/image";
import {
  mouseClickedHandler,
  mousePressedHandler,
  mouseReleasedHandler,
} from "@event-mapping/event-sdk/handlers/comlink/mouse";
import { promptHandler } from "@event-mapping/event-sdk/handlers/comlink/prompt";
import { resizeHandler } from "@event-mapping/event-sdk/handlers/comlink/resize";
import {
  initializeHandler,
  joinHandler,
  leaveHandler,
} from "@event-mapping/event-sdk/handlers/comlink/terminal";
import { ComlinkHandlers } from "@event-mapping/event-sdk/types";

export function generateComlinkHandlers(this: AdminHandler): ComlinkHandlers {
  return {
    resize: resizeHandler.bind(this),
    join: joinHandler.bind(this),
    leave: leaveHandler.bind(this),
    initialize: initializeHandler.bind(this),
    uploaded: uploadedImageHandler.bind(this),
    prompt: promptHandler.bind(this),
    mouseClicked: mouseClickedHandler.bind(this),
    mousePressed: mousePressedHandler.bind(this),
    mouseReleased: mouseReleasedHandler.bind(this),
  };
}
