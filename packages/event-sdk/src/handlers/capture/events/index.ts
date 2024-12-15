/* eslint-disable @typescript-eslint/no-explicit-any */
import { StreamingAnswerAction } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { EventWebRTC } from "@event-mapping/event-sdk/handlers/rtc/events";

function sendStreamingAnswer(
  this: EventHandler,
  data: StreamingAnswerAction["data"]
) {
  const message: StreamingAnswerAction = {
    action: "streamingAnswer",
    data,
  };

  this.ws.send(JSON.stringify(message));
}

export function createCapture(
  this: EventHandler,
  onTrack: (stream: MediaStream) => void
): EventWebRTC | null {
  if (!this.terminal?.id) {
    // eslint-disable-next-line no-console
    console.warn("No terminal id found");

    return null;
  }

  const rtc = new EventWebRTC({
    id: this.terminal?.id,
    streamingAnswer: sendStreamingAnswer.bind(this),
    onTrack,
  });

  return rtc;
}
