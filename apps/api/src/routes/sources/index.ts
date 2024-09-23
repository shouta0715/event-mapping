import { eq, sourceInsertSchema, sources } from "@event-mapping/db";

import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { handleApiError, InternalServerError } from "@/errors";
import { createHono } from "@/helper";

const app = createHono.createApp();

app.use(
  "/:eventId",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.get("/:slug", async (c) => {
  const { slug } = c.req.param();
  const e = await c.var.db.query.sources.findFirst({
    where: eq(sources.slug, slug),
    with: {
      event: true,
    },
  });

  if (!e) return c.notFound();

  return c.json(e);
});

app.post("/:eventId", zValidator("json", sourceInsertSchema), async (c) => {
  const data = c.req.valid("json");
  const { eventId } = c.req.param();
  try {
    const e = await c.var.db
      .insert(sources)
      .values({ ...data, event_id: eventId })
      .returning();

    const source = e[0];

    if (!source) {
      const error = new InternalServerError();

      return c.json({ message: error.message }, error.status);
    }

    return c.json(source);
  } catch (error) {
    const { message, status } = handleApiError({ error });

    return c.json({ message }, status);
  }
});

export { app as sourcesRouter };
