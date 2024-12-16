import { AdminAction } from "@event-mapping/schema";
import { Subscription } from "@/subscription";

export function messageHandler(
  this: Subscription,
  action: AdminAction,
  ws: WebSocket
) {
  switch (action.action) {
    case "moveVertex":
      this.adminMessageHandlers.moveVertexHandler(action.data);
      break;
    case "enterShape":
      this.adminMessageHandlers.enterShapeHandler(action.data);
      break;
    case "leaveShape":
      this.adminMessageHandlers.leaveShapeHandler(action.data);
      break;
    case "mousePressed":
      this.mouseMessageHandlers.mousePressedHandler(ws, action.data);
      break;
    case "mouseReleased":
      this.mouseMessageHandlers.mouseReleasedHandler(ws, action.data);
      break;
    case "mouseClicked":
      this.mouseMessageHandlers.mouseClickedHandler(ws, action.data);
      break;
    case "mouseDoubleClicked":
      this.mouseMessageHandlers.mouseDoubleClickedHandler(ws, action.data);
      break;
    case "mouseMoved":
      this.mouseMessageHandlers.mouseMovedHandler(ws, action.data);
      break;
    case "mouseDragged":
      this.mouseMessageHandlers.mouseDraggedHandler(ws, action.data);
      break;
    case "moveShape":
      this.adminMessageHandlers.moveShapeHandler(action.data);
      break;
    case "streamingOffer":
      this.adminMessageHandlers.streamingOfferHandler(action.data);
      break;
    case "streamingAnswer":
      this.adminMessageHandlers.streamingAnswerHandler(action.data);
      break;
    case "streamingCandidate":
      this.adminMessageHandlers.streamingCandidateHandler(action.data);
      break;
    case "processor":
      this.adminMessageHandlers.processorHandler(action.data);
      break;
    default:
      break;
  }
}
