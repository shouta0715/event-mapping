import { terminalDataSchema } from "@event-mapping/schema";
import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { Env } from "@/env";

const app = new Hono<Env>();

app.use(
  cors({
    origin: "*",
    allowMethods: ["PATCH"],
    allowHeaders: ["Content-Type"],
  })
);

const getDO = (c: Context<Env>) => {
  const { sourceId } = c.req.param();
  const subscription = c.env.SUBSCRIPTION.idFromName(sourceId);
  const stub = c.env.SUBSCRIPTION.get(subscription);

  return stub;
};

app.patch("/:id", zValidator("json", terminalDataSchema), async (c) => {
  const obj = getDO(c);
  const { id } = c.req.param();

  const data = c.req.valid("json");

  const res = await obj.patchNode(id, data);

  return c.json(res);
});

export { app as nodesRouter };
