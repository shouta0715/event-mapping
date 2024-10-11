export type EventClientOptions = {
  apiUrl: string;
  wsUrl: string;
  sourceId: string;
};

export type ComlinkHandlers = {
  resize: (width: number, height: number) => void;
};
