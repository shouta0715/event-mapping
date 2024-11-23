import {
  MouseClickedAction,
  MousePressedAction,
  MouseReleasedAction,
} from "@event-mapping/schema";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";

export function mouseClickedHandler(
  this: AdminHandler,
  data: MouseClickedAction["data"]
): void {
  this.mouseClicked(data);
}

export function mousePressedHandler(
  this: AdminHandler,
  data: MousePressedAction["data"]
): void {
  this.mousePressed(data);
}

export function mouseReleasedHandler(
  this: AdminHandler,
  data: MouseReleasedAction["data"]
): void {
  this.mouseReleased(data);
}
