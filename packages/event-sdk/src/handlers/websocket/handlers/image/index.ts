import { EventUploadImage } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function handleUploadImageAction(
  this: EventHandler,
  data: EventUploadImage["data"]
) {
  const { timestamp, id } = data;
  const img = this.p.loadImage(`${this.baseImageUrl}/${id}`);

  if (timestamp < Date.now()) return;

  this.images.set(id, img);

  setTimeout(() => {
    this.uploadedImage({
      url: `${this.baseImageUrl}/${id}`,
      id,
    });
  }, timestamp - Date.now());
}
