import { createHono } from "@/helper";

const app = createHono.createApp();

app.get("/", async (c) => {
  const e = await c.var.db.query.events.findMany();

  return c.json(e);
});

export { app as eventsRouter };
