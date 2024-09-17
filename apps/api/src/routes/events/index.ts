import { desc, eq, eventInsertSchema, events, like } from "@event-mapping/db";

import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { handleApiError, InternalServerError } from "@/errors";
import { createHono, pagination, withQ } from "@/helper";

const app = createHono.createApp();

app.use(
  "/",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.get("/", async (c) => {
  const { limit, offset } = pagination(c);
  const q = withQ(c);

  const e = await c.var.db
    .select()
    .from(events)
    .where(q ? like(events.name, `%${q}%`) : undefined)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(events.created_at));

  return c.json(e);
});

app.get("/:slug", async (c) => {
  const { slug } = c.req.param();
  const e = await c.var.db.query.events.findFirst({
    where: eq(events.slug, slug),
    with: {
      sources: true,
    },
  });

  if (!e) return c.notFound();

  return c.json(e);
});

app.post("/", zValidator("json", eventInsertSchema), async (c) => {
  const { name, slug } = c.req.valid("json");

  try {
    const e = await c.var.db.insert(events).values({ name, slug }).returning();

    const event = e[0];

    if (!event) {
      const error = new InternalServerError();

      return c.json({ message: error.message }, error.status);
    }

    return c.json(event);
  } catch (error) {
    const { message, status } = handleApiError({ error });

    return c.json({ message }, status);
  }
});

export { app as eventsRouter };
