import { UploadImageAction } from "@event-mapping/schema";
import { BadRequestError } from "@/errors";
import { Subscription } from "@/subscription";
import { sendMessage } from "@/utils";
import { asyncify } from "@/utils/asyncify";

const DELAY_TIME = 1000;

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

  const promises: Promise<unknown>[] = [];

  const timestamp = Date.now() + DELAY_TIME;

  const data = {
    id,
    timestamp,
  };

  for (const ws of sessions) {
    const promise = asyncify(() =>
      sendMessage<UploadImageAction>(ws, {
        action: "uploadImage",
        data,
      })
    );

    promises.push(promise());
  }

  const { admin } = this;

  const adminPromise = asyncify(() =>
    sendMessage<UploadImageAction>(admin, {
      action: "uploadImage",
      data,
    })
  );

  promises.push(adminPromise());

  await Promise.all(promises);

  return id;
}
