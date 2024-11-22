import { EventUploadImage } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleUploadImageAction(
  this: EventHandler,
  data: EventUploadImage["data"]
) {
  const { timestamp, id } = data;

  if (timestamp < Date.now()) return;

  this.images.set(id);

  setTimeout(() => {
    this.images.uploaded({
      url: `${this.baseImageUrl}/${id}`,
      id,
      isAdmin: false,
    });
  }, timestamp - Date.now());
}
