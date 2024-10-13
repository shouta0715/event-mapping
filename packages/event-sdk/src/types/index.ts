import { Shapes } from "@event-mapping/event-sdk/handlers/shapes";

export * from "./admin";
export * from "./global";
export * from "./p5";

export type EventClientOptions = {
  apiUrl: string;
  wsUrl: string;
  sourceId: string;
};

export interface EventClient<
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> {
  circle: (x: number, y: number, d: number) => void;
  ellipse: (x: number, y: number, w: number, h?: number) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  point: (x: number, y: number, z?: number) => void;
  quad: (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
    detailX?: number,
    detailY?: number
  ) => void;
  rect: (
    x: number,
    y: number,
    w: number,
    h?: number,
    tl?: number,
    tr?: number,
    br?: number,
    bl?: number
  ) => void;
  square: (
    x: number,
    y: number,
    s: number,
    tl?: number,
    tr?: number,
    br?: number,
    bl?: number
  ) => void;
  triangle: (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) => void;
  shapes: Shapes<TMeta>;
}
