import { UploadImageAction } from "@event-mapping/schema";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";

export function uploadedImageHandler(
  this: AdminHandler,
  data: UploadImageAction["data"]
) {
  const { id, timestamp } = data;

  if (timestamp < Date.now()) return;

  this.images.set(id);

  setTimeout(() => {
    this.images.uploaded({
      url: `${this.baseImageUrl}/${id}`,
      id,
      isAdmin: true,
    });
  }, timestamp - Date.now());
}
