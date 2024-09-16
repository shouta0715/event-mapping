import { eq, events } from "@event-mapping/db";

import { createHono, pagination } from "@/helper";

const app = createHono.createApp();

app.get("/", async (c) => {
  const { limit, offset } = pagination(c);

  const e = await c.var.db.select().from(events).limit(limit).offset(offset);

  return c.json(e);
});

app.get("/:id", async (c) => {
  const { id } = c.req.param();
  const e = await c.var.db.query.events.findFirst({
    where: eq(events.id, id),
    with: {
      sources: true,
    },
  });

  if (!e) return c.notFound();

  return c.json(e);
});

export { app as eventsRouter };
