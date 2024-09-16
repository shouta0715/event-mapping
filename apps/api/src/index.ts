import { createHono } from "@/helper";
import { eventsRouter } from "@/routes/events";

const app = createHono.createApp();

app.route("/events", eventsRouter);

export default app;
