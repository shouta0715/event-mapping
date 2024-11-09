// 同期関数を非同期関数に変換する
export const asyncify = <T extends (...args: unknown[]) => unknown>(fn: T) => {
  return async (...args: Parameters<T>) => {
    return fn(...args);
  };
};
