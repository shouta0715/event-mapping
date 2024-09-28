import { createHono } from "@/helper";
import { eventsRouter } from "@/routes/events";
import { nodesRouter } from "@/routes/nodes";
import { sourcesRouter } from "@/routes/sources";

const app = createHono.createApp();

app.route("/events", eventsRouter);
app.route("/sources", sourcesRouter);
app.route("/sources/:sourceId/nodes", nodesRouter);
export { Subscription } from "./subscription";

export default app;
