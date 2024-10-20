import { EventUploadImage, UploadImageAction } from "@event-mapping/schema";
import { BadRequestError } from "@/errors";
import { Subscription } from "@/subscription";
import { sendMessage } from "@/utils";

export async function uploadImageHandler(this: Subscription, req: Request) {
  const formData = await req.formData();
  const file = formData.get("image") as File | null;

  if (!file || !this.admin) throw new BadRequestError();

  const id = crypto.randomUUID();
  const arrayBuffer = await file.arrayBuffer();

  await this.env.IMAGES.put(id, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });

  const sessions = this.sessions.keys();

  for (const ws of sessions) {
    sendMessage<EventUploadImage>(ws, {
      action: "uploadImage",
      id,
    });
  }

  sendMessage<UploadImageAction>(this.admin, {
    action: "uploadImage",
    id,
  });

  return id;
}
