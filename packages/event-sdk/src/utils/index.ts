import { createId } from "@paralleldrive/cuid2";

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
