import { Indexable } from "@timohausmann/quadtree-ts";
import p5 from "p5";
import { TTData, TTrackingData } from "@event-mapping/event-sdk/types/global";

export type ShapeSize = {
  w: number;
  h: number;
};

export interface ShapeProps<TMeta extends TTData = TTData> {
  id?: string;
  position: p5.Vector;
  velocity: p5.Vector;
  size: ShapeSize;
  meta: TMeta;
}

export interface TrackingShapeProps<
  TMeta extends TTData = TTData,
  TrackingData extends TTrackingData = TTrackingData,
> {
  id?: string;
  position: p5.Vector;
  velocity: p5.Vector;
  size: ShapeSize;
  meta: TMeta;
  shareData: TrackingData;
}

export interface EnterShapeProps<
  TrackingData extends TTrackingData = TTrackingData,
> {
  id?: string;
  position: p5.Vector;
  velocity: p5.Vector;
  size: ShapeSize;
  meta: TrackingData;
}

export interface IShape<
  TData extends TTData = TTData,
  TrackingData extends TTrackingData = TTrackingData,
> extends Indexable,
    ShapeProps<TData> {
  tracking: (shape: TrackingShapeProps<TData, TrackingData>) => void;
}

export interface IShapes<
  TData extends TTData = TTData,
  TrackingData extends TTrackingData = TTrackingData,
> {
  items: IShape<TData>[];
  tracking: (
    data: TrackingShapeProps<TData, TrackingData>,
    options?: TrackingShapeOptions
  ) => void;
  add: (data: ShapeProps<TData>) => void;
  remove: (id: string) => void;
  clear: () => void;
  enter: (id: string, shape: EnterShapeProps<TrackingData>) => void;
  exit: (id: string) => void;
  has: (id: string) => boolean;
}

export type TrackingShapeOptions = {
  isCenter: boolean;
  isCircle: boolean;
  margin: number;
};

export const defaultTrackingShapeOptions: TrackingShapeOptions = {
  isCenter: false,
  isCircle: false,
  margin: 0,
};
