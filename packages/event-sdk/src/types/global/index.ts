export type GlobalData = {
  width: number;
  height: number;
};

export type CanSerialize = string | number | boolean | null;

export type TTData = Record<string, unknown>;

export type ShapeMeta = TTData;

export type TTrackingData = Record<
  string,
  CanSerialize | Record<string, CanSerialize> | CanSerialize[]
>;
