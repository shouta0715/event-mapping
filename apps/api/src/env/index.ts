import { generateDB } from "@event-mapping/db";

export type Env = {
  Bindings: {
    DB: D1Database;
    SUBSCRIPTION: DurableObjectNamespace;
  };
  Variables: {
    db: ReturnType<typeof generateDB>;
  };
};
