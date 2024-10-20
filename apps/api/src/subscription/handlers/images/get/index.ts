import { BadRequestError } from "@/errors";
import { Subscription } from "@/subscription";

export async function getImageHandler(this: Subscription, id: string) {
  const image = await this.env.IMAGES.get(id);

  if (!image) throw new BadRequestError("Image not found");

  const headers = new Headers();
  image.writeHttpMetadata(headers);
  headers.set("etag", image.httpEtag);
  headers.set("cache-control", "public, max-age=31536000");

  return new Response(image.body, {
    headers,
  });
}
