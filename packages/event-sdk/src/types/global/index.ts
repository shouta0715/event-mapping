export type GlobalData = {
  width: number;
  height: number;
};

export type CanSerialize = string | number | boolean | null | TTData | TTData[];

export type TTData = Record<string, unknown>;

export type ShapeMeta = TTData;
