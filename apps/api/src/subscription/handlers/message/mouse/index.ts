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
  action: T["action"],
  data: T["data"]
) {
  const { admin } = this;

  if (!admin) return;

  const sessions = this.sessions.keys();

  for (const session of sessions) {
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
  data: MousePressedAction["data"]
) {
  sendMouseMessage.call(this, "mousePressed", data);
}

function mouseReleasedHandler(
  this: Subscription,
  data: MouseReleasedAction["data"]
) {
  sendMouseMessage.call(this, "mouseReleased", data);
}

function mouseClickedHandler(
  this: Subscription,
  data: MouseClickedAction["data"]
) {
  sendMouseMessage.call(this, "mouseClicked", data);
}

export function generateMouseMessageHandlers(this: Subscription) {
  return {
    mousePressedHandler: mousePressedHandler.bind(this),
    mouseReleasedHandler: mouseReleasedHandler.bind(this),
    mouseClickedHandler: mouseClickedHandler.bind(this),
  };
}
