import { generateDB } from "@event-mapping/db";
import { Subscription } from "@/subscription";

export type Env = {
  Bindings: {
    readonly DB: D1Database;
    readonly SUBSCRIPTION: DurableObjectNamespace<Subscription>;
    readonly IMAGES: R2Bucket;
  };
  Variables: {
    readonly db: ReturnType<typeof generateDB>;
  };
};
