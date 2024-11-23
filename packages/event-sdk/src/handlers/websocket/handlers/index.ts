import { EventAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { handleDeleteAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/delete";
import { handleEnterShapeAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/enter";
import { handleUpdateGlobalAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/global";
import { handleUploadImageAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/image";
import { handleInitializeAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/initialize";
import { handleLeaveShapeAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/leave";
import { handleMouseClickedAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/mouse/clicked";
import { handleMouseDoubleClickedAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/mouse/double-clicked";
import { handleMouseDraggedAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/mouse/dragged";
import { handleMouseMovedAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/mouse/moved";
import { handleMousePressedAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/mouse/pressed";
import { handleMouseReleasedAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/mouse/release";
import { handlePromptAction } from "@event-mapping/event-sdk/handlers/websocket/handlers/prompt";
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
    case "enterShape":
      handleEnterShapeAction.call(this, action.data);
      break;
    case "leaveShape":
      handleLeaveShapeAction.call(this, action.data);
      break;
    case "prompt":
      handlePromptAction.call(this, action.data);

      break;
    case "mousePressed":
      handleMousePressedAction.call(this, action.data);
      break;
    case "mouseReleased":
      handleMouseReleasedAction.call(this, action.data);
      break;
    case "mouseClicked":
      handleMouseClickedAction.call(this, action.data);
      break;
    case "mouseDoubleClicked":
      handleMouseDoubleClickedAction.call(this, action.data);
      break;
    case "mouseMoved":
      handleMouseMovedAction.call(this, action.data);
      break;
    case "mouseDragged":
      handleMouseDraggedAction.call(this, action.data);
      break;
    default:
      throw new Error(action satisfies never);
  }
}
