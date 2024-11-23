import { atom } from "jotai";

export type HealthCheckStatus = "connecting" | "open" | "closed";

export const isHealthyAtom = atom<HealthCheckStatus>("connecting");
