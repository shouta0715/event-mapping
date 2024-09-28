import { generateDB } from "@event-mapping/db";
import { Subscription } from "@/subscription";

export type Env = {
  Bindings: {
    DB: D1Database;
    SUBSCRIPTION: DurableObjectNamespace<Subscription>;
  };
  Variables: {
    db: ReturnType<typeof generateDB>;
  };
};
