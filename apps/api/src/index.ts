import { createHono } from "@/helper";
import { eventsRouter } from "@/routes/events";
import { sourcesRouter } from "@/routes/sources";

const app = createHono.createApp();

app.route("/events", eventsRouter);
app.route("/sources", sourcesRouter);

export { Subscription } from "./subscription";

export default app;
