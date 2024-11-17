import { TerminalData } from "@event-mapping/schema";
import { createId } from "@paralleldrive/cuid2";
import p5 from "p5";

export const getSessionId = () => {
  if (typeof window === "undefined") {
    return createId();
  }

  const persistentId = localStorage.getItem("session_id");

  if (persistentId) {
    return persistentId;
  }

  const newId = createId();

  localStorage.setItem("session_id", newId);

  return newId;
};

export const assertTerminal = (t: TerminalData | null): t is TerminalData => {
  return !!t;
};

export const p5VectorToObject = (v: p5.Vector) => ({
  x: v.x,
  y: v.y,
});
