import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function trackStream(this: EventHandler, stream: MediaStream) {
  const video = document.querySelector<HTMLVideoElement>("#video");
  if (!video) {
    console.error("No #video element found");

    return;
  }

  // video要素の属性設定
  video.muted = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("autoplay", "");
  video.controls = true; // テスト中はコントロール表示で存在確認

  video.style.width = "640px";
  video.style.height = "480px";
  video.style.display = "block";

  console.log("Assigning stream to video.srcObject");
  video.srcObject = stream;

  const track = stream.getVideoTracks()[0];
  if (!track) {
    console.error("No video track found in the provided stream.");

    return;
  }

  // トラックがunmuteになった＝映像が流れ始めるタイミング
  track.onunmute = () => {
    console.log("Track is now unmuted and frames should be incoming");
    video
      .play()
      .then(() => {
        console.log("Video is playing");
      })
      .catch((err) => console.error("Error playing video:", err));
  };

  // デバッグ用: イベントリスナー追加
  video.addEventListener("loadeddata", () => {
    console.log("loadeddata event fired");
  });
  video.addEventListener("canplay", () => {
    console.log("canplay event fired");
    video
      .play()
      .catch((err) => console.error("Play after canplay error:", err));
  });
  video.addEventListener("error", () => {
    console.error("Video element error:", video.error);
  });
}
