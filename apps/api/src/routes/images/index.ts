import { Hono } from "hono";
import { cache } from "hono/cache";
import { cors } from "hono/cors";
import { Env } from "@/env";
import { getDO } from "@/helper";

const app = new Hono<Env>();

app.use(
  "/:id",
  cors({
    origin: "*",
    allowMethods: ["GET"],
  })
);

app.use(
  "/",
  cors({
    origin: "*",
    allowMethods: ["POST"],
  })
);

app.post("/", async (c) => {
  const obj = getDO(c);

  const id = await obj.uploadImage(c.req.raw);

  return c.json({ id });
});

app.get(
  "/:id",
  cache({
    cacheName: "image",
  }),
  async (c) => {
    const obj = getDO(c);
    const { id } = c.req.param();

    return obj.getImage(id);
  }
);

export { app as imagesRouter };
