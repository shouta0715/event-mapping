import { Subscription } from "@/subscription";

export function hibernationHandler(this: Subscription) {
  const sessions = this.state.getWebSockets("session");

  const admins = this.state.getWebSockets("admin");

  for (const ws of sessions) {
    const meta = ws.deserializeAttachment();
    this.sessions.set(ws, meta);
  }

  for (const ws of admins) {
    const meta = ws.deserializeAttachment();
    this.admin = ws;
    this.source = meta;
  }
}
