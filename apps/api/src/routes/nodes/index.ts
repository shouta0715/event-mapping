import { terminalDataSchema } from "@event-mapping/schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { Env } from "@/env";
import { getDO } from "@/helper";

const app = new Hono<Env>();

app.use(
  cors({
    origin: "*",
    allowMethods: ["PATCH", "DELETE"],
    allowHeaders: ["Content-Type"],
  })
);

app.patch("/:id", zValidator("json", terminalDataSchema), async (c) => {
  const obj = getDO(c);
  const { id } = c.req.param();

  const data = c.req.valid("json");

  const res = await obj.patchNode(id, data);

  if (!res) return c.json({ message: "not found" }, 404);

  return c.json(res);
});

app.delete("/:id", async (c) => {
  const obj = getDO(c);
  const { id } = c.req.param();

  await obj.deleteNodeCache(id);

  return c.json({
    message: "ok",
  });
});

app.post(
  "/:id/prompt",
  zValidator("json", z.object({ timestamp: z.number() })),
  async (c) => {
    const obj = getDO(c);
    const { id } = c.req.param();

    const { timestamp } = c.req.valid("json");

    const time = await obj.eventPrompt(id, timestamp);

    return c.json({ time });
  }
);

export { app as nodesRouter };
