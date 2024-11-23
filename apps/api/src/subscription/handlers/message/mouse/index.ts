import {
  MouseClickedAction,
  MousePressedAction,
  MouseReleasedAction,
} from "@event-mapping/schema";
import { Subscription } from "@/subscription";
import { sendMessage } from "@/utils";

type MouseAction =
  | MousePressedAction
  | MouseReleasedAction
  | MouseClickedAction;

function sendMouseMessage<T extends MouseAction>(
  this: Subscription,
  ws: WebSocket,
  action: T["action"],
  data: T["data"]
) {
  const { admin } = this;

  if (!admin) return;

  const sessions = this.sessions.keys();

  for (const session of sessions) {
    if (session === ws) continue;
    sendMessage(session, {
      action,
      data,
    });
  }

  sendMessage(admin, {
    action,
    data,
  });
}

function mousePressedHandler(
  this: Subscription,
  ws: WebSocket,
  data: MousePressedAction["data"]
) {
  sendMouseMessage.call(this, ws, "mousePressed", data);
}

function mouseReleasedHandler(
  this: Subscription,
  ws: WebSocket,
  data: MouseReleasedAction["data"]
) {
  sendMouseMessage.call(this, ws, "mouseReleased", data);
}

function mouseClickedHandler(
  this: Subscription,
  ws: WebSocket,
  data: MouseClickedAction["data"]
) {
  sendMouseMessage.call(this, ws, "mouseClicked", data);
}

export function generateMouseMessageHandlers(this: Subscription) {
  return {
    mousePressedHandler: mousePressedHandler.bind(this),
    mouseReleasedHandler: mouseReleasedHandler.bind(this),
    mouseClickedHandler: mouseClickedHandler.bind(this),
  };
}
