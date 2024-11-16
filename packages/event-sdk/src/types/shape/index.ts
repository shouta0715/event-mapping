import { Indexable } from "@timohausmann/quadtree-ts";
import p5 from "p5";

type Size =
  | {
      w: number;
      h: number;
    }
  | {
      d: number;
    };

export interface Shape<TMeta extends Record<string, unknown>>
  extends Indexable {
  position: p5.Vector;
  velocity: p5.Vector;
  size: Size;
  data: TMeta;
}
