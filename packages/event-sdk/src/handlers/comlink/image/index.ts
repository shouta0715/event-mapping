import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";

export function uploadedImageHandler(this: AdminHandler, id: string) {
  const img = this.p.loadImage(`${this.baseImageUrl}/${id}`);
  this.uploadedImage(img, { url: `${this.baseImageUrl}/${id}`, id });
}
