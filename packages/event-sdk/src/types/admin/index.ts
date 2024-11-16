import { TerminalData, UploadImageAction } from "@event-mapping/schema";
import { Rectangle } from "@timohausmann/quadtree-ts";
import { GlobalData } from "@event-mapping/event-sdk/types/global";

export type ComlinkHandlers = {
  resize: (width: number, height: number) => void;
  join: (terminal: TerminalData) => void;
  leave: (id: string) => void;
  initialize: (terminals: TerminalData[], global: GlobalData) => void;
  uploaded: (data: UploadImageAction["data"]) => void;
};

export type QuadtreeShape = Rectangle<TerminalData>;
