import { Indexable } from "@timohausmann/quadtree-ts";
import p5 from "p5";
import { TTData } from "@event-mapping/event-sdk/types/global";

export type ShapeSize =
  | {
      w: number;
      h: number;
    }
  | {
      d: number;
    };

export interface ShapeProps<TMeta extends TTData = TTData> {
  id?: string;
  position: p5.Vector;
  velocity: p5.Vector;
  size: ShapeSize;
  data: TMeta;
}

export interface IShape<TData extends TTData = TTData>
  extends Indexable,
    ShapeProps<TData> {}

export interface IShapes<TData extends TTData = TTData> {
  items: IShape<TData>[];
  add: (data: ShapeProps<TData>) => void;
  remove: (id: string, data: ShapeProps<TData>) => void;
  clear: () => void;
}
