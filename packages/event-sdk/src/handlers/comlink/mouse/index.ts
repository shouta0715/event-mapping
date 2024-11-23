import {
  MouseClickedAction,
  MousePressedAction,
  MouseReleasedAction,
  MouseDoubleClickedAction,
  MouseMovedAction,
  MouseDraggedAction,
} from "@event-mapping/schema";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";

export function mouseClickedHandler(
  this: AdminHandler,
  data: MouseClickedAction["data"]
): void {
  this.mouseX = data.x;
  this.mouseY = data.y;
  this.mouses.set(data.id, { x: data.x, y: data.y });
  this.mouseClicked(data);
}

export function mousePressedHandler(
  this: AdminHandler,
  data: MousePressedAction["data"]
): void {
  this.mouseX = data.x;
  this.mouseY = data.y;
  this.mouses.set(data.id, { x: data.x, y: data.y });
  this.mousePressed(data);
}

export function mouseReleasedHandler(
  this: AdminHandler,
  data: MouseReleasedAction["data"]
): void {
  this.mouseX = data.x;
  this.mouseY = data.y;
  this.mouses.set(data.id, { x: data.x, y: data.y });
  this.mouseReleased(data);
}

export function mouseDoubleClickedHandler(
  this: AdminHandler,
  data: MouseDoubleClickedAction["data"]
): void {
  this.mouseX = data.x;
  this.mouseY = data.y;
  this.mouses.set(data.id, { x: data.x, y: data.y });
  this.mouseDoubleClicked(data);
}

export function mouseMovedHandler(
  this: AdminHandler,
  data: MouseMovedAction["data"]
): void {
  this.mouseX = data.x;
  this.mouseY = data.y;
  this.mouses.set(data.id, { x: data.x, y: data.y });
  this.mouseMoved(data);
}

export function mouseDraggedHandler(
  this: AdminHandler,
  data: MouseDraggedAction["data"]
): void {
  this.mouseX = data.x;
  this.mouseY = data.y;
  this.mouses.set(data.id, { x: data.x, y: data.y });
  this.mouseDragged(data);
}
