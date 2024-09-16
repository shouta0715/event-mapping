import { generateDB } from "@event-mapping/db";
import { createFactory } from "hono/factory";
import { Env } from "@/env";

export const createHono = createFactory<Env>({
  initApp: (app) => {
    app.use(async (c, next) => {
      const db = generateDB(c.env.DB);

      c.set("db", db);
      await next();
    });
  },
});
