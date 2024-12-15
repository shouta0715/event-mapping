import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function trackStream(this: EventHandler, stream: MediaStream) {
  const video = this.p.createVideo("");
  video.elt.setAttribute("playsinline", "");
  video.elt.muted = true;
  video.elt.autoplay = true;
  video.elt.srcObject = stream;
  // eslint-disable-next-line no-console
  video.elt.play().catch(console.error);

  video.hide();
  this._capture = video;
}
