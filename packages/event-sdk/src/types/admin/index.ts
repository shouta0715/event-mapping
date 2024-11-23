import {
  EnterShapeAction,
  MouseClickedAction,
  MousePressedAction,
  MouseReleasedAction,
  PromptAction,
  TerminalData,
  UploadImageAction,
  MouseDoubleClickedAction,
  MouseMovedAction,
  MouseDraggedAction,
} from "@event-mapping/schema";
import { Rectangle } from "@timohausmann/quadtree-ts";
import { GlobalData } from "@event-mapping/event-sdk/types/global";

export type ComlinkHandlers = {
  resize: (width: number, height: number) => void;
  join: (terminal: TerminalData) => void;
  leave: (id: string) => void;
  healthCheck: () => boolean;
  initialize: (terminals: TerminalData[], global: GlobalData) => void;
  uploaded: (data: UploadImageAction["data"]) => void;
  prompt: (data: PromptAction["data"]) => void;
  mouseClicked: (data: MouseClickedAction["data"]) => void;
  mousePressed: (data: MousePressedAction["data"]) => void;
  mouseReleased: (data: MouseReleasedAction["data"]) => void;
  mouseDoubleClicked: (data: MouseDoubleClickedAction["data"]) => void;
  mouseMoved: (data: MouseMovedAction["data"]) => void;
  mouseDragged: (data: MouseDraggedAction["data"]) => void;
};

export type AdminComlinkHandlers = {
  enterShape: (rectId: string, shape: EnterShapeAction["data"]) => void;
  leaveShape: (rectId: string, id: string) => void;
};

export type QuadtreeShape = Rectangle<TerminalData>;
