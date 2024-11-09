import { UploadImageAction } from "@event-mapping/schema";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";

export function uploadedImageHandler(
  this: AdminHandler,
  data: UploadImageAction["data"]
) {
  const { id, timestamp } = data;
  const img = this.p.loadImage(`${this.baseImageUrl}/${id}`);

  if (timestamp < Date.now()) return;

  setTimeout(() => {
    this.uploadedImage(img, {
      url: `${this.baseImageUrl}/${id}`,
      id,
    });
  }, timestamp - Date.now());
}
