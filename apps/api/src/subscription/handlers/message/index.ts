import { AdminAction } from "@event-mapping/schema";
import { Subscription } from "@/subscription";

export function messageHandler(this: Subscription, action: AdminAction) {
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
      this.mouseMessageHandlers.mousePressedHandler(action.data);
      break;
    case "mouseReleased":
      this.mouseMessageHandlers.mouseReleasedHandler(action.data);
      break;
    case "mouseClicked":
      this.mouseMessageHandlers.mouseClickedHandler(action.data);
      break;
    default:
      break;
  }
}
