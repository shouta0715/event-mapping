import p5 from "p5";

/**
 * シェイプの種類 https://p5js.org/reference/
 */
export type ShapeType =
  | "circle"
  | "ellipse"
  | "line"
  | "point"
  | "quad"
  | "rect"
  | "square"
  | "triangle";

type ShapeBase = {
  type: ShapeType;
} & Record<string, unknown>;

export interface Circle extends ShapeBase {
  type: "circle";
  d: number;
}

export interface Ellipse extends ShapeBase {
  type: "ellipse";
  w: number;
  h?: number;
}

export interface Line extends ShapeBase {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Point extends ShapeBase {
  type: "point";
  z?: number;
}

export interface Quad extends ShapeBase {
  type: "quad";
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  x4: number;
  y4: number;
  detailX?: number;
  detailY?: number;
}

export interface Rect extends ShapeBase {
  type: "rect";
  w: number;
  h?: number;
  tl?: number;
  tr?: number;
  br?: number;
  bl?: number;
}

export interface Square extends ShapeBase {
  type: "square";
  s: number;
  tl?: number;
  tr?: number;
  br?: number;
  bl?: number;
}

export interface Triangle extends ShapeBase {
  type: "triangle";
  x2: number;
  y2: number;
  x3: number;
  y3: number;
}

type ShapeTypes =
  | Circle
  | Ellipse
  | Line
  | Point
  | Quad
  | Rect
  | Square
  | Triangle;

/**
 * 動くオブジェクト
 * @template TMeta メタデータ
 * @property {string} id オブジェクトのID
 * @property {p5.Vector} position 位置
 * @property {p5.Vector} velocity 速度
 * @property {ShapeTypes} shape 形状とそれらのパラメータ https://p5js.org/reference/
 * @property {TMeta} meta 各自のメタデータ
 *
 */
export type Shape<
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> = {
  id?: string;
  position: p5.Vector;
  velocity: p5.Vector;
} & ShapeTypes &
  TMeta;
