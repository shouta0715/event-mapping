import { Source } from "@event-mapping/db";
import { GlobalData } from "@event-mapping/schema";
import { Subscription } from "@/subscription";

export function saveAdmin(
  this: Subscription,
  data: { source: Source; global: GlobalData }
) {
  const { admin } = this;

  if (!admin) return;

  admin.serializeAttachment(data);

  this.source = data.source;
  this.global = data.global;
}
