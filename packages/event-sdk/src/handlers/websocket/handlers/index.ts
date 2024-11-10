import { EventAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { handleDeleteAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/delete";
import { handleUpdateGlobalAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/global";
import { handleUploadImageAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/image";
import { handleInitializeAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/initialize";
import { handleRestartAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/restart";
import { handleUpdateAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/update";
import { handleMoveVertexAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/vertex";
import { handleWarningAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/warn";

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
    case "uploadImage":
      handleUploadImageAction.call(this, action.data);
      break;
    case "warning":
      handleWarningAction.call(this, action.message);
      break;
    case "moveVertex":
      handleMoveVertexAction.call(this, action.data);
      break;
    case "delete":
      handleDeleteAction.call(this);
      break;
    default:
      throw new Error(action satisfies never);
  }
}
